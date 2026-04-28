<script setup lang="ts">
import CoBrandedPageRenderer from '~/components/co-branded/CoBrandedPageRenderer.vue'
import { fetchCoBrandedPageConfig } from '~/services/co-branded-page-api'
import type { CoBrandedPageRenderMode } from '~/types/co-branded-page'

const props = withDefaults(defineProps<{
  mode: CoBrandedPageRenderMode
  seoPath: string
  noIndex?: boolean
  wrapperClass?: string
}>(), {
  noIndex: false,
  wrapperClass: ''
})

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slug = computed(() => String(route.params.slug || '').trim())
const asyncDataKey = computed(() => `co-branded-page:${props.mode}:${slug.value}`)

const {
  data: coBrandedPage,
  pending,
  error,
  status
} = await useAsyncData(
  asyncDataKey,
  () => fetchCoBrandedPageConfig({
    portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
    slug: slug.value
  }),
  {
    server: false,
    watch: [slug]
  }
)

const routeClass = computed(() => ['co-branded-page-route', props.wrapperClass].filter(Boolean))
const isLoadingCoBrandedPage = computed(() => pending.value || status.value === 'idle' || status.value === 'pending')
const isCoBrandedPageUnavailable = computed(() => status.value === 'error' || (status.value === 'success' && !coBrandedPage.value))

useSolagreeSeo({
  title: 'Co-branded Solagree page',
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
      v-else-if="isLoadingCoBrandedPage"
      class="co-branded-page-route__state"
      role="status"
      aria-label="Loading co-branded page"
    >
      <div class="co-branded-page-route__spinner" />
    </div>

    <div
      v-else-if="isCoBrandedPageUnavailable"
      class="co-branded-page-route__state"
    >
      <div class="co-branded-page-route__state-box">
        <h1>Page unavailable</h1>
        <p>
          {{ error ? 'We could not load this Solagree partner page right now.' : 'This Solagree partner page is not available.' }}
        </p>
        <SiteButton
          class="co-branded-page-route__home-link"
          to="/"
          variant="secondary"
        >
          Go to home page
        </SiteButton>
      </div>
    </div>
  </main>
</template>
