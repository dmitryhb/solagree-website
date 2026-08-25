import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import { describe, expect, it } from 'vitest'
import BlogMedia from '../app/components/blog/BlogMedia.vue'
import ArticleRichText from '../app/components/blog/ArticleRichText.vue'
import { parseArticleBody, parseArticleInlineContent } from '../app/utils/article-content'
import { buildArticleStructuredData, getArticlePath } from '../app/utils/article-seo'
import { getArticleSitemapRoutes } from '../app/data/sitemap-routes'
import {
  getPublishedArticleBySlug,
  getPublishedArticles,
  validateResourceContentEntries
} from '../shared/resource-content-validation'
import { blogArticleFixtures } from './fixtures/blog-articles'

Object.assign(globalThis, { computed })

describe('Blog content foundation', () => {
  it('orders published articles by date and returns no article for draft or invalid direct slugs', () => {
    expect(getPublishedArticles(blogArticleFixtures).map(article => article.slug))
      .toEqual(['clearer-next-step', 'previous-article'])
    expect(getPublishedArticleBySlug(blogArticleFixtures, 'clearer-next-step')?.title)
      .toBe('A clearer next step')
    expect(getPublishedArticleBySlug(blogArticleFixtures, 'draft-article')).toBeUndefined()
    expect(getPublishedArticleBySlug(blogArticleFixtures, 'missing-article')).toBeUndefined()
  })

  it('parses rich content safely without injecting unsafe links or raw HTML', () => {
    const blocks = parseArticleBody(`${blogArticleFixtures[0].body}\n\n*This content originally appeared at [Source](https://example.com/source).*\n\n[unsafe](javascript:alert(1)) [protocol-relative](//example.com) [data-uri](data:text/html,hi) <script>alert(1)</script>`)

    expect(blocks.map(block => block.type)).toEqual(['heading', 'paragraph', 'list', 'list', 'paragraph', 'paragraph'])
    const firstParagraph = blocks[1]

    if (!firstParagraph || firstParagraph.type !== 'paragraph') {
      throw new Error('Expected the first article body block to be a paragraph.')
    }

    expect(firstParagraph.content).toEqual(expect.arrayContaining([
      { type: 'emphasis', value: 'structured guidance', tokens: [{ type: 'text', value: 'structured guidance' }] },
      { href: 'https://example.com/resources', type: 'link', value: 'independent resources' }
    ]))
    expect(JSON.stringify(blocks)).not.toContain('"href":"javascript:')
    expect(JSON.stringify(blocks)).not.toContain('"href":"//example.com"')
    expect(JSON.stringify(blocks)).not.toContain('"href":"data:')
    expect(JSON.stringify(blocks)).toContain('<script>alert(1)</script>')
    expect(JSON.stringify(blocks)).toContain('[unsafe](javascript:alert(1))')
    expect(JSON.stringify(blocks)).toContain('[protocol-relative](//example.com)')
    expect(JSON.stringify(blocks)).toContain('[data-uri](data:text/html,hi)')
    expect(blocks[4]).toMatchObject({
      content: [
        {
          tokens: [
            { type: 'text', value: 'This content originally appeared at ' },
            { href: 'https://example.com/source', type: 'link', value: 'Source' },
            { type: 'text', value: '.' }
          ],
          type: 'emphasis',
          value: 'This content originally appeared at [Source](https://example.com/source).'
        }
      ]
    })
  })

  it('parses repository-managed inline images and CTA callouts', () => {
    const blocks = parseArticleBody(`![A reassuring family moment](/images/family.webp)

:::callout
## Is Solagree Right For You?
Take our quick quiz to see whether the process fits your situation.
[Take The Quiz](/quiz)
:::`)

    expect(blocks).toEqual([
      {
        alt: 'A reassuring family moment',
        src: '/images/family.webp',
        type: 'image'
      },
      {
        actionHref: '/quiz',
        actionLabel: 'Take The Quiz',
        body: [{ type: 'text', value: 'Take our quick quiz to see whether the process fits your situation.' }],
        title: [{ type: 'text', value: 'Is Solagree Right For You?' }],
        type: 'callout',
        variant: 'note'
      }
    ])
  })

  it('keeps :::callout constructs visible when the CTA link is missing or unsafe', () => {
    const blocks = parseArticleBody([
      ':::callout',
      '## Title without body',
      ':::',
      '',
      ':::callout',
      '## Unsafe action',
      'Body stays visible.',
      '[XSS](javascript:alert(1))',
      ':::'
    ].join('\n'))

    expect(blocks[0]).toEqual({
      content: [{ type: 'text', value: '## Title without body' }],
      type: 'paragraph'
    })

    const unsafeCallout = blocks[1]

    if (!unsafeCallout || unsafeCallout.type !== 'callout') {
      throw new Error('Expected the unsafe CTA to degrade to a visible callout without an action.')
    }

    expect(unsafeCallout.actionHref).toBeUndefined()
    expect(unsafeCallout.actionLabel).toBeUndefined()
    expect(JSON.stringify(unsafeCallout)).toContain('[XSS](javascript:alert(1))')
  })

  it('keeps safe link destinations with balanced parentheses complete', () => {
    const tokens = parseArticleInlineContent('Read [Divorce (law)](https://en.wikipedia.org/wiki/Divorce_(law)) and [nested parens](https://example.com/wiki/A_(b_(c))).')

    expect(tokens).toEqual([
      { type: 'text', value: 'Read ' },
      { href: 'https://en.wikipedia.org/wiki/Divorce_(law)', type: 'link', value: 'Divorce (law)' },
      { type: 'text', value: ' and ' },
      { href: 'https://example.com/wiki/A_(b_(c))', type: 'link', value: 'nested parens' },
      { type: 'text', value: '.' }
    ])
  })

  it('renders supported callouts and images as typed blocks with safe inline content', () => {
    const blocks = parseArticleBody([
      'Intro paragraph.',
      '',
      '![Editorial chart](/images/blog-chart.webp)',
      '',
      '> [!NOTE] Flat-fee guarantee',
      '> Sessions follow a [published fee schedule](https://example.com/fees_(2026)).',
      '> Second body line.',
      '',
      'Closing paragraph.'
    ].join('\n'))

    expect(blocks.map(block => block.type)).toEqual(['paragraph', 'image', 'callout', 'paragraph'])
    expect(blocks[1]).toEqual({ alt: 'Editorial chart', src: '/images/blog-chart.webp', type: 'image' })

    const callout = blocks[2]

    if (!callout || callout.type !== 'callout') {
      throw new Error('Expected the third article body block to be a callout.')
    }

    expect(callout.title).toEqual([{ type: 'text', value: 'Flat-fee guarantee' }])
    expect(callout.variant).toBe('note')
    expect(callout.actionHref).toBeUndefined()
    expect(callout.actionLabel).toBeUndefined()
    expect(callout.body).toEqual([
      { type: 'text', value: 'Sessions follow a ' },
      { href: 'https://example.com/fees_(2026)', type: 'link', value: 'published fee schedule' },
      { type: 'text', value: '. Second body line.' }
    ])
  })

  it('keeps malformed callout and image constructs visible instead of discarding them', () => {
    const blocks = parseArticleBody([
      '![Broken image](/images/missing.webp',
      '',
      '![Unsafe image](javascript:alert(1))',
      '',
      '![Protocol relative image](//cdn.example.com/tracker.png)',
      '',
      '> [!UNKNOWN] unsupported variant',
      '> callout body that must stay visible',
      '',
      'Regular paragraph after.'
    ].join('\n'))

    expect(blocks.map(block => block.type)).toEqual(['paragraph', 'paragraph', 'paragraph', 'paragraph', 'paragraph'])
    expect(blocks.some(block => block.type === 'image' || block.type === 'callout')).toBe(false)

    const rendered = JSON.stringify(blocks)

    expect(rendered).toContain('![Broken image](/images/missing.webp')
    expect(rendered).toContain('![Unsafe image](javascript:alert(1))')
    expect(rendered).toContain('![Protocol relative image](//cdn.example.com/tracker.png)')
    expect(rendered).toContain('> [!UNKNOWN] unsupported variant')
    expect(rendered).toContain('callout body that must stay visible')
    expect(rendered).not.toContain('"src"')
  })

  it('uses only published internal article paths in sitemap records and Article schema', () => {
    const publishedArticles = getPublishedArticles(blogArticleFixtures)
    const currentArticle = publishedArticles[0]

    if (!currentArticle) {
      throw new Error('Blog fixture must include a published article.')
    }

    expect(getArticleSitemapRoutes(publishedArticles)).toEqual([
      { changefreq: 'monthly', path: '/blog/clearer-next-step', priority: 0.6 },
      { changefreq: 'monthly', path: '/blog/previous-article', priority: 0.6 }
    ])
    expect(buildArticleStructuredData(currentArticle, 'https://www.solagree.com')).toMatchObject({
      '@type': 'Article',
      datePublished: '2026-08-21',
      headline: 'A clearer next step',
      mainEntityOfPage: 'https://www.solagree.com/blog/clearer-next-step'
    })
    expect(getArticlePath(currentArticle)).toBe('/blog/clearer-next-step')
  })

  it('emits Article dateModified from updatedAt and reuses the Solagree organization as publisher', () => {
    const revisedArticle = {
      ...blogArticleFixtures[0],
      updatedAt: '2026-08-25'
    }

    expect(buildArticleStructuredData(revisedArticle, 'https://www.solagree.com')).toMatchObject({
      dateModified: '2026-08-25',
      datePublished: '2026-08-21',
      publisher: {
        '@type': 'Organization',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.solagree.com/solagree-logo.svg'
        },
        name: 'Solagree'
      }
    })
  })

  it('omits Article dateModified when no updatedAt exists instead of duplicating datePublished', () => {
    const unrevisedArticle = blogArticleFixtures[1]

    if (!unrevisedArticle) {
      throw new Error('Blog fixture must include an unrevised article.')
    }

    const structuredData = buildArticleStructuredData(unrevisedArticle, 'https://www.solagree.com')

    expect(structuredData.dateModified).toBeUndefined()
    expect('dateModified' in structuredData).toBe(false)
    expect(structuredData.datePublished).toBe('2026-07-10')
  })

  it('renders the intentional visual fallback when a card has no featured image', () => {
    const articleWithoutImage = {
      ...blogArticleFixtures[1],
      featuredImage: undefined
    }

    expect(() => validateResourceContentEntries([articleWithoutImage])).not.toThrow()

    const wrapper = mount(BlogMedia, {
      props: {
        alt: 'Previous article',
        src: ''
      }
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.get('.blog-media__fallback').text()).toBe('Solagree')
  })

  it('renders callouts and images as typed blocks while degraded constructs stay visible', () => {
    const wrapper = mount(ArticleRichText, {
      props: {
        body: [
          '![Editorial chart](/images/blog-chart.webp)',
          '',
          '> [!WARNING] Court filings are public',
          '> Read the [fee schedule](https://example.com/fees_(2026)) first.',
          '',
          '![Unsafe image](javascript:alert(1))',
          '',
          '> [!UNKNOWN] unsupported variant stays visible'
        ].join('\n')
      }
    })

    const image = wrapper.get('.article-rich-text__image img')

    expect(image.attributes('src')).toBe('/images/blog-chart.webp')
    expect(image.attributes('alt')).toBe('Editorial chart')

    const callout = wrapper.get('.article-rich-text__note[data-variant="warning"]')

    expect(callout.get('.article-rich-text__note-title').text()).toBe('Court filings are public')
    expect(callout.get('a').attributes('href')).toBe('https://example.com/fees_(2026)')

    const paragraphs = wrapper.findAll('.article-rich-text > p')

    expect(paragraphs.map(paragraph => paragraph.text())).toEqual([
      '![Unsafe image](javascript:alert(1))',
      '> [!UNKNOWN] unsupported variant stays visible'
    ])
    expect(wrapper.get('.article-rich-text__note-content').text()).toBe('Read the fee schedule first.')
    expect(wrapper.find('img[src^="javascript:"]').exists()).toBe(false)
    expect(wrapper.findAll('img')).toHaveLength(1)
  })
})
