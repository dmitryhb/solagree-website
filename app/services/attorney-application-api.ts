import {
  ATTORNEY_MEDIATION_EXPERIENCE_VALUES,
  ATTORNEY_YES_NO_ANSWERS
} from '#shared/types/attorney-application'
import type {
  AttorneyApplicationApiResponse,
  AttorneyApplicationSubmissionPayload,
  AttorneyMediationExperienceValue,
  AttorneyYesNoAnswer
} from '#shared/types/attorney-application'
import type {
  AttorneyApplicationFormState
} from '~/types/attorney-application'
import {
  getPortalSubmissionErrorMessage,
  isNonEmptyString,
  submitToPortal
} from '~/services/portal-api'
import type { PortalFetcher, PortalSubmitOptions } from '~/services/portal-api'
import { isMember } from '~/utils/is-member'

const ATTORNEY_APPLICATIONS_ENDPOINT = '/api/attorney-applications'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not submit your application. Please try again.'

export type AttorneyApplicationFetcher = PortalFetcher<AttorneyApplicationSubmissionPayload>

/**
 * Dependencies required to submit an attorney application.
 */
export type SubmitAttorneyApplicationOptions = PortalSubmitOptions<AttorneyApplicationSubmissionPayload>

const isAttorneyYesNoAnswer = (value: string): value is AttorneyYesNoAnswer => {
  return isMember(ATTORNEY_YES_NO_ANSWERS, value)
}

const isAttorneyMediationExperienceValue = (value: string): value is AttorneyMediationExperienceValue => {
  return isMember(ATTORNEY_MEDIATION_EXPERIENCE_VALUES, value)
}

/**
 * Creates the API payload from form state and trims repeatable license fields.
 *
 * @throws Error when required select fields are not narrowed to API values.
 */
export const createAttorneyApplicationSubmissionPayload = (
  form: AttorneyApplicationFormState
): AttorneyApplicationSubmissionPayload => {
  if (
    !isAttorneyYesNoAnswer(form.goodStanding)
    || !isAttorneyYesNoAnswer(form.disciplinaryFinding)
    || !isAttorneyMediationExperienceValue(form.mediationExperience)
    || !isAttorneyYesNoAnswer(form.neutralInterest)
    || !isAttorneyYesNoAnswer(form.consultationInterest)
  ) {
    throw new Error('Please complete all required fields.')
  }

  return {
    name: form.name,
    company: form.company,
    email: form.email,
    phone: form.phone,
    smsOptIn: form.smsOptIn,
    address: form.address,
    barStates: form.barStates,
    licenseNumbers: form.licenseNumbers.map((licenseNumber) => licenseNumber.trim()),
    initialLicensureYear: form.initialLicensureYear,
    goodStanding: form.goodStanding,
    disciplinaryFinding: form.disciplinaryFinding,
    disciplinaryExplanation: form.disciplinaryExplanation,
    mediationExperience: form.mediationExperience,
    neutralInterest: form.neutralInterest,
    adrNetworks: form.adrNetworks,
    consultationInterest: form.consultationInterest,
    termsAccepted: form.termsAccepted
  }
}

/**
 * Converts Nuxt/fetch/native errors into a user-facing submission message.
 */
export const getAttorneyApplicationSubmissionErrorMessage = (error: unknown): string => {
  return getPortalSubmissionErrorMessage(error, DEFAULT_SUBMISSION_ERROR_MESSAGE)
}

/**
 * Runtime parser for the attorney application success response.
 *
 * Requires a non-empty string `applicationId` per the documented
 * `AttorneyApplicationApiResponse` contract.
 */
const parseAttorneyApplicationSuccess = (response: object): AttorneyApplicationApiResponse | null => {
  return 'applicationId' in response && isNonEmptyString(response.applicationId)
    ? response as AttorneyApplicationApiResponse
    : null
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
  return await submitToPortal({
    portalApiBaseUrl: options.portalApiBaseUrl,
    fetcher: options.fetcher,
    endpoint: ATTORNEY_APPLICATIONS_ENDPOINT,
    payload: createAttorneyApplicationSubmissionPayload(form),
    parseSuccess: parseAttorneyApplicationSuccess,
    fallbackMessage: DEFAULT_SUBMISSION_ERROR_MESSAGE
  })
}
