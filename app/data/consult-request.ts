import type {
  ConsultBestTimeOfDay,
  ConsultPreferredContactMethod
} from '#shared/types/consult-request'
import type {
  ConsultRequestFormState,
  ConsultRequestPageContent,
  ConsultRequestThankYouContent
} from '~/types/consult-request'
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

export const initialConsultRequestContent = {
  consultType: 'initial',
  eyebrow: '30-45 minutes. • $60',
  title: 'Book a Solagree Initial Consult',
  description: 'Talk with our team about your unique situation and learn if Solagree is right for you. We\'ll explain the process, answer your questions, and give you a personalized price range.',
  thankYouPath: '/book-a-solagree-consult/thank-you'
} as const satisfies ConsultRequestPageContent

export const attorneyConsultRequestContent = {
  consultType: 'attorney',
  eyebrow: '1 hour • $250',
  title: 'Book an Attorney Consult',
  description: 'Talk with a licensed attorney in your state who works with Solagree cases. Discuss your situation, ask questions about assets, custody, and support, and learn how Solagree would work for your case.',
  thankYouPath: '/book-an-attorney-consult/thank-you'
} as const satisfies ConsultRequestPageContent

export const initialConsultThankYouContent = {
  title: 'Thank you for scheduling your consultation!',
  paymentItem: 'A secure payment link for the $60 consultation fee',
  callItems: [
    'Answer your questions about the Solagree process',
    "Help you determine if it's a fit for your situation",
    'Discuss next steps if you decide to move forward'
  ]
} as const satisfies ConsultRequestThankYouContent

export const attorneyConsultThankYouContent = {
  title: 'Thank you for scheduling your attorney consultation!',
  paymentItem: 'A secure payment link for the $250 attorney consultation fee',
  callItems: [
    'Answer your legal questions before you choose the next Solagree step',
    "Help you understand what attorney guidance means for your situation",
    'Discuss next steps if you decide to move forward'
  ]
} as const satisfies ConsultRequestThankYouContent
