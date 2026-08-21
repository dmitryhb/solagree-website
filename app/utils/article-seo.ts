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

/** Builds schema.org Article data matching each article's canonical social metadata. */
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
  description: article.seo.description,
  headline: article.seo.title,
  image: resolveArticleUrl(siteUrl, article.social.image),
  mainEntityOfPage: resolveArticleUrl(siteUrl, getArticlePath(article))
})
