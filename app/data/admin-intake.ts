import type { AdminIntakeFormState, AdminIntakePageContent } from '~/types/admin-intake'

/** Privacy preference radio option. */
export interface PrivacyPreferenceOption {
  value: 'hold' | 'open'
  label: string
  helpText: string
}

/**
 * Empty initial state for the admin intake form.
 * Privacy preference defaults to `'hold'` (safest default).
 */
export const adminIntakeInitialState = {
  primaryFirstName: '',
  primaryLastName: '',
  primaryEmail: '',
  spouseFirstName: '',
  spouseLastName: '',
  spouseEmail: '',
  privacyPreference: 'hold'
} as const satisfies AdminIntakeFormState

/**
 * Static copy for the admin intake page.
 */
export const adminIntakePageContent: AdminIntakePageContent = {
  eyebrow: 'Solagree Intake',
  title: 'Let’s Talk',
  description: 'Just the basics to get started. Your spouse won’t be contacted without your permission',
  thankYouPath: 'thank-you'
}

/**
 * Options for the privacy preference radio group.
 */
export const privacyPreferenceOptions: readonly PrivacyPreferenceOption[] = [
  {
    value: 'hold',
    label: 'Hold',
    helpText: 'Do not contact spouse yet.'
  },
  {
    value: 'open',
    label: 'Open',
    helpText: 'Spouse may be included in emails.'
  }
]
