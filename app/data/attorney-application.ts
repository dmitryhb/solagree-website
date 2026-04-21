import type { AttorneyMediationExperience, AttorneySelectOption, AttorneyYesNo } from '~/types/attorney-application'

export const attorneyYesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
] as const satisfies readonly AttorneySelectOption<Exclude<AttorneyYesNo, ''>>[]

export const attorneyMediationOptions = [
  { label: 'No', value: 'none' },
  { label: 'Yes, I have certification', value: 'certification' },
  { label: 'Yes, I have a mediation practice', value: 'practice' },
  { label: 'Yes, I have both', value: 'both' }
] as const satisfies readonly AttorneySelectOption<Exclude<AttorneyMediationExperience, ''>>[]

export const attorneyApplicationInitialState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  address: '',
  barStates: [],
  licenseNumbers: [''],
  initialLicensureYear: '',
  goodStanding: '',
  disciplinaryFinding: '',
  disciplinaryExplanation: '',
  mediationExperience: '',
  neutralInterest: '',
  adrNetworks: '',
  consultationInterest: '',
  termsAccepted: false
} as const
