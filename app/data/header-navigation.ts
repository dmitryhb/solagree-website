import type { AppLink } from '~/types/links'

export const headerPrimaryLinks = [
  {
    label: 'For Couples',
    to: '/#how-it-works'
  },
  {
    label: 'For Professionals',
    to: '/#for-professionals'
  },
  {
    label: 'Employers/EAP',
    to: '/#for-professionals'
  }
] as const satisfies readonly AppLink[]

export const headerLoginLink = {
  label: 'Log in',
  to: '/'
} as const satisfies AppLink

export const headerQuizLink = {
  label: 'Is This Right for You?',
  to: '/#quiz'
} as const satisfies AppLink
