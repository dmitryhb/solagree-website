export type CdfaCertificationStatusValue =
  | 'active_cdfa'
  | 'divorce_financial_advisor'
  | 'pursuing_certification'

export type CdfaClientExperienceValue =
  | 'less_than_1_year'
  | '1_to_3_years'
  | '3_to_5_years'
  | '5_to_10_years'
  | '10_plus_years'

export type CdfaSpecializationValue =
  | 'asset_debt_inventory'
  | 'retirement_qdros'
  | 'tax_planning'
  | 'spousal_support'
  | 'housing_decisions'
  | 'post_divorce_planning'
  | 'business_valuation'
  | 'equity_compensation'

export type CdfaClientSourceValue =
  | 'existing_clients'
  | 'referrals'
  | 'clients_and_referrals'

export type CdfaConsultationInterestValue = 'yes' | 'no' | 'maybe'

/**
 * Normalized request body submitted to the Solagree portal CDFA application endpoint.
 */
export interface CdfaApplicationSubmissionPayload {
  name: string
  company: string
  email: string
  phone: string
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
