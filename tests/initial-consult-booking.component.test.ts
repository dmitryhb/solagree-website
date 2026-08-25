import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import InitialConsultBookingPage from '../app/components/consult/InitialConsultBookingPage.vue'
import {
  resolveInitialConsultBookingEvents,
  type InitialConsultBookingEvent
} from '../shared/initial-consult-booking'

const events = resolveInitialConsultBookingEvents({
  firstAvailableEventPath: 'initial-consults/initial-consult',
  tajEventPath: 'initial-consults/initial-consult-taj',
  stacieEventPath: 'initial-consults/initial-consult-stacie',
  jessicaEventPath: 'initial-consults/initial-consult-jessica',
  jamesEventPath: 'initial-consults/initial-consult-james'
})

const firstEvent = events[0]

if (!firstEvent || events.length !== 5) {
  throw new Error('Initial Consult component test configuration must resolve five booking events.')
}

const originalScrollIntoView = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView')

afterEach(() => {
  vi.unstubAllGlobals()

  if (originalScrollIntoView) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', originalScrollIntoView)
  } else {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView')
  }
})

describe('InitialConsultBookingPage', () => {
  it('renders the approved consultant names, biographies, and headshots', () => {
    const wrapper = mount(InitialConsultBookingPage, {
      props: {
        events,
        selectedEvent: firstEvent,
        trackingContext: {}
      },
      global: {
        stubs: {
          CalComBookingEmbed: true,
          SiteFooter: true
        }
      }
    })

    const headshots = wrapper.findAll<HTMLImageElement>('.consultant-selector__headshot')

    expect(headshots).toHaveLength(4)
    expect(headshots.map(image => [image.attributes('alt'), image.attributes('src')])).toEqual([
      ['Taj Johnson Chiu', '/images/initial-consult-taj-johnson-chiu.webp'],
      ['Stacie Sanders', '/images/initial-consult-stacie-sanders.webp'],
      ['Jessica Urash', '/images/initial-consult-jessica-urash.webp'],
      ['James Traub', '/images/initial-consult-james-traub.webp']
    ])
    expect(wrapper.findAll('.consultant-selector__option-bio')).toHaveLength(4)
    expect(wrapper.find('[data-consultant-id="first-available"] img').exists()).toBe(false)
  })

  it('scrolls the calendar into view after a selection in the stacked layout', async () => {
    const scrollIntoView = vi.fn()
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView
    })
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
      matches: query === '(max-width: 960px)',
      media: query
    })))

    const wrapper = mount(InitialConsultBookingPage, {
      props: {
        events,
        selectedEvent: firstEvent,
        trackingContext: {}
      },
      global: {
        stubs: {
          CalComBookingEmbed: true,
          SiteFooter: true
        }
      }
    })

    await wrapper.get('[data-consultant-id="taj"]').trigger('click')
    await nextTick()

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

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
