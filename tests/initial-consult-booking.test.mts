import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getInitialConsultBookingTrackingContext,
  normalizeInitialConsultEventPath,
  resolveInitialConsultBookingEvent,
  resolveInitialConsultBookingEvents,
  type InitialConsultBookingRuntimeConfig
} from '../shared/initial-consult-booking.ts'

const configuredEvents: InitialConsultBookingRuntimeConfig = {
  firstAvailableEventPath: 'solagree/initial-consults/initial-consult',
  tajEventPath: 'solagree/initial-consults/initial-consult-taj',
  stacieEventPath: 'solagree/initial-consults/initial-consult-stacie',
  jessicaEventPath: 'solagree/initial-consults/initial-consult-jessica',
  jamesEventPath: 'solagree/initial-consults/initial-consult-james'
}

test('maps every Initial Consult selector option to its configured Cal.com event', () => {
  const events = resolveInitialConsultBookingEvents(configuredEvents)

  assert.deepEqual(
    events.map(event => [event.id, event.label, event.eventPath]),
    [
      ['first-available', 'First Available', 'solagree/initial-consults/initial-consult'],
      ['taj', 'Taj Chiu', 'solagree/initial-consults/initial-consult-taj'],
      ['stacie', 'Stacie Martin', 'solagree/initial-consults/initial-consult-stacie'],
      ['jessica', 'Jessica Urash', 'solagree/initial-consults/initial-consult-jessica'],
      ['james', 'James Traub', 'solagree/initial-consults/initial-consult-james']
    ]
  )

  assert.equal(
    resolveInitialConsultBookingEvent(events, 'jessica')?.eventPath,
    'solagree/initial-consults/initial-consult-jessica'
  )
})

test('requires the complete validated event mapping before enabling the booking UI', () => {
  assert.equal(resolveInitialConsultBookingEvents({
    ...configuredEvents,
    tajEventPath: 'https://solagree.cal.com/initial-consults/initial-consult-taj'
  }).length, 0)
  assert.equal(resolveInitialConsultBookingEvents({
    ...configuredEvents,
    jamesEventPath: ''
  }).length, 0)
  assert.equal(normalizeInitialConsultEventPath('solagree/initial-consults/initial-consult?name=Jane'), null)
})

test('forwards only a compact non-identifying Cal.com tracking allowlist', () => {
  assert.deepEqual(getInitialConsultBookingTrackingContext({
    ref: 'rivera-mediation',
    utm_source: 'newsletter',
    utm_campaign: 'summer_2026',
    email: 'person@example.com',
    name: 'Person Name',
    utm_content: ['first', 'second'],
    source: 'partner/page'
  }), {
    ref: 'rivera-mediation',
    utm_source: 'newsletter',
    utm_campaign: 'summer_2026'
  })
})
