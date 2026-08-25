import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  Suspense,
  computed,
  defineComponent,
  h,
  isRef,
  nextTick,
  onErrorCaptured,
  reactive,
  ref,
  shallowRef,
  watch
} from 'vue'
import type { Component, ComputedRef, Ref } from 'vue'
import CoBrandedPageRouteShell from '../app/components/co-branded/CoBrandedPageRouteShell.vue'
import { useSolagreeSeo } from '../app/composables/useSolagreeSeo'
import CdfaGoEmbedPage from '../app/pages/cdfa/go/[slug]/embed.vue'
import CdfaGoPage from '../app/pages/cdfa/go/[slug]/index.vue'
import GoEmbedPage from '../app/pages/go/[slug]/embed.vue'
import GoPage from '../app/pages/go/[slug]/index.vue'
import { fetchCoBrandedPageConfig } from '../app/services/co-branded-page-api'
import { PortalApiConfigurationError } from '../app/services/portal-api'
import type { CoBrandedPagePublicConfig } from '../shared/types/co-branded-page'

vi.mock('~/services/co-branded-page-api', () => ({
  fetchCoBrandedPageConfig: vi.fn()
}))

vi.mock('~/components/co-branded/CoBrandedPageRenderer.vue', async () => {
  const { defineComponent: defineStubComponent } = await import('vue')

  return {
    default: defineStubComponent({
      name: 'CoBrandedPageRenderer',
      props: {
        config: { type: Object, required: true },
        mode: { type: String, required: true }
      },
      setup(props: { config: CoBrandedPagePublicConfig, mode: string }) {
        return () => h(
          'div',
          {
            class: 'co-branded-page-renderer-stub',
            'data-mode': props.mode,
            'data-company-name': props.config.companyName
          },
          props.config.companyName
        )
      }
    })
  }
})

const fetchConfigMock = vi.mocked(fetchCoBrandedPageConfig)

const routeState = reactive({ slug: 'rivera-mediation' })
const showErrorCalls: unknown[] = []
const seoMetaCalls: Array<Record<string, unknown>> = []
const headEntries: Array<() => { link?: Array<{ rel?: string, href?: string }> }> = []

/**
 * Minimal `useAsyncData` stand-in mirroring the Nuxt behaviors the shell
 * relies on: computed keys, `options.watch`, a synchronous key watcher, and
 * settling the initial run before the awaited setup continues so callers see
 * the final `status` for the requested slug.
 */
type HarnessStatus = 'idle' | 'pending' | 'success' | 'error'

interface HarnessRecord {
  data: Ref<unknown>
  error: Ref<unknown>
  status: Ref<HarnessStatus>
}

const createUseAsyncDataHarness = () => {
  const records = new Map<string, HarnessRecord>()

  const createRecord = (initialData: unknown): HarnessRecord => ({
    data: ref(initialData),
    error: ref(null),
    status: ref<HarnessStatus>('idle')
  })

  const run = async (record: HarnessRecord, handler: () => Promise<unknown>) => {
    record.status.value = 'pending'

    try {
      record.data.value = await handler()
      record.error.value = null
      record.status.value = 'success'
    } catch (error) {
      record.error.value = error
      record.data.value = undefined
      record.status.value = 'error'
    }
  }

  const useAsyncData = (
    key: string | Ref<string>,
    handler: () => Promise<unknown>,
    options: { watch?: Array<unknown> } = {}
  ) => {
    const keyRef = isRef(key) ? computed(() => String(key.value)) : ref(String(key))
    const initialRecord = records.get(keyRef.value) ?? createRecord(undefined)

    records.set(keyRef.value, initialRecord)

    const currentRecord = shallowRef(initialRecord)

    watch(keyRef, () => {
      const previousRecord = currentRecord.value
      const nextRecord = records.get(keyRef.value) ?? createRecord(previousRecord.data.value)

      records.set(keyRef.value, nextRecord)
      currentRecord.value = nextRecord
      void run(nextRecord, handler)
    }, { flush: 'sync' })

    for (const source of options.watch ?? []) {
      watch(source, () => {
        if (currentRecord.value.status.value === 'pending') {
          return
        }

        void run(currentRecord.value, handler)
      })
    }

    const initialRun = initialRecord.status.value === 'idle'
      ? run(initialRecord, handler)
      : Promise.resolve()

    const result = {
      data: computed({
        get: () => currentRecord.value.data.value,
        set: (value: unknown) => {
          currentRecord.value.data.value = value
        }
      }),
      error: computed(() => currentRecord.value.error.value),
      status: computed(() => currentRecord.value.status.value)
    }

    return initialRun.then(() => result)
  }

  return { records, useAsyncData }
}

const { records: asyncDataRecords, useAsyncData } = createUseAsyncDataHarness()

const createErrorStub = (input: { fatal?: boolean, statusCode?: number, statusMessage?: string }): Error & { fatal?: boolean, statusCode?: number } => {
  return Object.assign(new Error(input.statusMessage ?? ''), input)
}

Object.assign(globalThis, {
  computed,
  createError: createErrorStub,
  showError: (error: unknown) => {
    showErrorCalls.push(error)
  },
  useAsyncData,
  useHead: (entry: () => { link?: Array<{ rel?: string, href?: string }> }) => {
    headEntries.push(entry)
  },
  useRoute: () => ({ params: routeState }),
  useRuntimeConfig: () => ({
    public: {
      portalApiBaseUrl: 'https://portal.solagree.test',
      siteUrl: 'https://www.solagree.com'
    }
  }),
  useSeoMeta: (input: Record<string, unknown>) => {
    seoMetaCalls.push(input)
  },
  useSolagreeSeo,
  watch
})

enableAutoUnmount(afterEach)

const mountRoute = (page: Component) => {
  const routeErrors: unknown[] = []
  const RouteHost = defineComponent({
    name: 'CoBrandedRouteHost',
    setup() {
      onErrorCaptured((error: unknown) => {
        routeErrors.push(error)

        return false
      })

      return () => h(Suspense, null, { default: () => h(page) })
    }
  })

  const wrapper = mount(RouteHost, {
    global: {
      components: {
        CoBrandedPageRouteShell
      },
      config: {
        errorHandler: (error: unknown) => {
          routeErrors.push(error)
        }
      }
    }
  })

  return { routeErrors, wrapper }
}

const settleAsyncData = async () => {
  await flushPromises()
  await nextTick()
}

const createPortalConfig = (pageType: 'standard' | 'cdfa' = 'standard'): CoBrandedPagePublicConfig => ({
  pageType,
  slug: routeState.slug,
  templateId: pageType === 'cdfa' ? 'cdfa-basic-v1' : 'solagree-basic-v1',
  companyName: 'Rivera Mediation',
  attorneyName: 'Jamie Rivera',
  firmName: 'Rivera Mediation LLC',
  phoneNumber: '415-555-1234',
  emailAddress: 'jamie@rivera.test',
  logoUrl: 'https://portal.solagree.test/uploads/rivera-logo.png',
  ctaUrl: '/book-an-attorney-consult?ref=rivera-mediation'
})

const portalError = (statusCode: number, statusMessage: string) => {
  return Object.assign(new Error(`[GET] "https://portal.solagree.test/...": ${statusCode} ${statusMessage}`), {
    statusCode,
    statusMessage
  })
}

const routeVariants = [
  {
    label: 'standard page',
    page: GoPage,
    mode: 'page',
    pageType: 'standard' as const,
    seoPath: '/go/rivera-mediation'
  },
  {
    label: 'standard embed',
    page: GoEmbedPage,
    mode: 'embed',
    pageType: 'standard' as const,
    seoPath: '/go/rivera-mediation/embed'
  },
  {
    label: 'cdfa page',
    page: CdfaGoPage,
    mode: 'page',
    pageType: 'cdfa' as const,
    seoPath: '/cdfa/go/rivera-mediation'
  },
  {
    label: 'cdfa embed',
    page: CdfaGoEmbedPage,
    mode: 'embed',
    pageType: 'cdfa' as const,
    seoPath: '/cdfa/go/rivera-mediation/embed'
  }
]

beforeEach(() => {
  routeState.slug = 'rivera-mediation'
  asyncDataRecords.clear()
  showErrorCalls.length = 0
  seoMetaCalls.length = 0
  headEntries.length = 0
  fetchConfigMock.mockReset()
})

describe('Co-branded route runtime', () => {
  it.each(routeVariants)('renders the partner page after the client configuration loads ($label)', async ({ page, mode, pageType }) => {
    fetchConfigMock.mockImplementation(async () => createPortalConfig(pageType))

    const { routeErrors, wrapper } = mountRoute(page)

    await settleAsyncData()

    expect(routeErrors).toHaveLength(0)
    expect(fetchConfigMock).toHaveBeenCalledWith({
      portalApiBaseUrl: 'https://portal.solagree.test',
      slug: 'rivera-mediation',
      pageType
    })

    const renderer = wrapper.get('.co-branded-page-renderer-stub')

    expect(renderer.attributes('data-mode')).toBe(mode)
    expect(renderer.attributes('data-company-name')).toBe('Rivera Mediation')
  })

  it.each(routeVariants)('keeps every route variant noindex with the route-specific canonical path ($label)', async ({ page, seoPath }) => {
    fetchConfigMock.mockImplementation(async () => createPortalConfig())

    mountRoute(page)

    await settleAsyncData()

    const seoInput = seoMetaCalls[0] as { robots: ComputedRef<string> } | undefined
    const canonicalLink = headEntries[0]?.().link?.find(link => link.rel === 'canonical')

    expect(seoInput?.robots.value).toBe('noindex, nofollow')
    expect(canonicalLink?.href).toBe(`https://www.solagree.com${seoPath}`)
  })

  it.each(routeVariants)('surfaces a fatal 404 when the portal confirms the slug is missing ($label)', async ({ page }) => {
    fetchConfigMock.mockImplementation(async () => null)

    const { routeErrors, wrapper } = mountRoute(page)

    await settleAsyncData()

    expect(routeErrors).toHaveLength(1)
    expect(routeErrors[0]).toMatchObject({ statusCode: 404, fatal: true })
    expect(wrapper.find('.co-branded-page-renderer-stub').exists()).toBe(false)
  })

  const failureCases: Array<{
    label: string
    lookupFailure: () => Promise<never>
    expectedStatusCode: number
  }> = [
    {
      label: 'a portal 5xx preserves the upstream status instead of a 404',
      lookupFailure: async () => {
        throw portalError(503, 'Service Unavailable')
      },
      expectedStatusCode: 503
    },
    {
      label: 'a network or timeout failure surfaces a 502 instead of a 404',
      lookupFailure: async () => {
        throw new TypeError('fetch failed')
      },
      expectedStatusCode: 502
    },
    {
      label: 'a missing portal configuration surfaces a 500 instead of a 404',
      lookupFailure: async () => {
        throw new PortalApiConfigurationError()
      },
      expectedStatusCode: 500
    }
  ]

  it.each(failureCases)('direct entry where $label', async ({ lookupFailure, expectedStatusCode }) => {
    fetchConfigMock.mockImplementation(lookupFailure)

    const { routeErrors, wrapper } = mountRoute(GoPage)

    await settleAsyncData()

    expect(routeErrors).toHaveLength(1)
    expect(routeErrors[0]).toMatchObject({ statusCode: expectedStatusCode, fatal: true })
    expect(routeErrors[0]).not.toMatchObject({ statusCode: 404 })
    expect(wrapper.find('.co-branded-page-renderer-stub').exists()).toBe(false)
  })

  it('parameter navigation to a missing slug raises the fatal 404 through showError', async () => {
    fetchConfigMock.mockImplementation(async () => createPortalConfig())

    const { wrapper } = mountRoute(GoPage)

    await settleAsyncData()

    expect(wrapper.find('.co-branded-page-renderer-stub').exists()).toBe(true)

    fetchConfigMock.mockImplementation(async () => null)
    routeState.slug = 'missing-partner'

    await settleAsyncData()

    expect(showErrorCalls).toHaveLength(1)
    expect(showErrorCalls[0]).toMatchObject({ statusCode: 404, fatal: true })
  })

  it('parameter navigation to an upstream failure raises the preserved status through showError', async () => {
    fetchConfigMock.mockImplementation(async () => createPortalConfig())

    mountRoute(GoPage)

    await settleAsyncData()

    fetchConfigMock.mockImplementation(async () => {
      throw portalError(500, 'Internal Server Error')
    })
    routeState.slug = 'failing-partner'

    await settleAsyncData()

    expect(showErrorCalls).toHaveLength(1)
    expect(showErrorCalls[0]).toMatchObject({ statusCode: 500, fatal: true })
  })
})
