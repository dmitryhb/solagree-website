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

/** Resolves a selected id back to its configured event before notifying the route. */
const handleSelection = (selectionId: InitialConsultBookingEvent['id']): void => {
  const event = props.events.find(item => item.id === selectionId)

  if (event) {
    emit('select', event)
  }
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
        <p>Choose the option that works best for you, then book and pay securely with Cal.com.</p>
      </header>

      <ConsultantSelector
        :events="events"
        :selected-id="selectedEvent.id"
        @select="handleSelection"
      />

      <CalComBookingEmbed
        :key="selectedEvent.id"
        :event="selectedEvent"
        :tracking-context="trackingContext"
      />
    </section>

    <SiteFooter />
  </main>
</template>
