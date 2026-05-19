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

const CDFA_APPLICATIONS_ENDPOINT = '/api/cdfa-applications'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not submit your application. Please try again.'

type CdfaApplicationApiResult = CdfaApplicationApiResponse | CdfaApplicationApiErrorResponse

interface CdfaApplicationFetchOptions {
  method: 'POST'
  body: CdfaApplicationSubmissionPayload
}

export type CdfaApplicationFetcher = <TResponse>(
  request: string,
  options: CdfaApplicationFetchOptions
) => Promise<TResponse>

export interface SubmitCdfaApplicationOptions {
  portalApiBaseUrl: string
  fetcher: CdfaApplicationFetcher
}

const isCdfaCertificationStatusValue = (value: string): value is CdfaCertificationStatusValue => {
  return value === 'active_cdfa'
    || value === 'divorce_financial_advisor'
    || value === 'pursuing_certification'
}

const isCdfaClientExperienceValue = (value: string): value is CdfaClientExperienceValue => {
  return value === 'less_than_1_year'
    || value === '1_to_3_years'
    || value === '3_to_5_years'
    || value === '5_to_10_years'
    || value === '10_plus_years'
}

const isCdfaClientSourceValue = (value: string): value is CdfaClientSourceValue => {
  return value === 'existing_clients'
    || value === 'referrals'
    || value === 'clients_and_referrals'
}

const isCdfaConsultationInterestValue = (value: string): value is CdfaConsultationInterestValue => {
  return value === 'yes' || value === 'no' || value === 'maybe'
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
