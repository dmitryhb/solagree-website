import type {
  ConsultBestTimeOfDay,
  ConsultPreferredContactMethod,
  ConsultType
} from '#shared/types/consult-request'
import type { CoBrandedConsultRequestFormValues } from '#shared/co-branded-consult-request'

export interface ConsultRequestFormState {
  fullName: string
  email: string
  phone: string
  smsOptIn: boolean
  state: string
  preferredContactMethod: ConsultPreferredContactMethod | ''
  bestTimeOfDay: ConsultBestTimeOfDay | ''
}

/** Mutable form state used by the Attorney and CDFA co-branded modal variants. */
export type CoBrandedConsultRequestFormState = CoBrandedConsultRequestFormValues

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
