import type {
  ExternalNewsItem,
  ResourceArticle,
  ResourceContentEntry
} from './types/resource-content'

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const hasText = (value: string): boolean => value.trim().length > 0

const isIsoDate = (value: string): boolean => {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`)

  return !Number.isNaN(parsedDate.valueOf()) && parsedDate.toISOString().slice(0, 10) === value
}

const isAbsoluteHttpsUrl = (value: string): boolean => {
  try {
    const url = new URL(value)

    return url.protocol === 'https:'
  } catch {
    return false
  }
}

const validateRequiredText = (entry: ResourceContentEntry, errors: string[]): void => {
  const requiredFields = [
    ['title', entry.title],
    ['author', entry.author],
    ['summary', entry.summary],
    ['seo.title', entry.seo.title],
    ['seo.description', entry.seo.description],
    ['social.title', entry.social.title],
    ['social.description', entry.social.description],
    ['social.image', entry.social.image]
  ] as const

  for (const [field, value] of requiredFields) {
    if (!hasText(value)) {
      errors.push(`Resource entry "${entry.slug || '(missing slug)'}" is missing ${field}.`)
    }
  }
}

const validateEntry = (entry: ResourceContentEntry, errors: string[]): void => {
  if (!hasText(entry.slug)) {
    errors.push('Resource entry is missing slug.')
  }

  if (!isIsoDate(entry.publishedAt)) {
    errors.push(`Resource entry "${entry.slug || '(missing slug)'}" has invalid publishedAt date "${entry.publishedAt}".`)
  }

  validateRequiredText(entry, errors)

  if (entry.kind === 'article' && !hasText(entry.body)) {
    errors.push(`Article "${entry.slug || '(missing slug)'}" is missing body.`)
  }

  if (entry.kind === 'news' && !isAbsoluteHttpsUrl(entry.externalUrl)) {
    errors.push(`News item "${entry.slug || '(missing slug)'}" has invalid externalUrl.`)
  }
}

/**
 * Validates repository-managed entries while the content module is loaded.
 * Throws a combined error so an invalid publication cannot reach a build.
 */
export const validateResourceContentEntries = (entries: readonly ResourceContentEntry[]): void => {
  const errors: string[] = []
  const seenSlugs = new Set<string>()

  for (const entry of entries) {
    validateEntry(entry, errors)

    const normalizedSlug = entry.slug.trim()
    if (normalizedSlug && seenSlugs.has(normalizedSlug)) {
      errors.push(`Resource entry slug "${normalizedSlug}" is duplicated.`)
    }
    seenSlugs.add(normalizedSlug)
  }

  if (errors.length > 0) {
    throw new Error(`Invalid resource content:\n${errors.join('\n')}`)
  }
}

/** Returns only entries approved for public lists, navigation, and sitemap generation. */
export const getPublishedResourceEntries = (
  entries: readonly ResourceContentEntry[]
): readonly ResourceContentEntry[] => entries.filter(entry => entry.status === 'published')

/** Narrows public entries to Solagree-hosted articles for internal routes and the sitemap. */
export const getPublishedArticles = (
  entries: readonly ResourceContentEntry[]
): readonly ResourceArticle[] => [...getPublishedResourceEntries(entries)
  .filter((entry): entry is ResourceArticle => entry.kind === 'article')
].sort((first, second) => second.publishedAt.localeCompare(first.publishedAt))

/** Finds a public internal article by its exact slug for direct route resolution. */
export const getPublishedArticleBySlug = (
  entries: readonly ResourceContentEntry[],
  slug: string
): ResourceArticle | undefined => getPublishedArticles(entries)
  .find(article => article.slug === slug)

/** Narrows public entries to external coverage for News & Press lists. */
export const getPublishedNewsItems = (
  entries: readonly ResourceContentEntry[]
): readonly ExternalNewsItem[] => getPublishedResourceEntries(entries)
  .filter((entry): entry is ExternalNewsItem => entry.kind === 'news')
