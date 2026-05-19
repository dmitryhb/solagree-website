import type {
  ConsultBestTimeOfDay,
  ConsultPreferredContactMethod
} from '#shared/types/consult-request'
import type { ConsultRequestFormState } from '~/types/consult-request'
import type { SelectOption } from '~/types/form-options'

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
] as const satisfies readonly SelectOption<ConsultPreferredContactMethod>[]

export const consultBestTimeOfDayOptions = [
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Evening', value: 'evening' },
  { label: 'Anytime', value: 'anytime' }
] as const satisfies readonly SelectOption<ConsultBestTimeOfDay>[]
