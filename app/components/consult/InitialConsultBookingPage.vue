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
const selectorPanel = ref<HTMLElement | null>(null)
const bookingSummary = ref<HTMLElement | null>(null)
const isSelectorExpanded = ref(true)

/** Resolves a selected id back to its configured event before notifying the route. */
const handleSelection = async (selectionId: InitialConsultBookingEvent['id']): Promise<void> => {
  const event = props.events.find(item => item.id === selectionId)

  if (!event) {
    return
  }

  isSelectorExpanded.value = false
  emit('select', event)

  await nextTick()
  bookingSummary.value?.focus()

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

/** Reopens the consultant choices and restores focus to the current selection. */
const openSelector = async (): Promise<void> => {
  isSelectorExpanded.value = true
  await nextTick()

  selectorPanel.value
    ?.querySelector<HTMLButtonElement>(`[data-consultant-id="${props.selectedEvent.id}"]`)
    ?.focus()
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
        <div
          ref="selectorPanel"
          class="initial-consult-booking-page__selection"
        >
          <ConsultantSelector
            v-if="isSelectorExpanded"
            :events="events"
            :selected-id="selectedEvent.id"
            @select="handleSelection"
          />

          <section
            ref="bookingSummary"
            v-else
            class="consultant-selection-summary"
            aria-labelledby="consultant-selection-summary-title"
            tabindex="-1"
          >
            <p class="consultant-selection-summary__eyebrow">
              Your booking
            </p>
            <div class="consultant-selection-summary__consultant">
              <img
                v-if="selectedEvent.profile?.headshotUrl"
                class="consultant-selection-summary__headshot"
                :src="selectedEvent.profile.headshotUrl"
                :alt="selectedEvent.label"
                width="64"
                height="64"
              >
              <div>
                <h2 id="consultant-selection-summary-title">
                  {{ selectedEvent.label }}
                </h2>
                <p>30 minutes · $60</p>
              </div>
            </div>
            <button
              type="button"
              @click="openSelector"
            >
              Change consultant
            </button>
          </section>
        </div>

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
