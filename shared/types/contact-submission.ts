/**
 * Normalized request body submitted to the Solagree portal contact submissions endpoint.
 */
export interface ContactSubmissionPayload {
  name: string
  email: string
  message: string
  phone?: string | null
  sourceUrl?: string | null
}

/** Portal contact-submission type used to identify webinar registrations. */
export type WebinarContactSubmissionType = 'attorney_webinar' | 'cdfa_webinar'

/**
 * Normalized request body submitted from public webinar registration forms.
 */
export interface WebinarRegistrationSubmissionPayload {
  submissionType: WebinarContactSubmissionType
  businessEmail: string
  firstName: string
  lastName: string
  companyName?: string | null
  state: string
  sourceUrl?: string | null
}

export interface ContactSubmissionApiResponse {
  ok: true
  submissionId: string
}

export interface ContactSubmissionApiErrorResponse {
  error: true
  message: string
}
