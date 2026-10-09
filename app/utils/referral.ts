import { isExternalHref } from '~/utils/links'

/** Normalizes optional campaign attribution to the Portal's accepted code shape. */
export const sanitizeReferralCode = (raw: unknown): string | null => {
  const value = Array.isArray(raw) ? raw.find(value => typeof value === 'string' && value.trim()) : raw
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '-')
  return /^[a-z0-9][a-z0-9_-]{1,79}$/i.test(normalized) ? normalized : null
}

/**
 * Appends the public `ref` query value to same-site links when one is present.
 */
export const appendReferralToHref = (href: string, refValue: string | null): string => {
  if (!refValue || isExternalHref(href) || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href
  }

  const [pathWithQuery = href, hash = ''] = href.split('#')
  const [path, query = ''] = pathWithQuery.split('?')
  const searchParams = new URLSearchParams(query)

  searchParams.set('ref', refValue)

  const queryString = searchParams.toString()
  const hashString = hash ? `#${hash}` : ''

  return `${path}${queryString ? `?${queryString}` : ''}${hashString}`
}
