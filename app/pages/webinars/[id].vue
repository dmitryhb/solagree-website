<script setup lang="ts">
import WatchWebinarForm from '~/components/webinar/WatchWebinarForm.vue'
import WebinarVideoFrame from '~/components/webinar/WebinarVideoFrame.vue'
import { formatWebinarDate, getPublicWebinar, getWebinarLiveRegistrationUrl, resolveWebinarAccess } from '~/services/webinar-catalog-api'
import { getPortalErrorStatusCode, normalizePortalApiBaseUrl, websitePortalFetcher } from '~/services/portal-api'

const route = useRoute()
const config = useRuntimeConfig()
const id = computed(() => String(route.params.id))
const recordingSrc = ref('')
const recordingRegion = ref<HTMLElement | null>(null)
const accessRecoveryMessage = ref('')
const { data: webinar, status, error, refresh } = await useAsyncData(() => `public-webinar-${id.value}`, () =>
  getPublicWebinar(config.public.portalApiBaseUrl, id.value, websitePortalFetcher), { server: false })
watch(id, () => {
  recordingSrc.value = ''
  accessRecoveryMessage.value = ''
})

const unlockRecording = async (accessPath: string): Promise<void> => {
  recordingSrc.value = `${normalizePortalApiBaseUrl(config.public.portalApiBaseUrl)}${accessPath}`
  await nextTick()
  recordingRegion.value?.focus()
}

// Keep the capability out of anchor URLs that analytics may collect as outbound links.
const openRecording = (): void => {
  window.open(recordingSrc.value, '_blank', 'noopener,noreferrer')
}

const consumeAccessToken = (): string | null | undefined => {
  const hash = window.location.hash
  if (!hash) return undefined

  const parameters = new URLSearchParams(hash.slice(1))
  if (!parameters.has('access_token')) return undefined

  window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`)
  return parameters.get('access_token') || null
}

let accessRequest = 0
const resolveFragmentAccess = async (): Promise<void> => {
  const token = consumeAccessToken()
  if (token === undefined) return
  const request = ++accessRequest
  recordingSrc.value = ''
  accessRecoveryMessage.value = ''
  if (token === null) {
    accessRecoveryMessage.value = 'We could not verify this access link. Submit the form below to request a new one.'
    return
  }

  const webinarId = id.value
  try {
    const access = await resolveWebinarAccess(webinarId, token, {
      portalApiBaseUrl: config.public.portalApiBaseUrl,
      fetcher: websitePortalFetcher
    })
    if (id.value === webinarId && request === accessRequest) await unlockRecording(access.accessPath)
  } catch (error: unknown) {
    if (id.value !== webinarId || request !== accessRequest) return
    accessRecoveryMessage.value = getPortalErrorStatusCode(error) === 410
      ? 'This access link has expired. Submit the form below to request another viewing link.'
      : 'We could not verify this access link. Submit the form below to request a new one.'
  }
}

// Hash-only email navigation reuses this page rather than mounting it again.
const handleHashChange = (): void => { void resolveFragmentAccess() }
watch(() => route.fullPath, () => {
  if (import.meta.client) handleHashChange()
}, { flush: 'post' })
onMounted(() => {
  window.addEventListener('hashchange', handleHashChange)
  handleHashChange()
})
onBeforeUnmount(() => {
  accessRequest++
  window.removeEventListener('hashchange', handleHashChange)
})
useSolagreeSeo({
  title: () => webinar.value?.title || 'Webinar',
  description: () => webinar.value?.description || 'Join a Solagree webinar.',
  path: () => `/webinars/${encodeURIComponent(id.value)}`,
  // Static hosting serves the same /200.html shell for every event ID.
  noIndex: true
})
useHead({ meta: [{ name: 'referrer', content: 'no-referrer' }] })
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
          <p>If the player does not load, <button type="button" class="recording-fallback" @click="openRecording">open the recording in a new tab</button>.</p>
        </div>
        <template v-else>
          <p v-if="accessRecoveryMessage" role="status">{{ accessRecoveryMessage }}</p>
          <WatchWebinarForm :webinar-id="webinar.id" :subtitle="`Watch ${webinar.title}`" @unlocked="unlockRecording" />
        </template>
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
.recording-fallback { color: inherit; text-decoration: underline; cursor: pointer; }
</style>
