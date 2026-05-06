import type { AppLink } from '~/types/links'

export const headerPrimaryLinks = [
  {
    label: 'Getting Divorced',
    to: '/#how-it-works'
  },
  {
    label: 'Attorneys',
    to: '/attorneys'
  },
  {
    label: 'CDFAs & Advisors',
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
