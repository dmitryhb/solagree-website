import type { SitemapRoute } from '~/types/sitemap'

const DEFAULT_SITE_URL = 'https://www.solagree.com'

/** Normalizes the runtime site origin so it never contributes a trailing slash. */
export const normalizeSiteUrl = (siteUrl?: string): string => {
  return (siteUrl || DEFAULT_SITE_URL).replace(/\/+$/, '')
}

const normalizePath = (path: string): string => {
  if (path === '/') {
    return ''
  }

  return path.startsWith('/') ? path : `/${path}`
}

const escapeXml = (value: string): string => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const renderSitemapUrl = (route: SitemapRoute, siteUrl: string): string => {
  const loc = `${siteUrl}${normalizePath(route.path)}`

  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <changefreq>${route.changefreq}</changefreq>`,
    `    <priority>${route.priority.toFixed(1)}</priority>`,
    '  </url>'
  ].join('\n')
}

/** Renders the complete sitemap document served from /sitemap.xml and prerendered into static output. */
export const renderSitemapXml = (routes: readonly SitemapRoute[], siteUrl?: string): string => {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl)

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    routes.map((route) => renderSitemapUrl(route, normalizedSiteUrl)).join('\n'),
    '</urlset>'
  ].join('\n')
}
