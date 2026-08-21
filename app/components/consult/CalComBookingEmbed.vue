<script setup lang="ts">
import EmbedSnippet from '@calcom/embed-snippet'
import type {
  InitialConsultBookingEvent,
  InitialConsultBookingTrackingContext
} from '#shared/initial-consult-booking'
import { createCalComBookingEmbedController } from '~/utils/calcom-booking-embed'

type EmbedStatus = 'loading' | 'ready' | 'error'

const props = defineProps<{
  event: InitialConsultBookingEvent
  trackingContext: InitialConsultBookingTrackingContext
}>()

const bookingEmbed = ref<HTMLElement | null>(null)
const embedStatus = ref<EmbedStatus>('loading')
const retryCount = ref(0)
let loadTimeout: number | undefined
let activeMountId = 0

const bookingController = createCalComBookingEmbedController(
  () => EmbedSnippet(),
  {
    onReady: () => {
      embedStatus.value = 'ready'
      window.clearTimeout(loadTimeout)
    },
    onFailed: () => {
      embedStatus.value = 'error'
      window.clearTimeout(loadTimeout)
    }
  }
)

/** Clears the current Cal.com DOM and starts a new namespaced inline embed. */
const mountEmbed = (): void => {
  if (!import.meta.client || !bookingEmbed.value) {
    return
  }

  window.clearTimeout(loadTimeout)
  embedStatus.value = 'loading'

  try {
    activeMountId = bookingController.mount({
      event: props.event,
      host: bookingEmbed.value,
      trackingContext: props.trackingContext
    })

    loadTimeout = window.setTimeout(() => {
      if (bookingController.isActive(activeMountId) && embedStatus.value === 'loading') {
        embedStatus.value = 'error'
      }
    }, 15000)
  } catch (error) {
    console.error('Unable to load the Cal.com Initial Consult booking embed.', error)
    embedStatus.value = 'error'
  }
}

/** Retries from a blank mount point so a failed provider iframe cannot retain stale state. */
const retryEmbed = (): void => {
  retryCount.value += 1
  void nextTick(mountEmbed)
}

watch(
  () => props.event,
  () => {
    void nextTick(mountEmbed)
  },
  { deep: true }
)

onMounted(mountEmbed)

onBeforeUnmount(() => {
  window.clearTimeout(loadTimeout)
  bookingController.unmount()
  bookingEmbed.value?.replaceChildren()
})
</script>

<template>
  <section
    class="calcom-booking-embed"
    aria-labelledby="calcom-booking-title"
  >
    <div class="calcom-booking-embed__header">
      <div>
        <p class="eyebrow">
          {{ event.label }}
        </p>
        <h2 id="calcom-booking-title">
          Choose a time
        </h2>
      </div>
      <p>Phone appointments are currently available. Cal.com collects availability, booking questions, and payment securely.</p>
    </div>

    <p
      v-if="embedStatus === 'loading'"
      class="calcom-booking-embed__status"
      role="status"
    >
      Loading secure booking options…
    </p>

    <div
      :key="retryCount"
      ref="bookingEmbed"
      class="calcom-booking-embed__frame"
      :data-calcom-event-path="event.eventPath"
      :aria-busy="embedStatus === 'loading'"
    />

    <div
      v-if="embedStatus === 'error'"
      class="calcom-booking-embed__error"
      role="alert"
    >
      <p>We couldn’t load booking options right now. Please try again.</p>
      <button
        type="button"
        @click="retryEmbed"
      >
        Retry booking options
      </button>
    </div>
  </section>
</template>
