export type ConsultPreferredContactMethod = 'email' | 'phone' | 'text'

export type ConsultBestTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime'

/**
 * Public quiz answer snapshot sent with a consult request for portal-side intake context.
 */
export interface ConsultRequestQuizAnswer {
  questionId: string
  question: string
  value: string | string[]
  answerLabels: string[]
}

/**
 * Normalized request body submitted to the Solagree portal consult request endpoint.
 */
export interface ConsultRequestSubmissionPayload {
  fullName: string
  email: string
  phone: string
  state: string
  preferredContactMethod: ConsultPreferredContactMethod
  bestTimeOfDay: ConsultBestTimeOfDay
  referralCode?: string | null
  sourceUrl?: string | null
  quizAnswers?: ConsultRequestQuizAnswer[] | null
}

export interface ConsultRequestApiResponse {
  ok: true
  requestId: string
}

export interface ConsultRequestApiErrorResponse {
  error: true
  message: string
}
