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
