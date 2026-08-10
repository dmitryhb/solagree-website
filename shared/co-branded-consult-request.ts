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
 * Both variants create an Initial Consult; only the Attorney (`standard`) page
 * may transmit internal conflict-check spouse names.
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
    throw new Error('Enter a phone number before opting in to text messages.')
  }

  const spouseFields = options.pageType === 'standard'
    ? {
        spouseFirstName: form.spouseFirstName.trim(),
        spouseLastName: form.spouseLastName.trim()
      }
    : {}

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
