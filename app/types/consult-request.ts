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
