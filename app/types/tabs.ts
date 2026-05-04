import type { RouteLocationRaw } from 'vue-router'

/**
 * Shared pill-tab item for pages that use the legal navigation visual pattern.
 */
export interface TabNavItem {
  label: string
  slug: string
  to: RouteLocationRaw
}
