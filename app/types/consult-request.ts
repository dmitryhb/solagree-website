import type {
  ConsultBestTimeOfDay,
  ConsultPreferredContactMethod,
  ConsultType
} from '#shared/types/consult-request'

export interface ConsultRequestFormState {
  fullName: string
  email: string
  phone: string
  state: string
  preferredContactMethod: ConsultPreferredContactMethod | ''
  bestTimeOfDay: ConsultBestTimeOfDay | ''
}

export interface ConsultRequestResult {
  title: string
  message: string
}

export interface ConsultRequestPageContent {
  consultType: ConsultType
  eyebrow: string
  title: string
  description: string
  thankYouPath: string
}

export interface ConsultRequestThankYouContent {
  title: string
  paymentItem: string
  callItems: string[]
}
