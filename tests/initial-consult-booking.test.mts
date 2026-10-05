import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getInitialConsultBookingTrackingContext,
  normalizeInitialConsultEventPath,
  resolveInitialConsultBookingEvent,
  resolveInitialConsultBookingEvents,
  resolveInitialConsultBookingMethodEvent,
  resolveInitialConsultMeetingMethodMode,
  type InitialConsultBookingRuntimeConfig
} from '../shared/initial-consult-booking.ts'

const configuredEvents: InitialConsultBookingRuntimeConfig = {
  unpublishedConsultants: '',
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


test('unpublishes Jessica by default without requiring her event path and supports restoration', () => {
  const events = resolveInitialConsultBookingEvents({ ...configuredEvents, unpublishedConsultants: undefined, jessicaEventPath: '' })
  assert.deepEqual(events.map(event => event.id), ['first-available', 'taj', 'stacie', 'james'])
  assert.equal(resolveInitialConsultBookingEvent(events, 'jessica'), null)
  assert.equal(resolveInitialConsultBookingEvents(configuredEvents).length, 5)
  assert.equal(resolveInitialConsultBookingEvents({ ...configuredEvents, unpublishedConsultants: ' taj, jessica ', tajEventPath: '' }).length, 3)
})

test('rejects invalid publishing settings and an entirely unpublished team', () => {
  for (const unpublishedConsultants of [false, 'jesica', 'first-available', 'taj,stacie,james,jessica']) {
    assert.deepEqual(resolveInitialConsultBookingEvents({ ...configuredEvents, unpublishedConsultants }), [])
  }
})

const separateConfig: InitialConsultBookingRuntimeConfig = {
  ...configuredEvents,
  meetingMethodMode: 'separate',
  unpublishedConsultants: 'jessica',
  firstAvailablePhoneEventPath: 'initial-consults/initial-consult-phone',
  tajPhoneEventPath: 'initial-consults/initial-consult-taj-phone',
  staciePhoneEventPath: 'initial-consults/initial-consult-stacie-phone',
  jamesPhoneEventPath: 'initial-consults/initial-consult-james-phone'
}

test('keeps mixed routing by default and requires an explicit supported mode', () => {
  assert.equal(resolveInitialConsultMeetingMethodMode(configuredEvents), 'mixed')
  assert.deepEqual(resolveInitialConsultBookingEvents({
    ...configuredEvents, meetingMethodMode: 'mixed', tajPhoneEventPath: 'not/a/valid?path'
  }), resolveInitialConsultBookingEvents(configuredEvents))
  for (const meetingMethodMode of ['', 'Separate', 'other', false, null]) {
    assert.equal(resolveInitialConsultMeetingMethodMode({ meetingMethodMode }), null)
    assert.deepEqual(resolveInitialConsultBookingEvents({ ...separateConfig, meetingMethodMode }), [])
  }
})

test('resolves eight separate native routes without requiring paused Jessica paths', () => {
  const events = resolveInitialConsultBookingEvents({ ...separateConfig, jessicaEventPath: '', jessicaPhoneEventPath: 'invalid' })
  assert.deepEqual(events.map(event => event.id), ['first-available', 'taj', 'stacie', 'james'])
  assert.equal(new Set(events.flatMap(event => [event.eventPath, event.phoneEventPath])).size, 8)
  for (const event of events) {
    assert.equal(resolveInitialConsultBookingMethodEvent(event, null), null)
    assert.equal(resolveInitialConsultBookingMethodEvent(event, 'zoom')?.eventPath, event.eventPath)
    assert.equal(resolveInitialConsultBookingMethodEvent(event, 'phone')?.eventPath, event.phoneEventPath)
    assert.equal(resolveInitialConsultBookingMethodEvent(event, 'phone')?.id, event.id)
  }
  assert.equal(resolveInitialConsultBookingMethodEvent(resolveInitialConsultBookingEvents(configuredEvents)[0]!, 'phone'), null)
})

test('fails closed on partial, malformed or colliding separate routes', () => {
  for (const config of [
    { tajPhoneEventPath: '' },
    { tajPhoneEventPath: undefined },
    { staciePhoneEventPath: 'https://solagree.cal.com/initial-consults/initial-consult-stacie-phone' },
    { jamesEventPath: 'initial-consults/initial-consult-james?method=zoom' },
    { tajPhoneEventPath: separateConfig.tajEventPath },
    { tajPhoneEventPath: separateConfig.staciePhoneEventPath },
    { tajPhoneEventPath: 'INITIAL-CONSULTS/INITIAL-CONSULT-JAMES' },
    { tajEventPath: separateConfig.stacieEventPath },
    { unpublishedConsultants: '' }
  ]) {
    assert.deepEqual(resolveInitialConsultBookingEvents({ ...separateConfig, ...config }), [], JSON.stringify(config))
  }
  assert.equal(resolveInitialConsultBookingEvents({
    ...separateConfig,
    unpublishedConsultants: '',
    jessicaPhoneEventPath: 'initial-consults/initial-consult-jessica-phone'
  }).length, 5)
})
