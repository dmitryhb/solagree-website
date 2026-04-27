import { isExternalHref } from '~/utils/links'

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
