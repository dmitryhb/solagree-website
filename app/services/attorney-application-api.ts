import type {
  AttorneyApplicationApiErrorResponse,
  AttorneyApplicationApiResponse,
  AttorneyApplicationFormState
} from '~/types/attorney-application'
import {
  getPortalSubmissionErrorMessage,
  normalizePortalApiBaseUrl
} from '~/services/portal-api'

const ATTORNEY_APPLICATIONS_ENDPOINT = '/api/attorney-applications'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not submit your application. Please try again.'

type AttorneyApplicationApiResult = AttorneyApplicationApiResponse | AttorneyApplicationApiErrorResponse

interface AttorneyApplicationFetchOptions {
  method: 'POST'
  body: AttorneyApplicationSubmissionPayload
}

export type AttorneyApplicationFetcher = <TResponse>(
  request: string,
  options: AttorneyApplicationFetchOptions
) => Promise<TResponse>

/**
 * Request body sent to the portal API after client-side normalization.
 */
export interface AttorneyApplicationSubmissionPayload extends AttorneyApplicationFormState {
  licenseNumbers: string[]
}

/**
 * Dependencies required to submit an attorney application.
 */
export interface SubmitAttorneyApplicationOptions {
  /**
   * Base URL for the external portal API, usually from runtime config.
   */
  portalApiBaseUrl: string
  /**
   * Fetch implementation used by the caller. Nuxt components should pass `$fetch`.
   */
  fetcher: AttorneyApplicationFetcher
}

/**
 * Creates the API payload from form state and trims repeatable license fields.
 */
export const createAttorneyApplicationSubmissionPayload = (
  form: AttorneyApplicationFormState
): AttorneyApplicationSubmissionPayload => {
  return {
    ...form,
    licenseNumbers: form.licenseNumbers.map((licenseNumber) => licenseNumber.trim())
  }
}

/**
 * Converts Nuxt/fetch/native errors into a user-facing submission message.
 */
export const getAttorneyApplicationSubmissionErrorMessage = (error: unknown): string => {
  return getPortalSubmissionErrorMessage(error, DEFAULT_SUBMISSION_ERROR_MESSAGE)
}

/**
 * Submits an attorney application to the portal API and returns the successful API response.
 *
 * @throws Error when the portal returns an application-level error response.
 */
export const submitAttorneyApplication = async (
  form: AttorneyApplicationFormState,
  options: SubmitAttorneyApplicationOptions
): Promise<AttorneyApplicationApiResponse> => {
  const portalApiBaseUrl = normalizePortalApiBaseUrl(options.portalApiBaseUrl)
  const response = await options.fetcher<AttorneyApplicationApiResult>(
    `${portalApiBaseUrl}${ATTORNEY_APPLICATIONS_ENDPOINT}`,
    {
      method: 'POST',
      body: createAttorneyApplicationSubmissionPayload(form)
    }
  )

  if ('error' in response) {
    throw new Error(response.message)
  }

  return response
}
