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
  firstAvailableEventPath: 'initial-consults/initial-consult',
  tajEventPath: 'initial-consults/initial-consult-taj',
  stacieEventPath: 'initial-consults/initial-consult-stacie',
  jessicaEventPath: 'initial-consults/initial-consult-jessica',
  jamesEventPath: 'initial-consults/initial-consult-james'
}

test('maps every Initial Consult selector option to its configured Cal.com event', () => {
  const events = resolveInitialConsultBookingEvents(configuredEvents)

  assert.deepEqual(
    events.map(event => [event.id, event.label, event.eventPath]),
    [
      ['first-available', 'First Available', 'initial-consults/initial-consult'],
      ['taj', 'Taj Johnson Chiu', 'initial-consults/initial-consult-taj'],
      ['stacie', 'Stacie Sanders', 'initial-consults/initial-consult-stacie'],
      ['james', 'James Traub', 'initial-consults/initial-consult-james'],
      ['jessica', 'Jessica Urash', 'initial-consults/initial-consult-jessica']
    ]
  )

  assert.equal(events[0]?.profile, undefined)
  assert.deepEqual(events.slice(1).map(event => ({
    id: event.id,
    headshotUrl: event.profile?.headshotUrl,
    bio: event.profile?.bio
  })), [
    {
      id: 'taj',
      headshotUrl: '/images/initial-consult-taj-johnson-chiu.webp',
      bio: 'Mediator, divorce & financial coach specializing in neurodivergent and special-needs families. LGBTQ+ affirming, judgment-free, money-savvy support.'
    },
    {
      id: 'stacie',
      headshotUrl: '/images/initial-consult-stacie-sanders.webp',
      bio: 'Former family law paralegal turned client advocate – 15+ years guiding clients through the legal and emotional sides of divorce with care.'
    },
    {
      id: 'james',
      headshotUrl: '/images/initial-consult-james-traub.webp',
      bio: "Certified Divorce Coach & Kids-First Mediator helping parents avoid court conflict with calm, structured guidance focused on kids' wellbeing."
    },
    {
      id: 'jessica',
      headshotUrl: '/images/initial-consult-jessica-urash.webp',
      bio: 'Faith-rooted divorce coach offering trauma-informed, compassionate support for emotional healing and healthy co-parenting through separation.'
    }
  ])

  assert.equal(
    resolveInitialConsultBookingEvent(events, 'jessica')?.eventPath,
    'initial-consults/initial-consult-jessica'
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
  assert.equal(normalizeInitialConsultEventPath('initial-consults/initial-consult?name=Jane'), null)
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
