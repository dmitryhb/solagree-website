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

useSolagreeSeo({
  title: 'Co-branded Solagree Embed',
  description: 'Embedded co-branded Solagree page.',
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
      v-else
      class="co-branded-page-route__state"
      role="status"
    >
      <div class="co-branded-page-route__state-box">
        <h1>{{ pending ? 'Loading page' : 'Page unavailable' }}</h1>
        <p>
          {{ error ? 'We could not load this embedded Solagree page right now.' : 'This embedded Solagree page is not available.' }}
        </p>
      </div>
    </div>
  </main>
</template>
