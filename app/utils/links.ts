import type { AppLink } from '~/types/links'

/**
 * Returns the navigable target for an app link, falling back to home.
 */
export const getLinkTarget = (link: AppLink) => {
  return link.href ?? link.to ?? '/'
}

/**
 * Checks whether a URL target is an absolute HTTP(S) destination.
 */
export const isExternalHref = (target: string) => {
  return /^https?:\/\//.test(target)
}

/**
 * Determines whether a link should be treated as external for rendering.
 */
export const isExternalLink = (link: AppLink) => {
  const target = getLinkTarget(link)

  return Boolean(link.href || target.startsWith('mailto:') || target.startsWith('tel:') || isExternalHref(target))
}
