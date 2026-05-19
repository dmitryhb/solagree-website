import type {
  CdfaCertificationStatusValue,
  CdfaClientExperienceValue,
  CdfaClientSourceValue,
  CdfaConsultationInterestValue,
  CdfaSpecializationValue
} from '#shared/types/cdfa-application'

export type CdfaCertificationStatus = '' | CdfaCertificationStatusValue

export type CdfaClientExperience = '' | CdfaClientExperienceValue

export type CdfaClientSource = '' | CdfaClientSourceValue

export type CdfaConsultationInterest = '' | CdfaConsultationInterestValue

export interface CdfaApplicationFormState {
  name: string
  company: string
  email: string
  phone: string
  address: string
  certificationStatus: CdfaCertificationStatus
  certificationNumber: string
  clientExperience: CdfaClientExperience
  serviceArea: string
  specializations: CdfaSpecializationValue[]
  adrNetworks: string
  clientSource: CdfaClientSource
  consultationInterest: CdfaConsultationInterest
  termsAccepted: boolean
}

export interface CdfaApplicationResult {
  kind: 'success' | 'error'
  title: string
  message: string
}
