import type { SocialLink, SocialLinkIcon, SocialLinkOverrides } from '~/types/links'

export const solagreeSocialLinks = [
  {
    label: 'Facebook',
    ariaLabel: 'Visit Solagree on Facebook',
    href: 'https://www.facebook.com/p/Solagree-61569505738659/',
    icon: 'facebook'
  },
  {
    label: 'Instagram',
    ariaLabel: 'Visit Solagree on Instagram',
    href: 'https://www.instagram.com/solagree_divorce/',
    icon: 'instagram'
  },
  {
    label: 'LinkedIn',
    ariaLabel: 'Visit Solagree on LinkedIn',
    href: 'https://www.linkedin.com/company/solagree',
    icon: 'linkedin'
  }
] as const satisfies readonly SocialLink[]

export const solagreeSocialLinksByIcon = solagreeSocialLinks.reduce<Record<SocialLinkIcon, SocialLink>>(
  (linksByIcon, link) => {
    linksByIcon[link.icon] = link

    return linksByIcon
  },
  {} as Record<SocialLinkIcon, SocialLink>
)

/**
 * Creates the configured Solagree social link list with optional per-icon overrides.
 */
export const createSolagreeSocialLinks = (overrides: SocialLinkOverrides = {}) => {
  return solagreeSocialLinks.map(link => ({
    ...link,
    ...overrides[link.icon],
    icon: link.icon
  }))
}
