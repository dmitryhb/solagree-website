<script setup lang="ts">
import {
  getInitialConsultBookingTrackingContext,
  resolveInitialConsultBookingEvent,
  resolveInitialConsultBookingEvents,
  type InitialConsultBookingEvent,
  type InitialConsultSelectionId
} from '#shared/initial-consult-booking'
import InitialConsultBookingPage from '~/components/consult/InitialConsultBookingPage.vue'

useSolagreeSeo({
  title: 'Book a Solagree Initial Consult',
  description: 'Choose a Solagree Initial Consult appointment and book securely online.',
  path: '/book-a-solagree-consult'
})

const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const { trackEvent } = useGoogleAnalytics()
const bookingEvents = computed(() => resolveInitialConsultBookingEvents(runtimeConfig.public.initialConsultBooking))
const selectedId = ref<InitialConsultSelectionId>('first-available')
const trackingContext = computed(() => getInitialConsultBookingTrackingContext(route.query))
const selectedEvent = computed(() => resolveInitialConsultBookingEvent(bookingEvents.value, selectedId.value))

/** Changes the provider event and records only the non-identifying selector choice. */
const selectEvent = (event: InitialConsultBookingEvent): void => {
  selectedId.value = event.id
  trackEvent('consultation_booking_option_selected', {
    booking_option: event.id,
    source: 'initial_consult_booking'
  })
}

watch(bookingEvents, (events) => {
  if (events.length > 0 && !resolveInitialConsultBookingEvent(events, selectedId.value)) {
    selectedId.value = 'first-available'
  }
})
</script>

<template>
  <InitialConsultBookingPage
    v-if="selectedEvent"
    :events="bookingEvents"
    :selected-event="selectedEvent"
    :tracking-context="trackingContext"
    @select="selectEvent"
  />

  <main
    v-else
    class="initial-consult-booking-page"
  >
    <section
      class="initial-consult-booking-page__content initial-consult-booking-page__content--unavailable"
      aria-labelledby="initial-consult-unavailable-title"
    >
      <p class="eyebrow">
        Initial Consult
      </p>
      <h1 id="initial-consult-unavailable-title">
        Booking is temporarily unavailable
      </h1>
      <p>We’re unable to load booking options right now. Please try again shortly.</p>
    </section>

    <SiteFooter />
  </main>
</template>
