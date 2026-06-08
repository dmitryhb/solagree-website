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
  smsOptIn: boolean
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

export interface AttorneyLicenseNumberRow {
  id: string
  value: string
}
