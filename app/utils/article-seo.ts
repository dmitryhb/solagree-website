import type { StructuredDataObject } from '~/types/seo'
import type { ResourceArticle } from '#shared/types/resource-content'

/** Returns the canonical internal path for a Solagree-hosted article. */
export const getArticlePath = (article: Pick<ResourceArticle, 'slug'>): string => `/blog/${article.slug}`

const resolveArticleUrl = (siteUrl: string, path: string): string => {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `${siteUrl.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Builds the Solagree publisher node reusing the organization identity already
 * published on the homepage (name plus the committed /solagree-logo.svg asset).
 */
const buildPublisher = (siteUrl: string): Record<string, unknown> => ({
  '@type': 'Organization',
  logo: {
    '@type': 'ImageObject',
    url: resolveArticleUrl(siteUrl, '/solagree-logo.svg')
  },
  name: 'Solagree'
})

/**
 * Builds schema.org Article data matching each article's canonical social metadata.
 *
 * dateModified policy: emitted only from a validated repository `updatedAt` value.
 * When an article has never been revised, dateModified is omitted rather than
 * duplicated from datePublished, because schema.org treats dateModified as the
 * most recent modification date and consumers already fall back to datePublished
 * for unmodified works; duplicating it would assert a revision that never happened.
 */
export const buildArticleStructuredData = (
  article: ResourceArticle,
  siteUrl: string
): StructuredDataObject => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  author: {
    '@type': 'Person',
    name: article.author
  },
  datePublished: article.publishedAt,
  ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
  description: article.seo.description,
  headline: article.seo.title,
  image: resolveArticleUrl(siteUrl, article.social.image),
  mainEntityOfPage: resolveArticleUrl(siteUrl, getArticlePath(article)),
  publisher: buildPublisher(siteUrl)
})
