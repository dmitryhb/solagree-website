import { computed, toValue } from 'vue'
import type { SolagreeSeoInput, StructuredDataObject } from '~/types/seo'

const DEFAULT_SOCIAL_IMAGE = '/images/splash-bg.webp'
const SITE_NAME = 'Solagree'
const TWITTER_CARD_TYPE = 'summary_large_image'

/** Serializes JSON-LD for a script body without allowing markup to terminate the script tag. */
const serializeStructuredData = (item: StructuredDataObject): string => JSON.stringify(item).replace(/</g, '\\u003C')

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
  const path = computed(() => toValue(input.path) ?? route.path)
  const canonicalUrl = computed(() => resolveSiteUrl(siteUrl, path.value))
  const imageUrl = computed(() => resolveImageUrl(siteUrl, toValue(input.image) ?? DEFAULT_SOCIAL_IMAGE))
  const title = computed(() => {
    const rawTitle = toValue(input.title)

    return rawTitle.includes(SITE_NAME) ? rawTitle : `${rawTitle} | ${SITE_NAME}`
  })
  const description = computed(() => toValue(input.description))
  const robots = computed(() => toValue(input.noIndex) ? 'noindex, nofollow' : 'index, follow')

  useHead(() => ({
    htmlAttrs: {
      lang: 'en-US'
    },
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl.value
      }
    ],
    script: input.structuredData?.map((item) => ({
      type: 'application/ld+json',
      textContent: serializeStructuredData(item)
    })) ?? []
  }))

  useSeoMeta({
    title,
    description,
    robots,
    ogTitle: title,
    ogDescription: description,
    ogImage: imageUrl,
    ogSiteName: SITE_NAME,
    ogType: input.type ?? 'website',
    ogUrl: canonicalUrl,
    twitterCard: TWITTER_CARD_TYPE,
    twitterDescription: description,
    twitterImage: imageUrl,
    twitterTitle: title
  })
}
