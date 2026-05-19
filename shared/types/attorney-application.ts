export const ATTORNEY_YES_NO_ANSWERS = ['yes', 'no'] as const

export type AttorneyYesNoAnswer = (typeof ATTORNEY_YES_NO_ANSWERS)[number]

export const ATTORNEY_MEDIATION_EXPERIENCE_VALUES = [
  'none',
  'certification',
  'practice',
  'both'
] as const

export type AttorneyMediationExperienceValue = (typeof ATTORNEY_MEDIATION_EXPERIENCE_VALUES)[number]

/**
 * Normalized request body submitted to the Solagree portal attorney application endpoint.
 */
export interface AttorneyApplicationSubmissionPayload {
  name: string
  company: string
  email: string
  phone: string
  address: string
  barStates: string[]
  licenseNumbers: string[]
  initialLicensureYear: string
  goodStanding: AttorneyYesNoAnswer
  disciplinaryFinding: AttorneyYesNoAnswer
  disciplinaryExplanation: string
  mediationExperience: AttorneyMediationExperienceValue
  neutralInterest: AttorneyYesNoAnswer
  adrNetworks: string
  consultationInterest: AttorneyYesNoAnswer
  termsAccepted: boolean
}

export interface AttorneyApplicationApiResponse {
  applicationId: string
  status: 'pending'
}

export interface AttorneyApplicationApiErrorResponse {
  error: true
  message: string
}
