export const CONSULT_PREFERRED_CONTACT_METHODS = ['email', 'phone', 'text'] as const

export type ConsultPreferredContactMethod = (typeof CONSULT_PREFERRED_CONTACT_METHODS)[number]

export const CONSULT_BEST_TIMES_OF_DAY = ['morning', 'afternoon', 'evening', 'anytime'] as const

export type ConsultBestTimeOfDay = (typeof CONSULT_BEST_TIMES_OF_DAY)[number]

export const CONSULT_TYPES = ['initial', 'attorney'] as const

export type ConsultType = (typeof CONSULT_TYPES)[number]

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
  consultType: ConsultType
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
