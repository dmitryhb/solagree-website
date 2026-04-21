export type LegalSlug = 'terms-of-service' | 'privacy-policy' | 'accessibility'

export interface LegalNavItem {
  label: string
  slug: LegalSlug
  to: string
}

export interface LegalTextBlock {
  type: 'text'
  text: string
}

export interface LegalHeadingBlock {
  type: 'heading'
  text: string
}

export interface LegalSubheadingBlock {
  type: 'subheading'
  text: string
}

export interface LegalListItem {
  label?: string
  text: string
}

export interface LegalListBlock {
  type: 'list'
  items: LegalListItem[]
}

export type LegalContentBlock =
  | LegalTextBlock
  | LegalHeadingBlock
  | LegalSubheadingBlock
  | LegalListBlock

export interface LegalPageContent {
  slug: LegalSlug
  navLabel: string
  title: string
  metaTitle: string
  metaDescription: string
  sourceLabel: string
  revisionLabel: string
  blocks: LegalContentBlock[]
}
