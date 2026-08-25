import { createApp, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import InitialConsultBookingPage from '../../../app/components/consult/InitialConsultBookingPage.vue'
import {
  resolveInitialConsultBookingEvents,
  type InitialConsultBookingEvent
} from '../../../shared/initial-consult-booking'

Object.assign(globalThis, { nextTick, onBeforeUnmount, onMounted, ref, watch })

const events = resolveInitialConsultBookingEvents({
  firstAvailableEventPath: 'initial-consults/initial-consult',
  tajEventPath: 'initial-consults/initial-consult-taj',
  stacieEventPath: 'initial-consults/initial-consult-stacie',
  jessicaEventPath: 'initial-consults/initial-consult-jessica',
  jamesEventPath: 'initial-consults/initial-consult-james'
})
const firstEvent = events[0]

if (!firstEvent || events.length !== 5) {
  throw new Error('Initial Consult E2E fixture must resolve five booking events.')
}

const app = createApp({
  setup() {
    const selectedEvent = ref(firstEvent)

    return () => h(InitialConsultBookingPage, {
      events,
      selectedEvent: selectedEvent.value,
      trackingContext: {},
      onSelect: (event: InitialConsultBookingEvent) => { selectedEvent.value = event }
    })
  }
})

app.component('SiteFooter', {
  render: () => h('footer')
})
app.mount('#app')
