import type {
  ConsultBestTimeOfDay,
  ConsultPreferredContactMethod
} from '#shared/types/consult-request'
import type {
  ConsultRequestFormState,
  ConsultSelectOption
} from '~/types/consult-request'

export const consultRequestInitialState = {
  fullName: '',
  email: '',
  phone: '',
  state: '',
  preferredContactMethod: '',
  bestTimeOfDay: ''
} as const satisfies ConsultRequestFormState

export const consultPreferredContactMethodOptions = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Text', value: 'text' }
] as const satisfies readonly ConsultSelectOption<ConsultPreferredContactMethod>[]

export const consultBestTimeOfDayOptions = [
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Evening', value: 'evening' },
  { label: 'Anytime', value: 'anytime' }
] as const satisfies readonly ConsultSelectOption<ConsultBestTimeOfDay>[]
