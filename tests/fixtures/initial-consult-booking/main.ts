import { createApp, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import '../../../app/assets/styles/main.scss'
import InitialConsultBookingPage from '../../../app/components/consult/InitialConsultBookingPage.vue'
import {
  resolveInitialConsultBookingEvents,
  type InitialConsultBookingEvent
} from '../../../shared/initial-consult-booking'

Object.assign(globalThis, { nextTick, onBeforeUnmount, onMounted, ref, watch })

const meetingMethodMode = new URLSearchParams(window.location.search).get('mode') === 'separate' ? 'separate' : 'mixed'

const events = resolveInitialConsultBookingEvents({
  meetingMethodMode,
  firstAvailableEventPath: 'initial-consults/initial-consult',
  tajEventPath: 'initial-consults/initial-consult-taj',
  stacieEventPath: 'initial-consults/initial-consult-stacie',
  jessicaEventPath: 'initial-consults/initial-consult-jessica',
  jamesEventPath: 'initial-consults/initial-consult-james',
  firstAvailablePhoneEventPath: 'initial-consults/initial-consult-phone',
  tajPhoneEventPath: 'initial-consults/initial-consult-taj-phone',
  staciePhoneEventPath: 'initial-consults/initial-consult-stacie-phone',
  jamesPhoneEventPath: 'initial-consults/initial-consult-james-phone'
})
const firstEvent = events[0]

if (!firstEvent || events.length !== 4) {
  throw new Error('Initial Consult E2E fixture must resolve First Available and three published consultants.')
}

const app = createApp({
  setup() {
    const selectedEvent = ref(firstEvent)

    return () => h(InitialConsultBookingPage, {
      events,
      selectedEvent: selectedEvent.value,
      meetingMethodMode,
      trackingContext: {},
      onSelect: (event: InitialConsultBookingEvent) => { selectedEvent.value = event }
    })
  }
})

app.component('SiteFooter', {
  render: () => h('footer')
})
app.mount('#app')
