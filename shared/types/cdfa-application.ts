export const CDFA_CERTIFICATION_STATUS_VALUES = [
  'active_cdfa',
  'divorce_financial_advisor',
  'pursuing_certification'
] as const

export type CdfaCertificationStatusValue = (typeof CDFA_CERTIFICATION_STATUS_VALUES)[number]

export const CDFA_CLIENT_EXPERIENCE_VALUES = [
  'less_than_1_year',
  '1_to_3_years',
  '3_to_5_years',
  '5_to_10_years',
  '10_plus_years'
] as const

export type CdfaClientExperienceValue = (typeof CDFA_CLIENT_EXPERIENCE_VALUES)[number]

export const CDFA_SPECIALIZATION_VALUES = [
  'asset_debt_inventory',
  'retirement_qdros',
  'tax_planning',
  'spousal_support',
  'housing_decisions',
  'post_divorce_planning',
  'business_valuation',
  'equity_compensation'
] as const

export type CdfaSpecializationValue = (typeof CDFA_SPECIALIZATION_VALUES)[number]

export const CDFA_CLIENT_SOURCE_VALUES = [
  'existing_clients',
  'referrals',
  'clients_and_referrals'
] as const

export type CdfaClientSourceValue = (typeof CDFA_CLIENT_SOURCE_VALUES)[number]

export const CDFA_CONSULTATION_INTEREST_VALUES = ['yes', 'no', 'maybe'] as const

export type CdfaConsultationInterestValue = (typeof CDFA_CONSULTATION_INTEREST_VALUES)[number]

/**
 * Normalized request body submitted to the Solagree portal CDFA application endpoint.
 */
export interface CdfaApplicationSubmissionPayload {
  name: string
  company: string
  email: string
  phone: string
  smsOptIn?: boolean | null
  address: string
  certificationStatus: CdfaCertificationStatusValue
  certificationNumber: string
  clientExperience: CdfaClientExperienceValue
  serviceArea: string
  specializations: CdfaSpecializationValue[]
  adrNetworks: string
  clientSource: CdfaClientSourceValue
  consultationInterest: CdfaConsultationInterestValue
  termsAccepted: boolean
}

export interface CdfaApplicationApiResponse {
  applicationId: string
  status: 'pending'
}

export interface CdfaApplicationApiErrorResponse {
  error: true
  message: string
}
