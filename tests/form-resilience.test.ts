import { describe, expect, it } from 'vitest'
import { sanitizeReferralCode } from '../app/utils/referral'
import { getPortalSubmissionErrorMessage } from '../app/services/portal-api'
import { SubmissionError } from '../shared/utils/submission-error.ts'
import { createCoBrandedConsultRequestPayload } from '../shared/co-branded-consult-request'

describe('optional referral and safe error copy', () => {
  it.each(['a', 'a'.repeat(81), '<script>', null, undefined])('drops invalid referral %s', raw => {
    expect(sanitizeReferralCode(raw)).toBeNull()
  })
  it('uses Portal normalization and query-array handling', () => {
    expect(sanitizeReferralCode([' ', ' Firm Name '])).toBe('firm-name')
  })
  it.each([
    { statusCode: 502, data: '<html>Bad Gateway</html>', statusMessage: '' },
    { statusMessage: ' ' },
    Object.assign(new Error('[POST] url: Failed to fetch'), { name: 'FetchError' }),
    new TypeError('Failed to fetch'),
    new Error('internal diagnostic')
  ])('shows fallback for transport failures', error => {
    expect(getPortalSubmissionErrorMessage(error, 'Please try again.')).toBe('Please try again.')
  })
  it('preserves checked application messages and validation responses', () => {
    expect(getPortalSubmissionErrorMessage(new SubmissionError('Enter your name.'))).toBe('Enter your name.')
    expect(getPortalSubmissionErrorMessage({ statusCode: 400, data: { message: 'Enter your name.' } })).toBe('Enter your name.')
  })
  it('rejects blank spouse names before sending a co-branded request', () => {
    expect(() => createCoBrandedConsultRequestPayload({
      firstName: 'Avery', lastName: 'Lee', email: 'a@example.com', phone: '', smsOptIn: false,
      preferredContactMethod: '', spouseFirstName: ' ', spouseLastName: ' '
    }, { pageType: 'standard', referralCode: 'firm' })).toThrow('Spouse first name')
  })
})
