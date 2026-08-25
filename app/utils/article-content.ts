import type {
  ArticleCalloutVariant,
  ArticleInlineToken,
  ArticleRichTextBlock
} from '~/types/article-rich-text'

/**
 * Safe renderer for the documented repository rich-text grammar.
 * The supported syntax and its degradation rules are documented in
 * docs/article-rich-text.md; malformed constructs degrade to visible
 * text instead of being discarded.
 */

const HEADING_PATTERN = /^(#{1,4})\s+(.+)$/
const ORDERED_ITEM_PATTERN = /^\d+\.\s+(.+)$/
const UNORDERED_ITEM_PATTERN = /^[-*]\s+(.+)$/
const CALLOUT_MARKER_PATTERN = /^>\s*\[!([A-Za-z]+)\]\s*(.*)$/
const IMAGE_LINE_PATTERN = /^!\[([^\]]*)\]\((.+)\)$/

const CALLOUT_VARIANTS: readonly ArticleCalloutVariant[] = ['note', 'tip', 'important', 'warning', 'caution']

const isCalloutVariant = (value: string): value is ArticleCalloutVariant =>
  CALLOUT_VARIANTS.includes(value as ArticleCalloutVariant)

const stripCalloutQuote = (line: string): string => line.replace(/^>\s?/, '')

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

/** Repository images render from site-relative paths or absolute http(s) URLs; every other scheme stays text. */
const isSafeImageSrc = (src: string): boolean => {
  if (src.startsWith('/') && !src.startsWith('//')) {
    return true
  }

  try {
    const url = new URL(src)

    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Reads a link destination beginning after "(", ending at its balanced closing
 * parenthesis, so URLs containing balanced parentheses (including nested pairs
 * such as https://en.wikipedia.org/wiki/Divorce_(law)) keep their full destination.
 */
const readBalancedHref = (value: string, start: number): { end: number, href: string } | undefined => {
  let depth = 1

  for (let index = start; index < value.length; index += 1) {
    const character = value[index] ?? ''

    if (character === '(') {
      depth += 1
      continue
    }

    if (character === ')') {
      depth -= 1

      if (depth === 0) {
        const href = value.slice(start, index)

        return href.length > 0 && !/\s/.test(href) ? { end: index + 1, href } : undefined
      }

      continue
    }

    if (/\s/.test(character)) {
      return undefined
    }
  }

  return undefined
}

const readInlineLink = (value: string, start: number): { end: number, href: string, label: string } | undefined => {
  const labelEnd = value.indexOf(']', start + 1)

  if (labelEnd === -1 || value[labelEnd + 1] !== '(') {
    return undefined
  }

  const destination = readBalancedHref(value, labelEnd + 2)
  if (!destination) {
    return undefined
  }

  const label = value.slice(start + 1, labelEnd)

  return label.length > 0 ? { end: destination.end, href: destination.href, label } : undefined
}

const readEmphasis = (value: string, start: number): { end: number, text: string } | undefined => {
  const marker = value.startsWith('**', start) ? '**' : '*'
  const contentStart = start + marker.length
  const contentEnd = value.indexOf(marker, contentStart)

  if (contentEnd <= contentStart) {
    return undefined
  }

  const text = value.slice(contentStart, contentEnd)

  return text.includes('*') ? undefined : { end: contentEnd + marker.length, text }
}

/** Appends visible text, merging with a preceding text token so degraded constructs stay contiguous. */
const appendTextToken = (tokens: ArticleInlineToken[], value: string): void => {
  const lastToken = tokens[tokens.length - 1]

  if (lastToken?.type === 'text') {
    lastToken.value += value
    return
  }

  tokens.push({ type: 'text', value })
}

/** Converts the small, documented Markdown subset into safe inline render tokens. */
export const parseArticleInlineContent = (value: string): ArticleInlineToken[] => {
  const tokens: ArticleInlineToken[] = []
  let cursor = 0
  let index = 0

  while (index < value.length) {
    const character = value[index] ?? ''
    let consumed = 0

    if (character === '[') {
      const link = readInlineLink(value, index)

      if (link) {
        if (index > cursor) {
          appendTextToken(tokens, value.slice(cursor, index))
        }

        if (isSafeHref(link.href)) {
          tokens.push({ href: link.href, type: 'link', value: link.label })
        } else {
          appendTextToken(tokens, value.slice(index, link.end))
        }

        cursor = link.end
        consumed = link.end - index
      }
    }

    if (consumed === 0 && character === '*') {
      const emphasis = readEmphasis(value, index)

      if (emphasis) {
        if (index > cursor) {
          appendTextToken(tokens, value.slice(cursor, index))
        }

        tokens.push({
          tokens: parseArticleInlineContent(emphasis.text),
          type: 'emphasis',
          value: emphasis.text
        })

        cursor = emphasis.end
        consumed = emphasis.end - index
      }
    }

    index += consumed > 0 ? consumed : 1
  }

  if (cursor < value.length) {
    appendTextToken(tokens, value.slice(cursor))
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', value }]
}

/**
 * Parses headings, paragraphs, ordered/unordered lists, callouts, images, emphasis,
 * and safe links without injecting raw HTML from repository-managed content.
 * Malformed callout or image syntax degrades to visible paragraph text.
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

    const heading = line.match(HEADING_PATTERN)
    if (heading) {
      const level = Math.max(2, Math.min(4, heading[1]?.length ?? 2)) as 2 | 3 | 4
      blocks.push({ content: parseArticleInlineContent(heading[2] ?? ''), level, type: 'heading' })
      lineIndex += 1
      continue
    }

    const calloutMarker = line.match(CALLOUT_MARKER_PATTERN)
    if (calloutMarker) {
      const variant = (calloutMarker[1] ?? '').toLowerCase()
      const title = (calloutMarker[2] ?? '').trim()
      const rawLines = [line]

      lineIndex += 1

      while (lineIndex < lines.length) {
        const candidate = (lines[lineIndex] ?? '').trim()

        if (!candidate.startsWith('>')) {
          break
        }

        rawLines.push(candidate)
        lineIndex += 1
      }

      if (isCalloutVariant(variant)) {
        blocks.push({
          content: parseArticleInlineContent(rawLines.slice(1).map(stripCalloutQuote).join(' ')),
          ...(title ? { title } : {}),
          type: 'callout',
          variant
        })
      } else {
        blocks.push({ content: parseArticleInlineContent(rawLines.join(' ')), type: 'paragraph' })
      }

      continue
    }

    const image = line.match(IMAGE_LINE_PATTERN)
    if (image) {
      const alt = image[1] ?? ''
      const src = (image[2] ?? '').trim()

      if (src.length > 0 && !/\s/.test(src) && isSafeImageSrc(src)) {
        blocks.push({ alt, src, type: 'image' })
      } else {
        blocks.push({ content: parseArticleInlineContent(line), type: 'paragraph' })
      }

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

      if (
        !candidate
        || HEADING_PATTERN.test(candidate)
        || ORDERED_ITEM_PATTERN.test(candidate)
        || UNORDERED_ITEM_PATTERN.test(candidate)
        || CALLOUT_MARKER_PATTERN.test(candidate)
        || IMAGE_LINE_PATTERN.test(candidate)
      ) {
        break
      }

      paragraphLines.push(candidate)
      lineIndex += 1
    }

    blocks.push({ content: parseArticleInlineContent(paragraphLines.join(' ')), type: 'paragraph' })
  }

  return blocks
}
