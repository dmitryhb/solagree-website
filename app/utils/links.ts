import type { AppLink } from '~/types/links'

export function getLinkTarget(link: AppLink) {
  return link.href ?? link.to ?? '/'
}

export function isExternalHref(target: string) {
  return /^https?:\/\//.test(target)
}

export function isExternalLink(link: AppLink) {
  const target = getLinkTarget(link)

  return Boolean(link.href || target.startsWith('mailto:') || target.startsWith('tel:') || isExternalHref(target))
}
