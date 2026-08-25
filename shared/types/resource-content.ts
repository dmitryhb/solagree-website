/** Publication state used to prevent unfinished resource entries from being exposed publicly. */
export type ResourcePublicationStatus = 'draft' | 'published'

/** Distinguishes Solagree-hosted articles from coverage that lives on another site. */
export type ResourceContentKind = 'article' | 'news'

/** Describes whether a resource opens a Solagree route or an external publication. */
export type ResourceLinkMode = 'internal' | 'external'

/** SEO fields required for every public resource entry. */
export interface ResourceSeoMetadata {
  description: string
  title: string
}

/** Social-preview fields required for every public resource entry. */
export interface ResourceSocialMetadata {
  description: string
  image: string
  title: string
}

/** Fields shared by all repository-managed resource entries. */
export interface ResourceContentBase {
  author: string
  category?: string
  /** Optional visual for cards and the article hero; the renderer supplies a fallback when absent. */
  featuredImage?: string
  featured?: boolean
  publishedAt: string
  seo: ResourceSeoMetadata
  slug: string
  social: ResourceSocialMetadata
  status: ResourcePublicationStatus
  summary: string
  title: string
  /**
   * Optional later revision date. Must be a real YYYY-MM-DD ISO date that is on or
   * after publishedAt; feeds Article JSON-LD dateModified. Omit unless the entry was
   * genuinely revised, because no fallback date is ever invented.
   */
  updatedAt?: string
}

/** A Solagree-hosted article with body content and an internal route. */
export interface ResourceArticle extends ResourceContentBase {
  /** Markdown-like source rendered through the safe article renderer. */
  body: string
  kind: 'article'
  linkMode: 'internal'
  /**
   * Optional slugs of other published internal articles to feature as related
   * reading. Each slug must resolve to a published article, cannot reference the
   * article itself, and cannot be listed twice.
   */
  relatedArticleSlugs?: readonly string[]
}

/** An external news or press item that links to the original publication. */
export interface ExternalNewsItem extends ResourceContentBase {
  externalUrl: string
  kind: 'news'
  linkMode: 'external'
}

/** A resource entry that can be published through the website without a CMS. */
export type ResourceContentEntry = ResourceArticle | ExternalNewsItem
