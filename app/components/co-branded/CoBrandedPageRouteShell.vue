<script setup lang="ts">
import CoBrandedPageRenderer from '~/components/co-branded/CoBrandedPageRenderer.vue'
import { fetchCoBrandedPageConfig } from '~/services/co-branded-page-api'
import { isPortalApiConfigurationError } from '~/services/portal-api'
import type { CoBrandedPageRenderMode } from '~/types/co-branded-page'

const CO_BRANDED_UNAVAILABLE_STATUS_MESSAGE = 'We could not load this Solagree partner page right now. Please try again.'
const CO_BRANDED_FALLBACK_STATUS_CODE = 502

const props = withDefaults(defineProps<{
  mode: CoBrandedPageRenderMode
  seoPath: string
  pageType?: 'standard' | 'cdfa'
  noIndex?: boolean
  wrapperClass?: string
}>(), {
  pageType: 'standard',
  // Co-branded configuration only loads on the client behind the static
  // /200.html fallback, so every route in this family must stay non-indexable
  // until the site has a server/prerender source of valid slugs. nginx adds the
  // matching X-Robots-Tag response header for the initial HTTP response.
  noIndex: true,
  wrapperClass: ''
})

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slug = computed(() => String(route.params.slug || '').trim())
const asyncDataKey = computed(() => `co-branded-page:${props.pageType}:${props.mode}:${slug.value}`)

const getPortalErrorStatusCode = (error: unknown): number | null => {
  if (typeof error !== 'object' || error === null || !('statusCode' in error)) {
    return null
  }

  const { statusCode } = error as { statusCode?: unknown }

  return typeof statusCode === 'number' ? statusCode : null
}

/**
 * Converts a portal lookup failure into the route error that should be
 * surfaced: a 404 only when the portal confirmed the slug is missing, and the
 * preserved upstream status (or a 502/500 fallback) for everything else.
 */
const createCoBrandedRouteError = (error: unknown) => {
  if (isPortalApiConfigurationError(error)) {
    return createError({
      statusCode: 500,
      statusMessage: CO_BRANDED_UNAVAILABLE_STATUS_MESSAGE,
      fatal: true
    })
  }

  const statusCode = getPortalErrorStatusCode(error)

  if (statusCode === 404) {
    return createError({ statusCode: 404, fatal: true })
  }

  if (statusCode !== null && statusCode >= 400) {
    return createError({
      statusCode,
      statusMessage: CO_BRANDED_UNAVAILABLE_STATUS_MESSAGE,
      fatal: true
    })
  }

  return createError({
    statusCode: CO_BRANDED_FALLBACK_STATUS_CODE,
    statusMessage: CO_BRANDED_UNAVAILABLE_STATUS_MESSAGE,
    fatal: true
  })
}

const {
  data: coBrandedPage,
  error: lookupError,
  status
} = await useAsyncData(
  asyncDataKey,
  async () => {
    try {
      const config = await fetchCoBrandedPageConfig({
        portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
        slug: slug.value,
        pageType: props.pageType
      })

      if (!config) {
        throw createError({ statusCode: 404, fatal: true })
      }

      return config
    } catch (lookupError) {
      throw createCoBrandedRouteError(lookupError)
    }
  },
  {
    server: false,
    watch: [slug]
  }
)

/**
 * Resolves the error that must be surfaced for the current slug. The static
 * host cannot answer with a true HTTP 404 for these URLs, so the surfaced
 * error renders the site error page (a noindexed soft-404) with the correct
 * status semantics: 404 for portal-confirmed missing slugs, never a 404 for
 * upstream, network, or configuration failures.
 */
const routeError = computed(() => {
  if (status.value !== 'error') {
    return null
  }

  return lookupError.value ?? createError({
    statusCode: CO_BRANDED_FALLBACK_STATUS_CODE,
    statusMessage: CO_BRANDED_UNAVAILABLE_STATUS_MESSAGE,
    fatal: true
  })
})

if (routeError.value) {
  throw routeError.value
}

watch(routeError, (coBrandedError) => {
  if (coBrandedError) {
    showError(coBrandedError)
  }
})

const routeClass = computed(() => ['co-branded-page-route', props.wrapperClass].filter(Boolean))
const isCoBrandedPageLoading = computed(() => status.value === 'idle' || status.value === 'pending')
const coBrandedSeoTitle = computed(() => {
  const companyName = coBrandedPage.value?.companyName?.trim() || 'Solagree partner'

  return `${companyName} | Solagree.com - A flat-fee, virtual alternative to traditional divorce litigation with a structured path to resolution`
})

useSolagreeSeo({
  title: coBrandedSeoTitle,
  description: 'Start a structured Solagree divorce planning quiz from a partner co-branded page.',
  noIndex: props.noIndex,
  path: props.seoPath
})
</script>

<template>
  <main :class="routeClass">
    <CoBrandedPageRenderer
      v-if="coBrandedPage"
      :config="coBrandedPage"
      :mode="mode"
    />

    <div
      v-else-if="isCoBrandedPageLoading"
      class="co-branded-page-route__state"
      role="status"
      aria-label="Loading co-branded page"
    >
      <div class="co-branded-page-route__spinner" />
    </div>
  </main>
</template>
