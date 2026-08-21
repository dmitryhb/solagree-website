import type { AppLink } from '~/types/links'

/** Shared Resources links for the desktop dropdown and mobile navigation group. */
export const resourceNavigationLinks = [
  {
    label: 'Blog',
    to: '/blog'
  },
  {
    label: 'News & Press',
    to: '/news'
  },
  {
    label: 'Webinars & Events',
    to: '/webinar'
  }
] as const satisfies readonly AppLink[]
