import type {
  AttorneyMediationExperienceValue,
  AttorneyYesNoAnswer
} from '#shared/types/attorney-application'
import type { SelectOption } from '~/types/form-options'

export const attorneyYesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
] as const satisfies readonly SelectOption<AttorneyYesNoAnswer>[]

export const attorneyMediationOptions = [
  { label: 'No', value: 'none' },
  { label: 'Yes, I have certification', value: 'certification' },
  { label: 'Yes, I have a mediation practice', value: 'practice' },
  { label: 'Yes, I have both', value: 'both' }
] as const satisfies readonly SelectOption<AttorneyMediationExperienceValue>[]

export const attorneyApplicationInitialState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  smsOptIn: false,
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
