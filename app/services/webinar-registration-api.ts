import {
  getPortalSubmissionErrorMessage,
  normalizePortalApiBaseUrl
} from '~/services/portal-api'
import type { PortalFetcher, PortalSubmitOptions } from '~/services/portal-api'
import type {
  ContactSubmissionApiErrorResponse,
  ContactSubmissionApiResponse,
  WebinarRegistrationSubmissionPayload
} from '#shared/types/contact-submission'
import type { WebinarFormState, WebinarRegistrationContent } from '~/types/webinar'

const CONTACT_SUBMISSIONS_ENDPOINT = '/api/contact-submissions'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not register you for the webinar. Please try again.'

type WebinarRegistrationApiResult = ContactSubmissionApiResponse | ContactSubmissionApiErrorResponse
type WebinarSubmissionType = WebinarRegistrationContent['submissionType']

export type WebinarRegistrationFetcher = PortalFetcher<WebinarRegistrationSubmissionPayload>

/**
 * Dependencies required to submit a webinar registration to the Portal.
 */
export interface SubmitWebinarRegistrationOptions extends PortalSubmitOptions<WebinarRegistrationSubmissionPayload> {
  /**
   * Portal contact-submission type used to distinguish webinar audiences.
   */
  submissionType: WebinarSubmissionType
  /**
   * Optional source URL for operational attribution.
   */
  sourceUrl?: string | null
}

/**
 * Creates the Portal API payload from validated client webinar form state.
 */
export const createWebinarRegistrationPayload = (
  form: WebinarFormState,
  options: Pick<SubmitWebinarRegistrationOptions, 'submissionType' | 'sourceUrl'>
): WebinarRegistrationSubmissionPayload => {
  return {
    submissionType: options.submissionType,
    businessEmail: form.businessEmail.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    companyName: form.companyName.trim() || null,
    state: form.state.trim(),
    sourceUrl: options.sourceUrl?.trim() || null
  }
}

/**
 * Converts Nuxt/fetch/native errors into a user-facing webinar registration message.
 */
export const getWebinarRegistrationErrorMessage = (error: unknown): string => {
  return getPortalSubmissionErrorMessage(error, DEFAULT_SUBMISSION_ERROR_MESSAGE)
}

/**
 * Submits a webinar registration to the Portal contact submissions endpoint.
 *
 * @throws Error when the Portal returns a request-level error response.
 */
export const submitWebinarRegistration = async (
  form: WebinarFormState,
  options: SubmitWebinarRegistrationOptions
): Promise<ContactSubmissionApiResponse> => {
  const portalApiBaseUrl = normalizePortalApiBaseUrl(options.portalApiBaseUrl)
  const response = await options.fetcher<WebinarRegistrationApiResult>(
    `${portalApiBaseUrl}${CONTACT_SUBMISSIONS_ENDPOINT}`,
    {
      method: 'POST',
      body: createWebinarRegistrationPayload(form, options)
    }
  )

  if ('error' in response) {
    throw new Error(response.message)
  }

  return response
}
