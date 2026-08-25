import { sitemapRoutes } from '~/data/sitemap-routes'
import { renderSitemapXml } from '~/utils/sitemap-xml'

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig(event)

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400')

  return renderSitemapXml(sitemapRoutes, runtimeConfig.public.siteUrl)
})
