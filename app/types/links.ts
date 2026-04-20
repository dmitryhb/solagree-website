export interface AppLink {
  label: string
  to?: string
  href?: string
  ariaLabel?: string
}

export type SocialLinkIcon = 'facebook' | 'instagram' | 'linkedin'

export interface SocialLink {
  label: string
  ariaLabel: string
  href: string
  icon: SocialLinkIcon
}

export type SocialLinkOverrides = Partial<Record<SocialLinkIcon, Partial<Omit<SocialLink, 'icon'>>>>
