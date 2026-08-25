import type { ArticleInlineToken, ArticleRichTextBlock } from '~/types/article-rich-text'

const INLINE_MARKUP_PATTERN = /(\[([^\]]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g
const HEADING_PATTERN = /^(#{1,4})\s+(.+)$/
const IMAGE_PATTERN = /^!\[([^\]]*)\]\(([^\s)]+)\)$/
const ORDERED_ITEM_PATTERN = /^\d+\.\s+(.+)$/
const UNORDERED_ITEM_PATTERN = /^[-*]\s+(.+)$/
const CALLOUT_START = ':::callout'
const CALLOUT_END = ':::'

const isSafeHref = (href: string): boolean => {
  if ((href.startsWith('/') && !href.startsWith('//')) || href.startsWith('#')) {
    return true
  }

  try {
    const url = new URL(href)

    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'mailto:'
  } catch {
    return false
  }
}

/** Converts the small, documented Markdown subset into safe inline render tokens. */
export const parseArticleInlineContent = (value: string): ArticleInlineToken[] => {
  const tokens: ArticleInlineToken[] = []
  let cursor = 0

  for (const match of value.matchAll(INLINE_MARKUP_PATTERN)) {
    const index = match.index ?? 0

    if (index > cursor) {
      tokens.push({ type: 'text', value: value.slice(cursor, index) })
    }

    const [fullMatch, , linkLabel, href, strongText, emphasisText] = match

    if (linkLabel && href && isSafeHref(href)) {
      tokens.push({ href, type: 'link', value: linkLabel })
    } else if (strongText || emphasisText) {
      const emphasisValue = strongText ?? emphasisText ?? ''

      tokens.push({
        tokens: parseArticleInlineContent(emphasisValue),
        type: 'emphasis',
        value: emphasisValue
      })
    } else {
      tokens.push({ type: 'text', value: fullMatch })
    }

    cursor = index + fullMatch.length
  }

  if (cursor < value.length) {
    tokens.push({ type: 'text', value: value.slice(cursor) })
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', value }]
}

/**
 * Parses headings, paragraphs, ordered/unordered lists, emphasis, and safe links
 * without injecting raw HTML from repository-managed content.
 */
export const parseArticleBody = (body: string): ArticleRichTextBlock[] => {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  const blocks: ArticleRichTextBlock[] = []
  let lineIndex = 0

  while (lineIndex < lines.length) {
    const line = lines[lineIndex]?.trim() ?? ''

    if (!line) {
      lineIndex += 1
      continue
    }

    if (line === CALLOUT_START) {
      const calloutLines: string[] = []
      lineIndex += 1

      while (lineIndex < lines.length) {
        const candidate = (lines[lineIndex] ?? '').trim()
        lineIndex += 1

        if (candidate === CALLOUT_END) {
          break
        }

        if (candidate) {
          calloutLines.push(candidate)
        }
      }

      const title = calloutLines[0]?.replace(HEADING_PATTERN, '$2') ?? ''
      const body = calloutLines[1] ?? ''
      const actionMatch = calloutLines[2]?.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/)

      if (title && body && actionMatch?.[1] && actionMatch[2] && isSafeHref(actionMatch[2])) {
        blocks.push({
          actionHref: actionMatch[2],
          actionLabel: actionMatch[1],
          body: parseArticleInlineContent(body),
          title: parseArticleInlineContent(title),
          type: 'callout'
        })
      }

      continue
    }

    const image = line.match(IMAGE_PATTERN)
    if (image?.[2] && isSafeHref(image[2])) {
      blocks.push({ alt: image[1] ?? '', src: image[2], type: 'image' })
      lineIndex += 1
      continue
    }

    const heading = line.match(HEADING_PATTERN)
    if (heading) {
      const level = Math.max(2, Math.min(4, heading[1]?.length ?? 2)) as 2 | 3 | 4
      blocks.push({ content: parseArticleInlineContent(heading[2] ?? ''), level, type: 'heading' })
      lineIndex += 1
      continue
    }

    const orderedItem = line.match(ORDERED_ITEM_PATTERN)
    const unorderedItem = line.match(UNORDERED_ITEM_PATTERN)
    if (orderedItem || unorderedItem) {
      const ordered = Boolean(orderedItem)
      const items: ArticleInlineToken[][] = []

      while (lineIndex < lines.length) {
        const candidate = (lines[lineIndex] ?? '').trim()
        const item = ordered ? candidate.match(ORDERED_ITEM_PATTERN) : candidate.match(UNORDERED_ITEM_PATTERN)
        if (!item) {
          break
        }

        items.push(parseArticleInlineContent(item[1] ?? ''))
        lineIndex += 1
      }

      blocks.push({ items, ordered, type: 'list' })
      continue
    }

    const paragraphLines = [line]
    lineIndex += 1

    while (lineIndex < lines.length) {
      const candidate = (lines[lineIndex] ?? '').trim()
      if (!candidate || candidate === CALLOUT_START || IMAGE_PATTERN.test(candidate) || HEADING_PATTERN.test(candidate) || ORDERED_ITEM_PATTERN.test(candidate) || UNORDERED_ITEM_PATTERN.test(candidate)) {
        break
      }

      paragraphLines.push(candidate)
      lineIndex += 1
    }

    blocks.push({ content: parseArticleInlineContent(paragraphLines.join(' ')), type: 'paragraph' })
  }

  return blocks
}
