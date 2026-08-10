import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createCoBrandedConsultRequestPayload,
  type CoBrandedConsultRequestFormValues
} from '../shared/co-branded-consult-request.ts'

const createForm = (
  overrides: Partial<CoBrandedConsultRequestFormValues> = {}
): CoBrandedConsultRequestFormValues => ({
  firstName: ' Jamie ',
  lastName: ' Parker ',
  email: ' jamie@example.test ',
  phone: ' 415-555-1234 ',
  smsOptIn: true,
  preferredContactMethod: 'phone',
  spouseFirstName: ' Taylor ',
  spouseLastName: ' Parker ',
  ...overrides
})

test('builds the Attorney page payload as an Initial Consult with structured spouse names', () => {
  const payload = createCoBrandedConsultRequestPayload(createForm(), {
    pageType: 'standard',
    referralCode: ' rivera-mediation ',
    sourceUrl: ' https://www.solagree.com/go/rivera-mediation '
  })

  assert.deepEqual(payload, {
    firstName: 'Jamie',
    lastName: 'Parker',
    spouseFirstName: 'Taylor',
    spouseLastName: 'Parker',
    email: 'jamie@example.test',
    phone: '415-555-1234',
    smsOptIn: true,
    preferredContactMethod: 'phone',
    consultType: 'initial',
    coBrandedPageType: 'standard',
    referralCode: 'rivera-mediation',
    sourceUrl: 'https://www.solagree.com/go/rivera-mediation',
    quizAnswers: []
  })
})

test('omits spouse names from the CDFA payload', () => {
  const payload = createCoBrandedConsultRequestPayload(createForm(), {
    pageType: 'cdfa',
    referralCode: 'cdfa-partner'
  })

  assert.equal(payload.consultType, 'initial')
  assert.equal(payload.coBrandedPageType, 'cdfa')
  assert.equal('spouseFirstName' in payload, false)
  assert.equal('spouseLastName' in payload, false)
})

test('omits optional phone contact data when phone is blank', () => {
  const payload = createCoBrandedConsultRequestPayload(createForm({
    phone: ' ',
    smsOptIn: false,
    preferredContactMethod: 'email'
  }), {
    pageType: 'cdfa',
    referralCode: 'cdfa-partner'
  })

  assert.equal(payload.phone, null)
  assert.equal(payload.smsOptIn, false)
  assert.equal(payload.preferredContactMethod, null)
})

test('rejects SMS consent without a phone number', () => {
  assert.throws(() => createCoBrandedConsultRequestPayload(createForm({
    phone: '',
    smsOptIn: true
  }), {
    pageType: 'standard',
    referralCode: 'attorney-partner'
  }), /Enter a phone number/)
})
