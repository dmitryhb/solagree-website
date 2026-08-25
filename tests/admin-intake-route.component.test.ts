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
import type { ComputedRef, Ref } from 'vue'
import { useSolagreeSeo } from '../app/composables/useSolagreeSeo'
import AdminIntakeRoute from '../app/pages/meet/[slug]/index.vue'
import { verifyAdminIntakeSlug } from '../app/services/admin-intake-api'
import type { AdminIntakeSlugVerification } from '../app/services/admin-intake-api'
import { PortalApiConfigurationError } from '../app/services/portal-api'

vi.mock('~/services/admin-intake-api', () => ({
  verifyAdminIntakeSlug: vi.fn()
}))

vi.mock('~/components/admin-intake/AdminIntakePage.vue', async () => {
  const { defineComponent: defineStubComponent } = await import('vue')

  return {
    default: defineStubComponent({
      name: 'AdminIntakePage',
      props: { slug: { type: String, required: true } },
      setup(props: { slug: string }) {
        return () => h('div', { class: 'admin-intake-page-stub', 'data-slug': props.slug }, props.slug)
      }
    })
  }
})

const verifySlugMock = vi.mocked(verifyAdminIntakeSlug)

const routeState = reactive({ slug: 'alpha-link' })
const showErrorCalls: unknown[] = []
const seoMetaCalls: Array<Record<string, unknown>> = []
const headEntries: Array<() => { link?: Array<{ rel?: string, href?: string }> }> = []

/**
 * Minimal `useAsyncData` stand-in mirroring the Nuxt behaviors the page
 * relies on: computed keys, `options.watch`, a synchronous key watcher, and
 * handing the previous key's data to the new key while its refetch is still
 * pending so callers must gate on `status`.
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

const createDeferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve
    reject = promiseReject
  })

  return { promise, resolve, reject }
}

Object.assign(globalThis, {
  $fetch: async () => ({}),
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

const mountIntakeRoute = () => {
  const routeErrors: unknown[] = []
  const IntakeRouteHost = defineComponent({
    name: 'AdminIntakeRouteHost',
    setup() {
      onErrorCaptured((error: unknown) => {
        routeErrors.push(error)

        return false
      })

      return () => h(Suspense, null, { default: () => h(AdminIntakeRoute) })
    }
  })

  const wrapper = mount(IntakeRouteHost, {
    global: {
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

const getRenderedSlug = (wrapper: ReturnType<typeof mountIntakeRoute>['wrapper']) => {
  return wrapper.get('.admin-intake-page-stub').attributes('data-slug')
}

const portalError = (statusCode: number, statusMessage: string) => {
  return Object.assign(new Error(`[GET] "https://portal.solagree.test/...": ${statusCode} ${statusMessage}`), {
    statusCode,
    statusMessage
  })
}

beforeEach(() => {
  routeState.slug = 'alpha-link'
  asyncDataRecords.clear()
  showErrorCalls.length = 0
  seoMetaCalls.length = 0
  headEntries.length = 0
  verifySlugMock.mockReset()
})

describe('Admin intake route runtime', () => {
  it('renders the intake form for the verified slug after direct entry', async () => {
    verifySlugMock.mockImplementation(async () => ({ status: 'verified' }))

    const { wrapper } = mountIntakeRoute()

    await settleAsyncData()

    expect(verifySlugMock).toHaveBeenCalledTimes(1)
    expect(verifySlugMock).toHaveBeenCalledWith('alpha-link', {
      portalApiBaseUrl: 'https://portal.solagree.test',
      fetcher: expect.any(Function)
    })
    expect(getRenderedSlug(wrapper)).toBe('alpha-link')
  })

  it('keeps the intake route noindex with the slug-specific canonical path', async () => {
    verifySlugMock.mockImplementation(async () => ({ status: 'verified' }))

    mountIntakeRoute()

    await settleAsyncData()

    const seoInput = seoMetaCalls[0] as { robots: ComputedRef<string> } | undefined
    const canonicalLink = headEntries[0]?.().link?.find(link => link.rel === 'canonical')

    expect(seoInput?.robots.value).toBe('noindex, nofollow')
    expect(canonicalLink?.href).toBe('https://www.solagree.com/meet/alpha-link')
  })

  it('re-verifies on parameter navigation and never renders the new slug while it is unverified', async () => {
    const betaVerification = createDeferred<AdminIntakeSlugVerification>()

    verifySlugMock.mockImplementation(async (slug: string) => {
      return slug === 'beta-link' ? betaVerification.promise : { status: 'verified' }
    })

    const { wrapper } = mountIntakeRoute()

    await settleAsyncData()

    expect(getRenderedSlug(wrapper)).toBe('alpha-link')

    routeState.slug = '  beta-link  '

    await nextTick()

    expect(verifySlugMock).toHaveBeenCalledTimes(2)
    expect(verifySlugMock).toHaveBeenLastCalledWith('beta-link', {
      portalApiBaseUrl: 'https://portal.solagree.test',
      fetcher: expect.any(Function)
    })
    expect(wrapper.find('.admin-intake-page-stub').exists()).toBe(false)
    expect(wrapper.get('[role="status"]').attributes('aria-label')).toBe('Verifying intake link')

    betaVerification.resolve({ status: 'verified' })

    await settleAsyncData()

    expect(getRenderedSlug(wrapper)).toBe('beta-link')
  })

  const navigationOutcomeCases: Array<{
    label: string
    betaResult: () => Promise<AdminIntakeSlugVerification>
    expectedStatusCode: number
  }> = [
    {
      label: 'a portal-confirmed missing slug raises the existing fatal 404',
      betaResult: async () => ({ status: 'missing' }),
      expectedStatusCode: 404
    },
    {
      label: 'a portal 5xx preserves the upstream status instead of a 404',
      betaResult: async () => {
        throw portalError(503, 'Service Unavailable')
      },
      expectedStatusCode: 503
    },
    {
      label: 'a network or timeout failure surfaces a 502 instead of a 404',
      betaResult: async () => {
        throw new TypeError('fetch failed')
      },
      expectedStatusCode: 502
    },
    {
      label: 'a malformed verification payload surfaces a 502 instead of a 404',
      betaResult: async () => ({ status: 'invalid-response' }),
      expectedStatusCode: 502
    },
    {
      label: 'a missing portal configuration surfaces a 500 instead of a 404',
      betaResult: async () => {
        throw new PortalApiConfigurationError()
      },
      expectedStatusCode: 500
    }
  ]

  it.each(navigationOutcomeCases)('parameter navigation where $label', async ({ betaResult, expectedStatusCode }) => {
    verifySlugMock.mockImplementation(async (slug: string) => {
      return slug === 'beta-link' ? betaResult() : { status: 'verified' }
    })

    const { wrapper } = mountIntakeRoute()

    await settleAsyncData()

    expect(getRenderedSlug(wrapper)).toBe('alpha-link')

    routeState.slug = 'beta-link'

    await settleAsyncData()

    expect(showErrorCalls).toHaveLength(1)
    expect(showErrorCalls[0]).toMatchObject({ statusCode: expectedStatusCode, fatal: true })
    expect(wrapper.find('.admin-intake-page-stub').exists()).toBe(false)
  })

  const directEntryOutcomeCases: Array<{
    label: string
    alphaResult: () => Promise<AdminIntakeSlugVerification>
    expectedStatusCode: number
  }> = [
    {
      label: 'a portal-confirmed missing slug throws the existing fatal 404',
      alphaResult: async () => ({ status: 'missing' }),
      expectedStatusCode: 404
    },
    {
      label: 'a portal 5xx throws the preserved upstream status instead of a 404',
      alphaResult: async () => {
        throw portalError(500, 'Internal Server Error')
      },
      expectedStatusCode: 500
    },
    {
      label: 'a network failure throws a 502 instead of a 404',
      alphaResult: async () => {
        throw new TypeError('fetch failed')
      },
      expectedStatusCode: 502
    },
    {
      label: 'a malformed verification payload throws a 502 instead of a 404',
      alphaResult: async () => ({ status: 'invalid-response' }),
      expectedStatusCode: 502
    },
    {
      label: 'a missing portal configuration throws a 500 instead of a 404',
      alphaResult: async () => {
        throw new PortalApiConfigurationError()
      },
      expectedStatusCode: 500
    }
  ]

  it.each(directEntryOutcomeCases)('direct entry where $label', async ({ alphaResult, expectedStatusCode }) => {
    verifySlugMock.mockImplementation(async () => alphaResult())

    const { routeErrors, wrapper } = mountIntakeRoute()

    await settleAsyncData()

    expect(routeErrors).toHaveLength(1)
    expect(routeErrors[0]).toMatchObject({ statusCode: expectedStatusCode, fatal: true })
    expect(showErrorCalls).toHaveLength(0)
    expect(wrapper.find('.admin-intake-page-stub').exists()).toBe(false)
  })
})
