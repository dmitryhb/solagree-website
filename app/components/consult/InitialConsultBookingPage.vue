<script setup lang="ts">
import { computed } from 'vue'
import type {
  InitialConsultBookingEvent,
  InitialConsultBookingTrackingContext,
  InitialConsultMeetingMethod,
  InitialConsultMeetingMethodMode
} from '#shared/initial-consult-booking'
import { resolveInitialConsultBookingMethodEvent } from '#shared/initial-consult-booking'
import CalComBookingEmbed from '~/components/consult/CalComBookingEmbed.vue'
import ConsultantSelector from '~/components/consult/ConsultantSelector.vue'
import MeetingMethodSelector from '~/components/consult/MeetingMethodSelector.vue'

const props = defineProps<{
  events: readonly InitialConsultBookingEvent[]
  selectedEvent: InitialConsultBookingEvent
  trackingContext: InitialConsultBookingTrackingContext
  meetingMethodMode?: InitialConsultMeetingMethodMode
}>()

const emit = defineEmits<{
  select: [event: InitialConsultBookingEvent]
}>()

const bookingPanel = ref<HTMLElement | null>(null)
const selectorPanel = ref<HTMLElement | null>(null)
const bookingSummary = ref<HTMLElement | null>(null)
const isSelectorExpanded = ref(true)
const methodPanel = ref<HTMLElement | null>(null)
const selectedMethod = ref<InitialConsultMeetingMethod | null>(null)
const isSeparateMode = computed(() => props.meetingMethodMode === 'separate')
const bookingEvent = computed(() => isSeparateMode.value
  ? resolveInitialConsultBookingMethodEvent(props.selectedEvent, selectedMethod.value)
  : props.selectedEvent)
const meetingMethodLabel = computed(() => {
  if (!isSeparateMode.value) return 'Phone Call or Zoom'
  return selectedMethod.value === 'phone'
    ? 'Phone call'
    : selectedMethod.value === 'zoom' ? 'Zoom' : 'Choose Phone call or Zoom'
})

/** Moves the calendar into view only after all choices are complete. */
const scrollToBooking = (): void => {
  if (
    !bookingEvent.value
    || typeof window === 'undefined'
    || typeof window.matchMedia !== 'function'
    || !window.matchMedia('(max-width: 960px)').matches
  ) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  bookingPanel.value?.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start'
  })
}

/** Keeps the consultant selected and lets native radio keyboard navigation retain focus. */
const handleMethodSelection = async (method: InitialConsultMeetingMethod): Promise<void> => {
  selectedMethod.value = method
  await nextTick()
  scrollToBooking()
}

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
  if (isSeparateMode.value && !selectedMethod.value) {
    methodPanel.value?.querySelector<HTMLInputElement>('input[type="radio"]')?.focus()
    return
  }
  bookingSummary.value?.focus()
  scrollToBooking()
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
        <p v-if="isSeparateMode">Choose a consultant and Phone call or Zoom, then pick your date and time.</p>
        <p v-else>Choose a consultant, then pick the date and time that work best for you.</p>
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
                <dd>{{ meetingMethodLabel }}</dd>
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

            <div
              v-if="isSeparateMode"
              ref="methodPanel"
            >
              <MeetingMethodSelector
                :selected-method="selectedMethod"
                @select="handleMethodSelection"
              />
            </div>
          </section>
        </div>

        <div
          ref="bookingPanel"
          class="initial-consult-booking-page__calendar"
        >
          <CalComBookingEmbed
            v-if="bookingEvent"
            :key="bookingEvent.eventPath"
            :event="bookingEvent"
            :tracking-context="trackingContext"
          />
          <section
            v-else
            aria-label="Booking choices"
            aria-live="polite"
          >
            <h2>Choose how we’ll meet</h2>
            <p>Choose a consultant, then Phone call or Zoom to see available dates and times.</p>
          </section>
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
            <p>Request one complimentary reschedule from Solagree up to 2 calendar days before your appointment.</p>
          </section>

          <section>
            <h3>Cancellations</h3>
            <p>Cancel 2 calendar days before your appointment for a full refund. Less than 2 calendar days: non-refundable.</p>
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
