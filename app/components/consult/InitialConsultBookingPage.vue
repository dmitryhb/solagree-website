<script setup lang="ts">
import { computed } from 'vue'
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

/** Keeps the team option informative without presenting it as an individual consultant. */
const selectedConsultantBio = computed(() => {
  return props.selectedEvent.profile?.bio
    ?? 'Meet with the first available Solagree consultant from our experienced team. We’ll make sure you have the support that best fits your needs.'
})

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
              Solagree Initial Consult
            </p>

            <div class="consultant-selection-summary__profile">
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
              </div>
            </div>

            <p class="consultant-selection-summary__bio">
              {{ selectedConsultantBio }}
            </p>

            <dl class="consultant-selection-summary__details">
              <div>
                <dt>Length</dt>
                <dd>30 min</dd>
              </div>
              <div>
                <dt>How we’ll meet</dt>
                <dd>Phone Call or Zoom</dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>$60</dd>
              </div>
            </dl>

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

      <section
        class="initial-consult-booking-policy"
        aria-labelledby="initial-consult-booking-policy-title"
      >
        <h2 id="initial-consult-booking-policy-title">
          Booking policy
        </h2>

        <div class="initial-consult-booking-policy__rules">
          <section>
            <h3>Rescheduling</h3>
            <p>Reschedule once, free, up to 48 hours before your appointment.</p>
          </section>

          <section>
            <h3>Cancellations</h3>
            <p>Cancel 48+ hours ahead for a full refund. Less than 48 hours: non-refundable.</p>
          </section>

          <section>
            <h3>No-Shows</h3>
            <p>Missed appointments are non-refundable and must be rebooked.</p>
          </section>
        </div>

        <p class="initial-consult-booking-policy__agreement">
          By booking, you agree to this policy.
        </p>
      </section>
    </section>

    <SiteFooter />
  </main>
</template>
