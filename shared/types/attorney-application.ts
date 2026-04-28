export type AttorneyYesNoAnswer = 'yes' | 'no'

export type AttorneyMediationExperienceValue =
  | 'none'
  | 'certification'
  | 'practice'
  | 'both'

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
