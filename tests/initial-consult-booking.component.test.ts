import { mount } from '@vue/test-utils'
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import InitialConsultBookingPage from '../app/components/consult/InitialConsultBookingPage.vue'
import {
  resolveInitialConsultBookingEvents,
  type InitialConsultBookingEvent
} from '../shared/initial-consult-booking'

const events = resolveInitialConsultBookingEvents({
  firstAvailableEventPath: 'solagree/initial-consults/initial-consult',
  tajEventPath: 'solagree/initial-consults/initial-consult-taj',
  stacieEventPath: 'solagree/initial-consults/initial-consult-stacie',
  jessicaEventPath: 'solagree/initial-consults/initial-consult-jessica',
  jamesEventPath: 'solagree/initial-consults/initial-consult-james'
})

const firstEvent = events[0]

if (!firstEvent || events.length !== 5) {
  throw new Error('Initial Consult component test configuration must resolve five booking events.')
}

describe('InitialConsultBookingPage', () => {
  it('remounts exactly one booking embed for each selector choice', async () => {
    const mountedEvents: string[] = []
    const unmountedEvents: string[] = []
    const BookingEmbedStub = defineComponent({
      name: 'CalComBookingEmbed',
      props: {
        event: { type: Object, required: true }
      },
      setup(props) {
        const bookingEvent = props.event as { eventPath: string }

        onMounted(() => {
          mountedEvents.push(bookingEvent.eventPath)
        })
        onBeforeUnmount(() => {
          unmountedEvents.push(bookingEvent.eventPath)
        })

        return () => h('iframe', {
          class: 'calcom-booking-embed__frame',
          'data-calcom-event-path': bookingEvent.eventPath
        })
      }
    })
    const BookingHarness = defineComponent({
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
    const wrapper = mount(BookingHarness, {
      global: {
        stubs: {
          CalComBookingEmbed: BookingEmbedStub,
          SiteFooter: true
        }
      }
    })

    for (const event of events.slice(1)) {
      await wrapper.get(`[data-consultant-id="${event.id}"]`).trigger('click')
    }

    expect(mountedEvents).toEqual(events.map(event => event.eventPath))
    expect(unmountedEvents).toEqual(events.slice(0, -1).map(event => event.eventPath))
    expect(wrapper.findAll('iframe.calcom-booking-embed__frame')).toHaveLength(1)
    expect(wrapper.get('iframe.calcom-booking-embed__frame').attributes('data-calcom-event-path'))
      .toBe(events.at(-1)?.eventPath)
  })
})
