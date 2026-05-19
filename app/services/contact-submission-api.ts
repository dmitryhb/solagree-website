import {
  getPortalSubmissionErrorMessage,
  normalizePortalApiBaseUrl
} from '~/services/portal-api'
import type { PortalFetcher, PortalSubmitOptions } from '~/services/portal-api'
import type {
  ContactSubmissionApiErrorResponse,
  ContactSubmissionApiResponse,
  ContactSubmissionPayload
} from '#shared/types/contact-submission'
import type { ContactFormState } from '~/types/contact'

const CONTACT_SUBMISSIONS_ENDPOINT = '/api/contact-submissions'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not submit your message. Please try again.'

type ContactSubmissionApiResult = ContactSubmissionApiResponse | ContactSubmissionApiErrorResponse

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
  const portalApiBaseUrl = normalizePortalApiBaseUrl(options.portalApiBaseUrl)
  const response = await options.fetcher<ContactSubmissionApiResult>(
    `${portalApiBaseUrl}${CONTACT_SUBMISSIONS_ENDPOINT}`,
    {
      method: 'POST',
      body: createContactSubmissionPayload(form, options)
    }
  )

  if ('error' in response) {
    throw new Error(response.message)
  }

  return response
}
