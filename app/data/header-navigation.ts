import type { AppLink } from '~/types/links'
import { resourceNavigationLinks } from '~/data/resource-navigation'

export const headerPrimaryLinks = [
  {
    label: 'Attorneys',
    to: '/attorneys'
  },
  {
    label: 'CDFAs® & Advisors',
    to: '/cdfa'
  }
] as const satisfies readonly AppLink[]

/** Resources submenu shared by the desktop disclosure and mobile navigation. */
export const headerResourcesMenu = {
  label: 'Resources',
  links: resourceNavigationLinks
} as const

export const headerLoginLink = {
  label: 'Log in'
} as const satisfies Pick<AppLink, 'label'>

export const headerQuizLink = {
  label: 'Is This Right for You?',
  to: '/#quiz'
} as const satisfies AppLink

/** Couples destinations shared by desktop and mobile navigation. */
export const headerCouplesMenu = {
  label: 'Considering Divorce',
  links: [
    { label: 'For Couples', to: '/#how-it-works' },
    { label: 'Military', to: '/military-divorce' },
    { label: 'Special Needs', to: '/divorce-special-needs-children' }
  ]
} as const
