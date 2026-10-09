import { SubmissionError } from './utils/submission-error.js'
import type { CoBrandedPageType } from './co-branded-page-variant.ts'
import type { ConsultRequestSubmissionPayload } from './types/consult-request.ts'

/** Contact methods offered by the compact co-branded consult form. */
export type CoBrandedPreferredContactMethod = 'email' | 'phone'

/** Client-side values collected by either co-branded consult form variant. */
export interface CoBrandedConsultRequestFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  smsOptIn: boolean
  preferredContactMethod: CoBrandedPreferredContactMethod | ''
  spouseFirstName: string
  spouseLastName: string
}

/** Attribution supplied by the rendered co-branded page. */
export interface CoBrandedConsultRequestPayloadOptions {
  pageType: CoBrandedPageType
  referralCode: string
  sourceUrl?: string | null
}

/**
 * Builds the compact co-branded request payload from the stable page variant.
 * The legacy consultType field remains 'initial' for API compatibility. The page
 * discriminator identifies a firm request, not a booked SOL consultation. Only
 * Attorney (`standard`) requests transmit required conflict-check spouse names.
 */
export const createCoBrandedConsultRequestPayload = (
  form: CoBrandedConsultRequestFormValues,
  options: CoBrandedConsultRequestPayloadOptions
): ConsultRequestSubmissionPayload => {
  const phone = form.phone.trim() || null
  const preferredContactMethod = phone && form.preferredContactMethod
    ? form.preferredContactMethod
    : null

  if (form.smsOptIn && !phone) {
    throw new SubmissionError('Enter a phone number before opting in to text messages.')
  }

  const spouseFields = options.pageType === 'standard'
    ? {
        spouseFirstName: form.spouseFirstName.trim(),
        spouseLastName: form.spouseLastName.trim()
      }
    : {}

  const ruleError = getCoBrandedConsultRequestRuleError({
    pageType: options.pageType,
    consultType: 'initial',
    referralCode: options.referralCode.trim() || null,
    phone,
    smsOptIn: form.smsOptIn,
    preferredContactMethod,
    spouseFirstName: options.pageType === 'standard' ? form.spouseFirstName.trim() || null : null,
    spouseLastName: options.pageType === 'standard' ? form.spouseLastName.trim() || null : null
  })
  if (ruleError) throw new SubmissionError(ruleError)

  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    ...spouseFields,
    email: form.email.trim(),
    phone,
    smsOptIn: phone ? form.smsOptIn : false,
    preferredContactMethod,
    consultType: 'initial',
    coBrandedPageType: options.pageType,
    referralCode: options.referralCode.trim(),
    sourceUrl: options.sourceUrl?.trim() || null,
    quizAnswers: []
  }
}

/** Normalized values used to enforce cross-field co-branded request rules. */
export interface CoBrandedConsultRequestRuleInput {
  pageType: CoBrandedPageType
  consultType: ConsultRequestSubmissionPayload['consultType']
  referralCode: string | null
  phone: string | null
  smsOptIn: boolean
  preferredContactMethod: ConsultRequestSubmissionPayload['preferredContactMethod'] | null
  spouseFirstName: string | null
  spouseLastName: string | null
}

/**
 * Returns the first invalid co-branded request rule, or null when the normalized
 * field combination is safe to persist. The caller maps the message to a 400.
 */
export const getCoBrandedConsultRequestRuleError = (
  input: CoBrandedConsultRequestRuleInput
): string | null => {
  if (input.consultType !== 'initial') {
    return 'Co-branded pages require the supported consultation request type'
  }

  if (!input.referralCode) {
    return 'A referral code is required for a co-branded consult request'
  }

  if (input.smsOptIn && !input.phone) {
    return 'A phone number is required when SMS opt-in is selected'
  }

  if (input.preferredContactMethod === 'text') {
    return 'Preferred contact method must be email or phone for a co-branded consult request'
  }

  if (input.preferredContactMethod && !input.phone) {
    return 'A phone number is required when a preferred contact method is selected'
  }

  if (input.pageType === 'standard' && (!input.spouseFirstName || !input.spouseLastName)) {
    return 'Spouse first name and last name are required for the Attorney co-branded form'
  }

  if (input.pageType === 'cdfa' && (input.spouseFirstName || input.spouseLastName)) {
    return 'Spouse names are not accepted for the CDFA co-branded form'
  }

  return null
}
