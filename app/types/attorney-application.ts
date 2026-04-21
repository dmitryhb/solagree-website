export type AttorneyYesNo = '' | 'yes' | 'no'

export type AttorneyMediationExperience =
  | ''
  | 'none'
  | 'certification'
  | 'practice'
  | 'both'

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
  kind: 'vetting' | 'auto-approval'
  title: string
  message: string
}
