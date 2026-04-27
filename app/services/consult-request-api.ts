import {
  getPortalSubmissionErrorMessage,
  normalizePortalApiBaseUrl
} from '~/services/portal-api'
import type {
  ConsultBestTimeOfDay,
  ConsultPreferredContactMethod,
  ConsultRequestApiErrorResponse,
  ConsultRequestApiResponse,
  ConsultRequestFormState,
  ConsultRequestSubmissionPayload
} from '~/types/consult-request'

const CONSULT_REQUESTS_ENDPOINT = '/api/consult-requests'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not submit your consult request. Please try again.'

type ConsultRequestApiResult = ConsultRequestApiResponse | ConsultRequestApiErrorResponse

interface ConsultRequestFetchOptions {
  method: 'POST'
  body: ConsultRequestSubmissionPayload
}

export type ConsultRequestFetcher = <TResponse>(
  request: string,
  options: ConsultRequestFetchOptions
) => Promise<TResponse>

/**
 * Dependencies required to submit a consult request.
 */
export interface SubmitConsultRequestOptions {
  /**
   * Base URL for the external portal API, usually from runtime config.
   */
  portalApiBaseUrl: string
  /**
   * Fetch implementation used by the caller. Nuxt components should pass `$fetch`.
   */
  fetcher: ConsultRequestFetcher
  /**
   * Optional referral code preserved from the public quiz URL.
   */
  referralCode?: string | null
  /**
   * Optional source URL for operational attribution.
   */
  sourceUrl?: string | null
}

/**
 * Converts Nuxt/fetch/native errors into a consult-request submission message.
 */
export const getConsultRequestSubmissionErrorMessage = (error: unknown): string => {
  return getPortalSubmissionErrorMessage(error, DEFAULT_SUBMISSION_ERROR_MESSAGE)
}

const isConsultPreferredContactMethod = (value: string): value is ConsultPreferredContactMethod => {
  return value === 'email' || value === 'phone' || value === 'text'
}

const isConsultBestTimeOfDay = (value: string): value is ConsultBestTimeOfDay => {
  return value === 'morning' || value === 'afternoon' || value === 'evening' || value === 'anytime'
}

/**
 * Creates the portal API payload from validated client form state.
 *
 * @throws Error when required select fields are not narrowed to API values.
 */
export const createConsultRequestSubmissionPayload = (
  form: ConsultRequestFormState,
  options: Pick<SubmitConsultRequestOptions, 'referralCode' | 'sourceUrl'> = {}
): ConsultRequestSubmissionPayload => {
  const preferredContactMethod = form.preferredContactMethod.trim()
  const bestTimeOfDay = form.bestTimeOfDay.trim()

  if (!isConsultPreferredContactMethod(preferredContactMethod) || !isConsultBestTimeOfDay(bestTimeOfDay)) {
    throw new Error('Please complete all required fields.')
  }

  return {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    state: form.state.trim(),
    preferredContactMethod,
    bestTimeOfDay,
    referralCode: options.referralCode?.trim() || null,
    sourceUrl: options.sourceUrl?.trim() || null
  }
}

/**
 * Submits a consult request to the portal API and returns the successful API response.
 *
 * @throws Error when the portal returns a request-level error response.
 */
export const submitConsultRequest = async (
  form: ConsultRequestFormState,
  options: SubmitConsultRequestOptions
): Promise<ConsultRequestApiResponse> => {
  const portalApiBaseUrl = normalizePortalApiBaseUrl(options.portalApiBaseUrl)
  const response = await options.fetcher<ConsultRequestApiResult>(
    `${portalApiBaseUrl}${CONSULT_REQUESTS_ENDPOINT}`,
    {
      method: 'POST',
      body: createConsultRequestSubmissionPayload(form, options)
    }
  )

  if ('error' in response) {
    throw new Error(response.message)
  }

  return response
}
