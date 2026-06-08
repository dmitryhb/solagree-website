import {
  getPortalSubmissionErrorMessage,
  normalizePortalApiBaseUrl
} from '~/services/portal-api'
import type { PortalFetcher, PortalSubmitOptions } from '~/services/portal-api'
import {
  CONSULT_BEST_TIMES_OF_DAY,
  CONSULT_PREFERRED_CONTACT_METHODS
} from '#shared/types/consult-request'
import type {
  ConsultBestTimeOfDay,
  ConsultPreferredContactMethod,
  ConsultRequestApiErrorResponse,
  ConsultRequestApiResponse,
  ConsultRequestQuizAnswer,
  ConsultRequestSubmissionPayload,
  ConsultType
} from '#shared/types/consult-request'
import type { ConsultRequestFormState } from '~/types/consult-request'
import { isMember } from '~/utils/is-member'

const CONSULT_REQUESTS_ENDPOINT = '/api/consult-requests'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not submit your consult request. Please try again.'

type ConsultRequestApiResult = ConsultRequestApiResponse | ConsultRequestApiErrorResponse

export type ConsultRequestFetcher = PortalFetcher<ConsultRequestSubmissionPayload>

/**
 * Dependencies required to submit a consult request.
 */
export interface SubmitConsultRequestOptions extends PortalSubmitOptions<ConsultRequestSubmissionPayload> {
  /**
   * Public consult flow selected by the route that submitted the request.
   */
  consultType: ConsultType
  /**
   * Optional referral code preserved from the public quiz URL.
   */
  referralCode?: string | null
  /**
   * Optional source URL for operational attribution.
   */
  sourceUrl?: string | null
  /**
   * Optional public quiz answer snapshot captured before the consult request.
   */
  quizAnswers?: ConsultRequestQuizAnswer[] | null
}

export interface CoBrandedConsultRequestFormState {
  firstName: string
  lastName: string
  email: string
}

export interface SubmitCoBrandedConsultRequestOptions extends PortalSubmitOptions<ConsultRequestSubmissionPayload> {
  consultType: ConsultType
  referralCode: string
  sourceUrl?: string | null
}

/**
 * Converts Nuxt/fetch/native errors into a consult-request submission message.
 */
export const getConsultRequestSubmissionErrorMessage = (error: unknown): string => {
  return getPortalSubmissionErrorMessage(error, DEFAULT_SUBMISSION_ERROR_MESSAGE)
}

const isConsultPreferredContactMethod = (value: string): value is ConsultPreferredContactMethod => {
  return isMember(CONSULT_PREFERRED_CONTACT_METHODS, value)
}

const isConsultBestTimeOfDay = (value: string): value is ConsultBestTimeOfDay => {
  return isMember(CONSULT_BEST_TIMES_OF_DAY, value)
}

/**
 * Creates the portal API payload from validated client form state.
 *
 * @throws Error when required select fields are not narrowed to API values.
 */
export const createConsultRequestSubmissionPayload = (
  form: ConsultRequestFormState,
  options: Pick<SubmitConsultRequestOptions, 'consultType' | 'referralCode' | 'sourceUrl' | 'quizAnswers'>
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
    smsOptIn: form.smsOptIn,
    state: form.state.trim(),
    preferredContactMethod,
    bestTimeOfDay,
    consultType: options.consultType,
    referralCode: options.referralCode?.trim() || null,
    sourceUrl: options.sourceUrl?.trim() || null,
    quizAnswers: options.quizAnswers ?? []
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

/**
 * Submits the compact co-branded consultation popup form with partner attribution.
 */
export const submitCoBrandedConsultRequest = async (
  form: CoBrandedConsultRequestFormState,
  options: SubmitCoBrandedConsultRequestOptions
): Promise<ConsultRequestApiResponse> => {
  const portalApiBaseUrl = normalizePortalApiBaseUrl(options.portalApiBaseUrl)
  const response = await options.fetcher<ConsultRequestApiResult>(
    `${portalApiBaseUrl}${CONSULT_REQUESTS_ENDPOINT}`,
    {
      method: 'POST',
      body: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email.trim(),
        consultType: options.consultType,
        referralCode: options.referralCode.trim(),
        sourceUrl: options.sourceUrl?.trim() || null,
        quizAnswers: []
      }
    }
  )

  if ('error' in response) {
    throw new Error(response.message)
  }

  return response
}
