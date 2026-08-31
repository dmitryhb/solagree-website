import type {
  ExternalNewsItem,
  ResourceArticle,
  ResourceContentEntry
} from './types/resource-content'

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Repository images must be served from the public /images directory without traversal or query tricks. */
const REPOSITORY_IMAGE_PATH_PATTERN = /^\/images\/[A-Za-z0-9][A-Za-z0-9._/-]*$/

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

/** Accepts only site-relative paths under the public /images directory, e.g. /images/hero.webp. */
const isRepositoryImagePath = (value: string): boolean =>
  REPOSITORY_IMAGE_PATH_PATTERN.test(value) && !value.includes('/../') && !value.endsWith('/..')

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

const validateEntryDates = (entry: ResourceContentEntry, errors: string[]): void => {
  if (!isIsoDate(entry.publishedAt)) {
    errors.push(`Resource entry "${entry.slug || '(missing slug)'}" has invalid publishedAt date "${entry.publishedAt}".`)
  }

  const updatedAt = entry.updatedAt

  if (updatedAt === undefined) {
    return
  }

  if (!isIsoDate(updatedAt)) {
    errors.push(`Resource entry "${entry.slug || '(missing slug)'}" has invalid updatedAt date "${updatedAt}".`)
    return
  }

  if (isIsoDate(entry.publishedAt) && updatedAt < entry.publishedAt) {
    errors.push(
      `Resource entry "${entry.slug || '(missing slug)'}" has updatedAt date "${updatedAt}" before publishedAt date "${entry.publishedAt}".`
    )
  }
}

const validateEntryImagePaths = (entry: ResourceContentEntry, errors: string[]): void => {
  const imageFields = [
    ['featuredImage', entry.featuredImage ?? ''],
    ['social.image', entry.social.image]
  ] as const

  for (const [field, value] of imageFields) {
    if (hasText(value) && !isRepositoryImagePath(value.trim())) {
      errors.push(
        `Resource entry "${entry.slug || '(missing slug)'}" has ${field} "${value}" outside the supported public /images/ path convention.`
      )
    }
  }
}

const validateEntry = (entry: ResourceContentEntry, errors: string[]): void => {
  if (!hasText(entry.slug)) {
    errors.push('Resource entry is missing slug.')
  }

  validateEntryDates(entry, errors)
  validateRequiredText(entry, errors)
  validateEntryImagePaths(entry, errors)

  if (entry.kind === 'article' && !hasText(entry.body)) {
    errors.push(`Article "${entry.slug || '(missing slug)'}" is missing body.`)
  }

  if (entry.kind === 'news' && !isAbsoluteHttpsUrl(entry.externalUrl)) {
    errors.push(`News item "${entry.slug || '(missing slug)'}" has invalid externalUrl.`)
  }
}

/**
 * Published lists pick at most one featured entry, so two published featured
 * entries in the same list would be silently ambiguous. The news list and the
 * article list each select their own featured entry, so the check is per kind.
 */
const validatePublishedFeaturedEntries = (entries: readonly ResourceContentEntry[], errors: string[]): void => {
  for (const kind of ['article', 'news'] as const) {
    const featuredSlugs = entries
      .filter(entry => entry.status === 'published' && entry.featured === true && entry.kind === kind)
      .map(entry => entry.slug)

    if (featuredSlugs.length > 1) {
      errors.push(
        `Multiple published ${kind} entries are marked featured (${featuredSlugs.map(slug => `"${slug}"`).join(', ')}); only one published featured ${kind} entry is allowed.`
      )
    }
  }
}

const validateRelatedArticleSlugs = (entries: readonly ResourceContentEntry[], errors: string[]): void => {
  const publishedArticleSlugs = new Set(
    entries
      .filter(entry => entry.status === 'published' && entry.kind === 'article')
      .map(entry => entry.slug)
  )

  for (const entry of entries) {
    if (entry.kind !== 'article' || entry.relatedArticleSlugs === undefined) {
      continue
    }

    const slug = entry.slug || '(missing slug)'

    if (!Array.isArray(entry.relatedArticleSlugs)) {
      errors.push(`Article "${slug}" has relatedArticleSlugs that is not an array.`)
      continue
    }

    const seenRelatedSlugs = new Set<string>()

    for (const relatedSlug of entry.relatedArticleSlugs) {
      const normalizedRelatedSlug = String(relatedSlug).trim()

      if (!normalizedRelatedSlug) {
        errors.push(`Article "${slug}" has an empty relatedArticleSlugs entry.`)
        continue
      }

      if (normalizedRelatedSlug === entry.slug) {
        errors.push(`Article "${slug}" cannot relate to itself in relatedArticleSlugs.`)
        continue
      }

      if (seenRelatedSlugs.has(normalizedRelatedSlug)) {
        errors.push(`Article "${slug}" lists related slug "${normalizedRelatedSlug}" more than once.`)
        continue
      }
      seenRelatedSlugs.add(normalizedRelatedSlug)

      if (!publishedArticleSlugs.has(normalizedRelatedSlug)) {
        errors.push(
          `Article "${slug}" references related slug "${normalizedRelatedSlug}" which is not a published internal article.`
        )
      }
    }
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

  validatePublishedFeaturedEntries(entries, errors)
  validateRelatedArticleSlugs(entries, errors)

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
): readonly ExternalNewsItem[] => [...getPublishedResourceEntries(entries)
  .filter((entry): entry is ExternalNewsItem => entry.kind === 'news')
].sort((first, second) => second.publishedAt.localeCompare(first.publishedAt))
