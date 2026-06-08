import type {
  CdfaCertificationStatusValue,
  CdfaClientExperienceValue,
  CdfaClientSourceValue,
  CdfaConsultationInterestValue,
  CdfaSpecializationValue
} from '#shared/types/cdfa-application'
import type { SelectOption } from '~/types/form-options'

export const cdfaCertificationStatusOptions = [
  { label: 'Yes, I hold an active CDFA® designation', value: 'active_cdfa' },
  { label: "No, but I'm a financial advisor with divorce experience", value: 'divorce_financial_advisor' },
  { label: "No, I'm currently pursuing CDFA® certification", value: 'pursuing_certification' }
] as const satisfies readonly SelectOption<CdfaCertificationStatusValue>[]

export const cdfaClientExperienceOptions = [
  { label: 'Less than 1 year', value: 'less_than_1_year' },
  { label: '1-3 years', value: '1_to_3_years' },
  { label: '3-5 years', value: '3_to_5_years' },
  { label: '5-10 years', value: '5_to_10_years' },
  { label: '10+ years', value: '10_plus_years' }
] as const satisfies readonly SelectOption<CdfaClientExperienceValue>[]

export const cdfaSpecializationOptions = [
  { label: 'Asset and debt inventory', value: 'asset_debt_inventory' },
  { label: 'Retirement account analysis & QDROs', value: 'retirement_qdros' },
  { label: 'Tax implications and planning', value: 'tax_planning' },
  { label: 'Spousal support calculations', value: 'spousal_support' },
  { label: 'Housing decisions (rent vs. retain vs. sell)', value: 'housing_decisions' },
  { label: 'Post-divorce financial planning', value: 'post_divorce_planning' },
  { label: 'Business valuation', value: 'business_valuation' },
  { label: 'Stock options and equity compensation', value: 'equity_compensation' }
] as const satisfies readonly SelectOption<CdfaSpecializationValue>[]

export const cdfaClientSourceOptions = [
  { label: 'Yes, I have existing clients', value: 'existing_clients' },
  { label: "No, but I'm interested in receiving referrals", value: 'referrals' },
  { label: 'Both - I have clients and want referrals', value: 'clients_and_referrals' }
] as const satisfies readonly SelectOption<CdfaClientSourceValue>[]

export const cdfaConsultationInterestOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Maybe - tell me more', value: 'maybe' }
] as const satisfies readonly SelectOption<CdfaConsultationInterestValue>[]

export const cdfaApplicationInitialState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  smsOptIn: false,
  address: '',
  certificationStatus: '',
  certificationNumber: '',
  clientExperience: '',
  serviceArea: '',
  specializations: [],
  adrNetworks: '',
  clientSource: '',
  consultationInterest: '',
  termsAccepted: false
} as const
