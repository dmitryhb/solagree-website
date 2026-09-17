<script setup lang="ts">
import WatchWebinarForm from '~/components/webinar/WatchWebinarForm.vue'
import WebinarVideoFrame from '~/components/webinar/WebinarVideoFrame.vue'
import { formatWebinarDate, getPublicWebinar, getWebinarLiveRegistrationUrl } from '~/services/webinar-catalog-api'
import { normalizePortalApiBaseUrl, websitePortalFetcher } from '~/services/portal-api'

const route = useRoute()
const config = useRuntimeConfig()
const id = computed(() => String(route.params.id))
const recordingSrc = ref('')
const recordingRegion = ref<HTMLElement | null>(null)
const { data: webinar, status, error, refresh } = await useAsyncData(() => `public-webinar-${id.value}`, () =>
  getPublicWebinar(config.public.portalApiBaseUrl, id.value, websitePortalFetcher), { server: false })
watch(id, () => { recordingSrc.value = '' })

const unlockRecording = async (accessPath: string): Promise<void> => {
  recordingSrc.value = `${normalizePortalApiBaseUrl(config.public.portalApiBaseUrl)}${accessPath}`
  await nextTick()
  recordingRegion.value?.focus()
}
useSolagreeSeo({
  title: () => webinar.value?.title || 'Webinar',
  description: () => webinar.value?.description || 'Join a Solagree webinar.',
  path: () => `/webinars/${encodeURIComponent(id.value)}`,
  // Static hosting serves the same /200.html shell for every event ID.
  noIndex: true
})
</script>

<template>
  <main>
    <section class="section-shell webinar-detail">
      <NuxtLink to="/webinars">← All webinars &amp; events</NuxtLink>
      <p v-if="status === 'pending' || status === 'idle'" role="status">Loading webinar…</p>
      <div v-else-if="error" role="alert">
        <h1>Webinar unavailable</h1>
        <p>This webinar may no longer be available. Please try again or browse our other events.</p>
        <button type="button" class="sol-button sol-button--primary" @click="refresh()">Try again</button>
      </div>
      <template v-else-if="webinar">
        <h1 class="editorial-display">{{ webinar.title }}</h1>
        <p>Hosted by {{ webinar.host }}</p>
        <p>{{ formatWebinarDate(webinar) }}</p>
        <p class="webinar-detail__description">{{ webinar.description }}</p>
        <p v-if="webinar.state === 'recording_coming_soon'" role="status">Recording coming soon</p>
        <a v-else-if="webinar.state === 'upcoming' || webinar.state === 'live'" :href="getWebinarLiveRegistrationUrl(config.public.portalApiBaseUrl, webinar.id)" class="sol-button sol-button--primary">Register on Zoom</a>
        <div v-else-if="recordingSrc" ref="recordingRegion" tabindex="-1" aria-label="Webinar recording">
          <WebinarVideoFrame :video-src="recordingSrc" :video-title="webinar.title" />
          <p>If the player does not load, <a :href="recordingSrc" target="_blank" rel="noopener noreferrer">open the recording in a new tab</a>.</p>
        </div>
        <WatchWebinarForm v-else :webinar-id="webinar.id" :subtitle="`Watch ${webinar.title}`" @unlocked="unlockRecording" />
      </template>
    </section>
    <SiteFooter />
  </main>
</template>

<style scoped>
.webinar-detail { padding-block: 4rem; max-width: 64rem; }
.webinar-detail h1 { margin-block: 2rem; }
.webinar-detail p { margin-block: 1.5rem; }
.webinar-detail__description { white-space: pre-line; }
.webinar-detail :deep(.watch-webinar-form) { max-width: 40rem; margin-top: 2rem; }
</style>
