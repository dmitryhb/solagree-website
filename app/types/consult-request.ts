export type ConsultPreferredContactMethod = 'email' | 'phone' | 'text'

export type ConsultBestTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime'

export interface ConsultRequestFormState {
  fullName: string
  email: string
  phone: string
  state: string
  preferredContactMethod: ConsultPreferredContactMethod | ''
  bestTimeOfDay: ConsultBestTimeOfDay | ''
}

export interface ConsultRequestQuizAnswer {
  questionId: string
  question: string
  value: string | string[]
  answerLabels: string[]
}

export interface ConsultSelectOption<TValue extends string = string> {
  label: string
  value: TValue
}

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

export interface ConsultRequestResult {
  title: string
  message: string
}
