<script setup lang="ts">
import type {
  InitialConsultBookingEvent,
  InitialConsultBookingTrackingContext
} from '#shared/initial-consult-booking'
import CalComBookingEmbed from '~/components/consult/CalComBookingEmbed.vue'
import ConsultantSelector from '~/components/consult/ConsultantSelector.vue'

const props = defineProps<{
  events: readonly InitialConsultBookingEvent[]
  selectedEvent: InitialConsultBookingEvent
  trackingContext: InitialConsultBookingTrackingContext
}>()

const emit = defineEmits<{
  select: [event: InitialConsultBookingEvent]
}>()

const bookingPanel = ref<HTMLElement | null>(null)

/** Resolves a selected id back to its configured event before notifying the route. */
const handleSelection = async (selectionId: InitialConsultBookingEvent['id']): Promise<void> => {
  const event = props.events.find(item => item.id === selectionId)

  if (!event) {
    return
  }

  emit('select', event)

  if (
    typeof window === 'undefined'
    || typeof window.matchMedia !== 'function'
    || !window.matchMedia('(max-width: 960px)').matches
  ) {
    return
  }

  await nextTick()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  bookingPanel.value?.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start'
  })
}
</script>

<template>
  <main class="initial-consult-booking-page">
    <section class="initial-consult-booking-page__content">
      <header class="initial-consult-booking-page__intro">
        <p class="eyebrow">
          30 minutes · $60
        </p>
        <h1>Book a Solagree Initial Consult</h1>
        <p>Choose a consultant, then pick the date and time that work best for you.</p>
      </header>

      <div class="initial-consult-booking-page__workflow">
        <ConsultantSelector
          :events="events"
          :selected-id="selectedEvent.id"
          @select="handleSelection"
        />

        <div
          ref="bookingPanel"
          class="initial-consult-booking-page__calendar"
        >
          <CalComBookingEmbed
            :key="selectedEvent.id"
            :event="selectedEvent"
            :tracking-context="trackingContext"
          />
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
