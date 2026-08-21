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
  | { content: ArticleInlineToken[], level: 2 | 3 | 4, type: 'heading' }
  | { content: ArticleInlineToken[], type: 'paragraph' }
  | { items: ArticleInlineToken[][], ordered: boolean, type: 'list' }
