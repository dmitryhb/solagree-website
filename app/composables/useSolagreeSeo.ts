import type { SolagreeSeoInput } from '~/types/seo'

const DEFAULT_SOCIAL_IMAGE = '/images/splash-bg.webp'
const SITE_NAME = 'Solagree'
const TWITTER_CARD_TYPE = 'summary_large_image'

/**
 * Removes duplicate slashes and trailing slashes so canonical URLs stay stable
 * regardless of route aliases such as `/webinar` and `/webinar/`.
 */
const normalizePath = (path: string) => {
  const trimmedPath = path.split('?')[0]?.split('#')[0] || '/'
  const normalizedPath = trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`
  const dedupedPath = normalizedPath.replace(/\/{2,}/g, '/')

  return dedupedPath === '/' ? dedupedPath : dedupedPath.replace(/\/+$/, '')
}

/**
 * Resolves site-relative paths against the configured public site URL for
 * canonical, Open Graph, and JSON-LD URLs.
 */
const resolveSiteUrl = (siteUrl: string, path: string) => {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, '')
  const normalizedPath = normalizePath(path)

  return `${normalizedSiteUrl}${normalizedPath === '/' ? '' : normalizedPath}`
}

/**
 * Resolves social image paths to absolute URLs because social crawlers should
 * not need to infer the host from relative Open Graph image values.
 */
const resolveImageUrl = (siteUrl: string, image: string) => {
  if (/^https?:\/\//i.test(image)) {
    return image
  }

  return resolveSiteUrl(siteUrl, image.startsWith('/') ? image : `/${image}`)
}

/**
 * Applies the complete Solagree SEO baseline for public and utility pages:
 * title, description, canonical URL, Open Graph, Twitter card, robots, and
 * optional JSON-LD structured data.
 */
export const useSolagreeSeo = (input: SolagreeSeoInput) => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = runtimeConfig.public.siteUrl
  const path = input.path ?? route.path
  const canonicalUrl = resolveSiteUrl(siteUrl, path)
  const imageUrl = resolveImageUrl(siteUrl, input.image ?? DEFAULT_SOCIAL_IMAGE)
  const title = input.title.includes(SITE_NAME) ? input.title : `${input.title} | ${SITE_NAME}`
  const robots = input.noIndex ? 'noindex, nofollow' : 'index, follow'

  useHead({
    htmlAttrs: {
      lang: 'en-US'
    },
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl
      }
    ],
    script: input.structuredData?.map((item) => ({
      type: 'application/ld+json',
      children: JSON.stringify(item)
    })) ?? []
  })

  useSeoMeta({
    title,
    description: input.description,
    robots,
    ogTitle: title,
    ogDescription: input.description,
    ogImage: imageUrl,
    ogSiteName: SITE_NAME,
    ogType: input.type ?? 'website',
    ogUrl: canonicalUrl,
    twitterCard: TWITTER_CARD_TYPE,
    twitterDescription: input.description,
    twitterImage: imageUrl,
    twitterTitle: title
  })
}
