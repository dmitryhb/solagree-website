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

export interface ContactSubmissionApiResponse {
  ok: true
  submissionId: string
}

export interface ContactSubmissionApiErrorResponse {
  error: true
  message: string
}
