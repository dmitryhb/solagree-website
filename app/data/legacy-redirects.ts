const exactLegacyRedirects: Record<string, string> = {
  '/about': '/about-us',
  '/accessibility': '/legal/accessibility',
  '/be-a-part-of-the-future-with-us-for-lawyers-mediators-and-cdfa-professionals': '/attorneys',
  '/category': '/faq',
  '/comments/feed': '/faq',
  '/contact': '/contact',
  '/disclaimer': '/legal/terms-of-service',
  '/feed': '/faq',
  '/frequently-asked-questions': '/faq',
  '/privacy-policy': '/legal/privacy-policy',
  '/site-map': '/sitemap.xml',
  '/tag': '/faq',
  '/terms-of-service': '/legal/terms-of-service',
  '/the-solagree-method-vs-traditional-divorce': '/#how-it-works',
  '/the-solagree-process': '/#how-it-works',
  '/webinars-and-events': '/webinar',
  '/wilmington-divorce-family-law-office': '/contact',
  '/wilmington-divorce-mediation': '/contact'
}

const prefixLegacyRedirects: Array<readonly [string, string]> = [
  ['/category/', '/faq'],
  ['/author/', '/faq'],
  ['/tag/', '/faq']
]

const normalizeLegacyPath = (path: string) => {
  if (path === '/') {
    return path
  }

  return path.replace(/\/+$/, '')
}

export const findLegacyRedirectTarget = (path: string): string | undefined => {
  const normalizedPath = normalizeLegacyPath(path)
  const exactRedirect = exactLegacyRedirects[normalizedPath]

  if (exactRedirect !== undefined) {
    return exactRedirect === path ? undefined : exactRedirect
  }

  return prefixLegacyRedirects.find(([prefix]) => path.startsWith(prefix))?.[1]
}
