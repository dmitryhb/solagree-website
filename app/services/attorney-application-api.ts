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

export interface AttorneyApplicationSubmissionPayload extends AttorneyApplicationFormState {
  licenseNumbers: string[]
}

export interface SubmitAttorneyApplicationOptions {
  portalApiBaseUrl: string
  fetcher: AttorneyApplicationFetcher
}

export function normalizePortalApiBaseUrl(portalApiBaseUrl: string) {
  return String(portalApiBaseUrl || '').replace(/\/+$/, '')
}

export function createAttorneyApplicationSubmissionPayload(
  form: AttorneyApplicationFormState
): AttorneyApplicationSubmissionPayload {
  return {
    ...form,
    licenseNumbers: form.licenseNumbers.map((licenseNumber) => licenseNumber.trim())
  }
}

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
