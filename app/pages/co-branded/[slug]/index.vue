<script setup lang="ts">
import CoBrandedPageRenderer from '~/components/co-branded/CoBrandedPageRenderer.vue'
import { fetchCoBrandedPageConfig } from '~/services/co-branded-page-api'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slug = computed(() => String(route.params.slug || '').trim())

const {
  data: coBrandedPage,
  pending,
  error
} = await useAsyncData(
  () => `co-branded-page:${slug.value}`,
  () => fetchCoBrandedPageConfig({
    portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
    slug: slug.value
  }),
  {
    server: false,
    watch: [slug]
  }
)

useSolagreeSeo({
  title: 'Co-branded Solagree page',
  description: 'Start a structured Solagree divorce planning quiz from a partner co-branded page.',
  path: `/co-branded/${slug.value}`
})
</script>

<template>
  <main class="co-branded-page-route">
    <CoBrandedPageRenderer
      v-if="coBrandedPage"
      :config="coBrandedPage"
      mode="page"
    />

    <div
      v-else
      class="co-branded-page-route__state"
      role="status"
    >
      <div class="co-branded-page-route__state-box">
        <h1>{{ pending ? 'Loading page' : 'Page unavailable' }}</h1>
        <p>
          {{ error ? 'We could not load this co-branded Solagree page right now.' : 'This co-branded Solagree page is not available.' }}
        </p>
      </div>
    </div>
  </main>
</template>
