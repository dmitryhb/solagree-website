import type {
  ConsultBestTimeOfDay,
  ConsultPreferredContactMethod
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
