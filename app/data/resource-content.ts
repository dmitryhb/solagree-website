import {
  getPublishedArticles,
  getPublishedNewsItems,
  validateResourceContentEntries
} from '../../shared/resource-content-validation'
import type { ResourceContentEntry } from '../../shared/types/resource-content'

/**
 * The Git-managed source for Blog articles and external News & Press entries.
 * New entries must pass validation here before Nuxt can build or render them.
 */
export const resourceContentEntries = [] as const satisfies readonly ResourceContentEntry[]

validateResourceContentEntries(resourceContentEntries)

/** Public internal articles, intentionally excluding drafts from all consumers. */
export const publishedArticles = getPublishedArticles(resourceContentEntries)

/** Public external News & Press items, intentionally excluding drafts from all consumers. */
export const publishedNewsItems = getPublishedNewsItems(resourceContentEntries)
