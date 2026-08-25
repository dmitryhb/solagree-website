/** Supported callout variants for emphasized advisory blocks in repository article bodies. */
export type ArticleCalloutVariant = 'note' | 'tip' | 'important' | 'warning' | 'caution'

/** A safe inline node produced from repository-managed article body text. */
export type ArticleInlineToken =
  | { type: 'text', value: string }
  | {
    /** Safely parsed inline content nested inside emphasis, when the source uses it. */
    tokens?: ArticleInlineToken[]
    type: 'emphasis'
    value: string
  }
  | { href: string, type: 'link', value: string }

/** A safe block node produced from repository-managed article body text. */
export type ArticleRichTextBlock =
  | { alt: string, src: string, type: 'image' }
  | {
    /** Optional CTA destination; present only for `:::callout` blocks with a safe action link. */
    actionHref?: string
    /** Optional CTA label; present only for `:::callout` blocks with a safe action link. */
    actionLabel?: string
    body: ArticleInlineToken[]
    title: ArticleInlineToken[]
    type: 'callout'
    variant: ArticleCalloutVariant
  }
  | { content: ArticleInlineToken[], level: 2 | 3 | 4, type: 'heading' }
  | { content: ArticleInlineToken[], type: 'paragraph' }
  | { items: ArticleInlineToken[][], ordered: boolean, type: 'list' }
