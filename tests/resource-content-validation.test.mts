import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getPublishedArticles,
  getPublishedNewsItems,
  validateResourceContentEntries
} from '../shared/resource-content-validation.ts'
import type { ResourceContentEntry } from '../shared/types/resource-content'

const article: ResourceContentEntry = {
  author: 'Solagree',
  body: 'A complete article body.',
  featuredImage: '/images/article.jpg',
  kind: 'article',
  linkMode: 'internal',
  publishedAt: '2026-08-21',
  seo: {
    description: 'Article SEO description.',
    title: 'Article SEO title'
  },
  slug: 'article-slug',
  social: {
    description: 'Article social description.',
    image: '/images/article-social.jpg',
    title: 'Article social title'
  },
  status: 'published',
  summary: 'Article summary.',
  title: 'Article title'
}

const draftNews: ResourceContentEntry = {
  author: 'External publisher',
  externalUrl: 'https://example.com/news',
  featuredImage: '/images/news.jpg',
  kind: 'news',
  linkMode: 'external',
  publishedAt: '2026-08-20',
  seo: {
    description: 'News SEO description.',
    title: 'News SEO title'
  },
  slug: 'news-slug',
  social: {
    description: 'News social description.',
    image: '/images/news-social.jpg',
    title: 'News social title'
  },
  status: 'draft',
  summary: 'News summary.',
  title: 'News title'
}

test('published resource lists exclude draft articles and news', () => {
  const entries = [article, draftNews]

  assert.deepEqual(getPublishedArticles(entries), [article])
  assert.deepEqual(getPublishedNewsItems(entries), [])
})

test('content validation rejects duplicate slugs, invalid dates, and required metadata gaps', () => {
  const invalidArticle = {
    ...article,
    publishedAt: '2026-02-29',
    seo: {
      ...article.seo,
      description: ''
    },
    slug: article.slug
  } as ResourceContentEntry

  assert.throws(
    () => validateResourceContentEntries([article, invalidArticle]),
    /duplicated|invalid publishedAt|missing seo\.description/
  )
})
