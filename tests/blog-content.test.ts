import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import { describe, expect, it } from 'vitest'
import BlogMedia from '../app/components/blog/BlogMedia.vue'
import { parseArticleBody } from '../app/utils/article-content'
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
    const blocks = parseArticleBody(`${blogArticleFixtures[0].body}\n\n[unsafe](javascript:alert(1)) <script>alert(1)</script>`)

    expect(blocks.map(block => block.type)).toEqual(['heading', 'paragraph', 'list', 'list', 'paragraph'])
    expect(blocks[1]).toMatchObject({
      content: expect.arrayContaining([
        { type: 'emphasis', value: 'structured guidance' },
        { href: 'https://example.com/resources', type: 'link', value: 'independent resources' }
      ])
    })
    expect(JSON.stringify(blocks)).not.toContain('"href":"javascript:')
    expect(JSON.stringify(blocks)).toContain('<script>alert(1)</script>')
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
})
