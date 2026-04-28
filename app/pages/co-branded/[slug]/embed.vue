<script setup lang="ts">
import CoBrandedPageRenderer from '~/components/co-branded/CoBrandedPageRenderer.vue'
import { fetchCoBrandedPageConfig } from '~/services/co-branded-page-api'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slug = computed(() => String(route.params.slug || '').trim())

const {
  data: coBrandedPage,
  pending,
  error,
  status
} = await useAsyncData(
  () => `co-branded-page-embed:${slug.value}`,
  () => fetchCoBrandedPageConfig({
    portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
    slug: slug.value
  }),
  {
    server: false,
    watch: [slug]
  }
)
const isLoadingCoBrandedPage = computed(() => pending.value || status.value === 'idle' || status.value === 'pending')
const isCoBrandedPageUnavailable = computed(() => status.value === 'error' || (status.value === 'success' && !coBrandedPage.value))

useSolagreeSeo({
  title: 'Co-branded Solagree page',
  description: 'Start a structured Solagree divorce planning quiz from a partner co-branded page.',
  noIndex: true,
  path: `/co-branded/${slug.value}/embed`
})
</script>

<template>
  <main class="co-branded-page-route co-branded-page-route--embed">
    <CoBrandedPageRenderer
      v-if="coBrandedPage"
      :config="coBrandedPage"
      mode="embed"
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
          {{ error ? 'We could not load this co-branded Solagree page right now.' : 'This co-branded Solagree page is not available.' }}
        </p>
      </div>
    </div>
  </main>
</template>
