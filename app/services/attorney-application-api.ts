import type {
  AttorneyApplicationApiErrorResponse,
  AttorneyApplicationApiResponse,
  AttorneyApplicationFormState
} from '~/types/attorney-application'

const ATTORNEY_APPLICATIONS_ENDPOINT = '/api/attorney-applications'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not submit your application. Please try again.'

type AttorneyApplicationApiResult = AttorneyApplicationApiResponse | AttorneyApplicationApiErrorResponse

interface AttorneyApplicationFetchOptions {
  method: 'POST'
  body: AttorneyApplicationSubmissionPayload
}

type AttorneyApplicationFetcher = <TResponse>(
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
 * Removes trailing slashes so endpoint paths can be appended consistently.
 */
export function normalizePortalApiBaseUrl(portalApiBaseUrl: string) {
  return String(portalApiBaseUrl || '').replace(/\/+$/, '')
}

/**
 * Creates the API payload from form state and trims repeatable license fields.
 */
export function createAttorneyApplicationSubmissionPayload(
  form: AttorneyApplicationFormState
): AttorneyApplicationSubmissionPayload {
  return {
    ...form,
    licenseNumbers: form.licenseNumbers.map((licenseNumber) => licenseNumber.trim())
  }
}

/**
 * Converts Nuxt/fetch/native errors into a user-facing submission message.
 */
export function getAttorneyApplicationSubmissionErrorMessage(error: unknown) {
  if (
    typeof error === 'object'
    && error !== null
    && 'data' in error
    && typeof error.data === 'object'
    && error.data !== null
    && 'message' in error.data
    && typeof error.data.message === 'string'
  ) {
    return error.data.message
  }

  if (
    typeof error === 'object'
    && error !== null
    && 'statusMessage' in error
    && typeof error.statusMessage === 'string'
  ) {
    return error.statusMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  return DEFAULT_SUBMISSION_ERROR_MESSAGE
}

/**
 * Submits an attorney application to the portal API and returns the successful API response.
 *
 * @throws Error when the portal returns an application-level error response.
 */
export async function submitAttorneyApplication(
  form: AttorneyApplicationFormState,
  options: SubmitAttorneyApplicationOptions
) {
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
