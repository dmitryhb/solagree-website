import type {
  AttorneyMediationExperienceValue,
  AttorneyYesNoAnswer
} from '#shared/types/attorney-application'

export type AttorneyYesNo = '' | AttorneyYesNoAnswer

export type AttorneyMediationExperience = '' | AttorneyMediationExperienceValue

export interface AttorneyApplicationFormState {
  name: string
  company: string
  email: string
  phone: string
  address: string
  barStates: string[]
  licenseNumbers: string[]
  initialLicensureYear: string
  goodStanding: AttorneyYesNo
  disciplinaryFinding: AttorneyYesNo
  disciplinaryExplanation: string
  mediationExperience: AttorneyMediationExperience
  neutralInterest: AttorneyYesNo
  adrNetworks: string
  consultationInterest: AttorneyYesNo
  termsAccepted: boolean
}

export interface AttorneySelectOption<TValue extends string = string> {
  label: string
  value: TValue
}

export interface AttorneyApplicationResult {
  kind: 'success' | 'error'
  title: string
  message: string
}
