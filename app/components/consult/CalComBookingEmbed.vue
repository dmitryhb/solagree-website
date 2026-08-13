<script setup lang="ts">
import EmbedSnippet from '@calcom/embed-snippet'
import type {
  InitialConsultBookingEvent,
  InitialConsultBookingTrackingContext
} from '#shared/initial-consult-booking'

type EmbedStatus = 'loading' | 'ready' | 'error'

const props = defineProps<{
  event: InitialConsultBookingEvent
  trackingContext: InitialConsultBookingTrackingContext
}>()

const bookingEmbed = ref<HTMLElement | null>(null)
const embedStatus = ref<EmbedStatus>('loading')
const retryCount = ref(0)
let loadTimeout: number | undefined
let mountCount = 0
let detachEmbedListeners: (() => void) | undefined

/** Clears the current Cal.com DOM and starts a new namespaced inline embed. */
const mountEmbed = (): void => {
  if (!import.meta.client || !bookingEmbed.value) {
    return
  }

  window.clearTimeout(loadTimeout)
  detachEmbedListeners?.()
  detachEmbedListeners = undefined
  bookingEmbed.value.replaceChildren()
  embedStatus.value = 'loading'
  mountCount += 1
  const currentMount = mountCount

  try {
    const cal = EmbedSnippet()
    const namespace = `solagree-initial-consult-${props.event.id}-${mountCount}`

    cal('init', namespace, { origin: 'https://cal.com' })

    const namespacedCal = cal.ns[namespace]

    if (!namespacedCal) {
      throw new Error('Cal.com did not initialize the booking namespace.')
    }

    const handleLinkReady = (): void => {
      if (currentMount !== mountCount) {
        return
      }

      embedStatus.value = 'ready'
      window.clearTimeout(loadTimeout)
    }
    const handleLinkFailed = (): void => {
      if (currentMount !== mountCount) {
        return
      }

      embedStatus.value = 'error'
      window.clearTimeout(loadTimeout)
    }

    namespacedCal('on', {
      action: 'linkReady',
      callback: handleLinkReady
    })
    namespacedCal('on', {
      action: 'linkFailed',
      callback: handleLinkFailed
    })
    detachEmbedListeners = () => {
      namespacedCal('off', { action: 'linkReady', callback: handleLinkReady })
      namespacedCal('off', { action: 'linkFailed', callback: handleLinkFailed })
    }
    namespacedCal('inline', {
      calLink: props.event.eventPath,
      elementOrSelector: bookingEmbed.value,
      config: props.trackingContext
    })

    loadTimeout = window.setTimeout(() => {
      if (currentMount === mountCount && embedStatus.value === 'loading') {
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
  detachEmbedListeners?.()
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
