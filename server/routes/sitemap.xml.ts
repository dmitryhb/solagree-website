import { sitemapRoutes } from '~/data/sitemap-routes'
import type { SitemapRoute } from '~/types/sitemap'

const DEFAULT_SITE_URL = 'https://www.solagree.com'

const normalizeSiteUrl = (siteUrl?: string) => {
  return (siteUrl || DEFAULT_SITE_URL).replace(/\/+$/, '')
}

const normalizePath = (path: string) => {
  if (path === '/') {
    return ''
  }

  return path.startsWith('/') ? path : `/${path}`
}

const escapeXml = (value: string) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const renderSitemapUrl = (route: SitemapRoute, siteUrl: string) => {
  const loc = `${siteUrl}${normalizePath(route.path)}`

  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <changefreq>${route.changefreq}</changefreq>`,
    `    <priority>${route.priority.toFixed(1)}</priority>`,
    '  </url>'
  ].join('\n')
}

const renderSitemap = (routes: readonly SitemapRoute[], siteUrl: string) => {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    routes.map((route) => renderSitemapUrl(route, siteUrl)).join('\n'),
    '</urlset>'
  ].join('\n')
}

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(runtimeConfig.public.siteUrl)

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400')

  return renderSitemap(sitemapRoutes, siteUrl)
})
