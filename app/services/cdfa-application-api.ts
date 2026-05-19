import {
  CDFA_CERTIFICATION_STATUS_VALUES,
  CDFA_CLIENT_EXPERIENCE_VALUES,
  CDFA_CLIENT_SOURCE_VALUES,
  CDFA_CONSULTATION_INTEREST_VALUES
} from '#shared/types/cdfa-application'
import type {
  CdfaApplicationApiErrorResponse,
  CdfaApplicationApiResponse,
  CdfaApplicationSubmissionPayload,
  CdfaCertificationStatusValue,
  CdfaClientExperienceValue,
  CdfaClientSourceValue,
  CdfaConsultationInterestValue
} from '#shared/types/cdfa-application'
import type { CdfaApplicationFormState } from '~/types/cdfa-application'
import {
  getPortalSubmissionErrorMessage,
  normalizePortalApiBaseUrl
} from '~/services/portal-api'
import type { PortalFetcher, PortalSubmitOptions } from '~/services/portal-api'
import { isMember } from '~/utils/is-member'

const CDFA_APPLICATIONS_ENDPOINT = '/api/cdfa-applications'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not submit your application. Please try again.'

type CdfaApplicationApiResult = CdfaApplicationApiResponse | CdfaApplicationApiErrorResponse

export type CdfaApplicationFetcher = PortalFetcher<CdfaApplicationSubmissionPayload>

export type SubmitCdfaApplicationOptions = PortalSubmitOptions<CdfaApplicationSubmissionPayload>

const isCdfaCertificationStatusValue = (value: string): value is CdfaCertificationStatusValue => {
  return isMember(CDFA_CERTIFICATION_STATUS_VALUES, value)
}

const isCdfaClientExperienceValue = (value: string): value is CdfaClientExperienceValue => {
  return isMember(CDFA_CLIENT_EXPERIENCE_VALUES, value)
}

const isCdfaClientSourceValue = (value: string): value is CdfaClientSourceValue => {
  return isMember(CDFA_CLIENT_SOURCE_VALUES, value)
}

const isCdfaConsultationInterestValue = (value: string): value is CdfaConsultationInterestValue => {
  return isMember(CDFA_CONSULTATION_INTEREST_VALUES, value)
}

export const createCdfaApplicationSubmissionPayload = (
  form: CdfaApplicationFormState
): CdfaApplicationSubmissionPayload => {
  if (
    !isCdfaCertificationStatusValue(form.certificationStatus)
    || !isCdfaClientExperienceValue(form.clientExperience)
    || !isCdfaClientSourceValue(form.clientSource)
    || !isCdfaConsultationInterestValue(form.consultationInterest)
    || form.specializations.length === 0
  ) {
    throw new Error('Please complete all required fields.')
  }

  return {
    name: form.name,
    company: form.company,
    email: form.email,
    phone: form.phone,
    address: form.address,
    certificationStatus: form.certificationStatus,
    certificationNumber: form.certificationNumber,
    clientExperience: form.clientExperience,
    serviceArea: form.serviceArea,
    specializations: form.specializations,
    adrNetworks: form.adrNetworks,
    clientSource: form.clientSource,
    consultationInterest: form.consultationInterest,
    termsAccepted: form.termsAccepted
  }
}

export const getCdfaApplicationSubmissionErrorMessage = (error: unknown): string => {
  return getPortalSubmissionErrorMessage(error, DEFAULT_SUBMISSION_ERROR_MESSAGE)
}

export const submitCdfaApplication = async (
  form: CdfaApplicationFormState,
  options: SubmitCdfaApplicationOptions
): Promise<CdfaApplicationApiResponse> => {
  const portalApiBaseUrl = normalizePortalApiBaseUrl(options.portalApiBaseUrl)
  const response = await options.fetcher<CdfaApplicationApiResult>(
    `${portalApiBaseUrl}${CDFA_APPLICATIONS_ENDPOINT}`,
    {
      method: 'POST',
      body: createCdfaApplicationSubmissionPayload(form)
    }
  )

  if ('error' in response) {
    throw new Error(response.message)
  }

  return response
}
