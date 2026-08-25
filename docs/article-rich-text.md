# Article rich-text grammar

This document defines the rich-text grammar supported for `body` content in
`app/data/resource-content.ts`. The safe renderer in `app/utils/article-content.ts`
(`parseArticleBody` / `parseArticleInlineContent`) implements it; keep this file
and the parser in sync when the grammar changes.

The renderer never injects raw HTML. Anything outside the grammar stays visible
as plain text, and malformed constructs degrade to visible paragraph text rather
than being discarded.

## Blocks

Blocks are separated by blank lines and detected line by line.

### Headings

```
## Heading (level 2)
### Heading (level 3)
#### Heading (level 4)
```

`#` (level 1) and `#####`+ are clamped into this 2–4 range. Heading text supports
inline markup.

### Paragraphs

Consecutive non-blank lines that do not start another block are joined with a
single space into one paragraph.

### Lists

```
- Unordered item
- Another item

1. Ordered item
2. Another item
```

Consecutive list lines of the same kind form one list. List items support inline
markup. Ordered and unordered items cannot be mixed in a single list.

### Images

An image must be the only content on its line:

```
![Descriptive alt text](/images/example.webp)
```

- `src` must be a site-relative path (recommended: the public `/images/...`
  convention, which repository validation enforces for entry metadata) or an
  absolute `http(s)` URL.
- `src` cannot contain whitespace.
- The alt text renders as the accessible alt attribute and as a visible caption.

### Callouts

A callout opens with a marker line and continues over consecutive `>`-prefixed
lines:

```
> [!NOTE] Optional title
> Callout body text with [a link](https://example.com).
> More body text.
```

- Supported variants (case-insensitive): `NOTE`, `TIP`, `IMPORTANT`, `WARNING`,
  `CAUTION`.
- The title is the optional text after the marker on the opening line.
- Callout body supports inline markup.

## Inline markup

| Syntax | Renders as |
| --- | --- |
| `[label](https://example.com)` | Link |
| `[label](/internal/path)` | Link (site-relative, not protocol-relative) |
| `[label](#anchor)` | Link (in-page anchor) |
| `[label](mailto:hi@example.com)` | Link (mailto) |
| `**text**` | Strong emphasis |
| `*text*` | Emphasis |

### Link destinations with parentheses

Link destinations are read until the balanced closing parenthesis, so URLs that
contain balanced parentheses — including nested pairs — are preserved complete:

```
[Divorce (law)](https://en.wikipedia.org/wiki/Divorce_(law))
[Nested](https://example.com/wiki/A_(b_(c)))
```

### Unsafe destinations

`javascript:`, `data:`, and protocol-relative (`//example.com`) destinations are
never rendered as links. The construct stays visible as literal source text and
is not clickable. The same policy applies to image `src` values.

## Degradation rules (nothing disappears silently)

- An image line whose `src` is unsafe or contains whitespace renders as a
  paragraph containing the original line text.
- An image line with broken syntax (for example a missing closing parenthesis)
  renders as an ordinary paragraph.
- A callout with an unsupported variant (for example `> [!UNKNOWN]`) renders the
  entire `>`-quoted run as a paragraph containing the original lines, marker
  included.
- Plain `>`-quoted lines without a callout marker render as ordinary paragraph
  text.
- Unsafe or malformed link syntax renders as literal text.
- An inline `![alt](src)` inside a paragraph text renders as the `!` character
  followed by a plain link; images become standalone blocks only when they occupy
  their own line.

## Related validation

Entry metadata (not body text) is validated by `shared/resource-content-validation.ts`
at module load and by `npm run validate:resource-content`, which runs in
`prebuild` and `pregenerate` so both static generation paths fail closed.
