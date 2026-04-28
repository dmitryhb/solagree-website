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

export interface ConsultSelectOption<TValue extends string = string> {
  label: string
  value: TValue
}

export interface ConsultRequestResult {
  title: string
  message: string
}
