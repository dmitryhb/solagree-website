import {
  getPortalSubmissionErrorMessage,
  parsePortalSubmissionIdSuccess,
  submitToPortal
} from '~/services/portal-api'
import type { PortalFetcher, PortalSubmitOptions } from '~/services/portal-api'
import type {
  ContactSubmissionApiResponse,
  ContactSubmissionPayload
} from '#shared/types/contact-submission'
import type { ContactFormState } from '~/types/contact'

const CONTACT_SUBMISSIONS_ENDPOINT = '/api/contact-submissions'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not submit your message. Please try again.'

export type ContactSubmissionFetcher = PortalFetcher<ContactSubmissionPayload>

/**
 * Dependencies required to submit a contact form message.
 */
export interface SubmitContactSubmissionOptions extends PortalSubmitOptions<ContactSubmissionPayload> {
  /**
   * Optional source URL for operational attribution.
   */
  sourceUrl?: string | null
}

/**
 * Creates the portal API payload from validated client contact form state.
 */
export const createContactSubmissionPayload = (
  form: ContactFormState,
  options: Pick<SubmitContactSubmissionOptions, 'sourceUrl'> = {}
): ContactSubmissionPayload => {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    message: form.message.trim(),
    phone: form.phone.trim() || null,
    smsOptIn: form.smsOptIn,
    sourceUrl: options.sourceUrl?.trim() || null
  }
}

/**
 * Converts Nuxt/fetch/native errors into a user-facing contact submission message.
 */
export const getContactSubmissionErrorMessage = (error: unknown): string => {
  return getPortalSubmissionErrorMessage(error, DEFAULT_SUBMISSION_ERROR_MESSAGE)
}

/**
 * Submits a contact message to the portal API and returns the successful API response.
 *
 * @throws Error when the portal returns a contact-submission error response.
 */
export const submitContactSubmission = async (
  form: ContactFormState,
  options: SubmitContactSubmissionOptions
): Promise<ContactSubmissionApiResponse> => {
  return await submitToPortal({
    portalApiBaseUrl: options.portalApiBaseUrl,
    fetcher: options.fetcher,
    endpoint: CONTACT_SUBMISSIONS_ENDPOINT,
    payload: createContactSubmissionPayload(form, options),
    parseSuccess: parsePortalSubmissionIdSuccess<ContactSubmissionApiResponse>,
    fallbackMessage: DEFAULT_SUBMISSION_ERROR_MESSAGE
  })
}
