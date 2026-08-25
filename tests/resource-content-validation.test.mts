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

/** Asserts the fail-closed validator accepts the provided publication. */
const assertNoValidationError = (runValidation: () => void): void => {
  assert.doesNotThrow(runValidation)
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

test('content validation rejects non-HTTPS news destinations', () => {
  const insecureNews = {
    ...draftNews,
    externalUrl: 'http://example.com/news'
  } as ResourceContentEntry

  assert.throws(
    () => validateResourceContentEntries([insecureNews]),
    /invalid externalUrl/
  )
})

const relatedArticle: ResourceContentEntry = {
  ...article,
  featured: false,
  publishedAt: '2026-08-19',
  slug: 'related-article'
}

test('content validation accepts updatedAt on or after publishedAt', () => {
  const revisedSameDay = { ...article, updatedAt: '2026-08-21' } as ResourceContentEntry
  const revisedLater = { ...article, updatedAt: '2026-08-25' } as ResourceContentEntry

  assertNoValidationError(() => validateResourceContentEntries([revisedSameDay]))
  assertNoValidationError(() => validateResourceContentEntries([revisedLater]))
})

test('content validation rejects updatedAt earlier than publishedAt with a slug-specific message', () => {
  const staleArticle = {
    ...article,
    publishedAt: '2026-05-15',
    updatedAt: '2026-03-17'
  } as ResourceContentEntry

  assert.throws(
    () => validateResourceContentEntries([staleArticle]),
    /"article-slug" has updatedAt date "2026-03-17" before publishedAt date "2026-05-15"/
  )
})

test('content validation rejects malformed updatedAt values', () => {
  const impossibleCalendarDate = { ...article, updatedAt: '2026-02-30' } as ResourceContentEntry
  const nonIsoDate = { ...article, updatedAt: '2026-8-1' } as ResourceContentEntry
  const dateTimeInsteadOfDate = { ...article, updatedAt: '2026-08-21T10:00:00.000Z' } as ResourceContentEntry

  for (const entry of [impossibleCalendarDate, nonIsoDate, dateTimeInsteadOfDate]) {
    assert.throws(
      () => validateResourceContentEntries([entry]),
      /has invalid updatedAt date/
    )
  }
})

test('content validation accepts resolved, deduplicated, non-self related articles', () => {
  const entry = {
    ...article,
    relatedArticleSlugs: ['related-article']
  } as ResourceContentEntry

  assertNoValidationError(() => validateResourceContentEntries([entry, relatedArticle]))
})

test('content validation rejects relatedArticleSlugs that do not resolve to published internal articles', () => {
  const missingTarget = { ...article, relatedArticleSlugs: ['missing-article'] } as ResourceContentEntry
  const draftTarget = { ...article, relatedArticleSlugs: ['draft-article'] } as ResourceContentEntry
  const newsTarget = { ...article, relatedArticleSlugs: ['news-slug'] } as ResourceContentEntry
  const emptySlug = { ...article, relatedArticleSlugs: ['   '] } as ResourceContentEntry

  const cases = [
    [missingTarget, [article]],
    [draftTarget, [article, { ...relatedArticle, slug: 'draft-article', status: 'draft' } as ResourceContentEntry]],
    [newsTarget, [article, draftNews]],
    [emptySlug, [article]]
  ] as const

  for (const [entry, entries] of cases) {
    assert.throws(
      () => validateResourceContentEntries([entry, ...entries.filter(candidate => candidate.slug !== entry.slug)]),
      /not a published internal article|empty relatedArticleSlugs/
    )
  }
})

test('content validation rejects self-relations and duplicate relatedArticleSlugs entries', () => {
  const selfRelation = { ...article, relatedArticleSlugs: ['article-slug'] } as ResourceContentEntry

  assert.throws(
    () => validateResourceContentEntries([selfRelation, relatedArticle]),
    /"article-slug" cannot relate to itself/
  )

  const duplicatedRelation = {
    ...article,
    relatedArticleSlugs: ['related-article', 'related-article']
  } as ResourceContentEntry

  assert.throws(
    () => validateResourceContentEntries([duplicatedRelation, relatedArticle]),
    /lists related slug "related-article" more than once/
  )
})

test('content validation rejects multiple published featured entries', () => {
  const secondFeatured = {
    ...relatedArticle,
    featured: true
  } as ResourceContentEntry
  const featuredArticle = { ...article, featured: true } as ResourceContentEntry

  assert.throws(
    () => validateResourceContentEntries([featuredArticle, secondFeatured]),
    /Multiple published resource entries are marked featured \("article-slug", "related-article"\)/
  )
})

test('content validation allows one published featured entry alongside draft featured entries', () => {
  const draftFeatured = {
    ...relatedArticle,
    featured: true,
    status: 'draft'
  } as ResourceContentEntry
  const featuredArticle = { ...article, featured: true } as ResourceContentEntry

  assertNoValidationError(() => validateResourceContentEntries([featuredArticle, draftFeatured]))
})

test('content validation rejects image paths outside the public /images/ convention', () => {
  const invalidPaths = [
    'images/article.webp',
    '../secret/article.webp',
    '/images/../secret/article.webp',
    '/images/article name.webp',
    '//cdn.example.com/article.webp',
    'https://cdn.example.com/article.webp',
    '/img/article.webp'
  ]

  for (const invalidPath of invalidPaths) {
    assert.throws(
      () => validateResourceContentEntries([{ ...article, featuredImage: invalidPath } as ResourceContentEntry]),
      /featuredImage ".+" outside the supported public \/images\/ path convention/,
      `expected ${invalidPath} to be rejected`
    )
  }

  assert.throws(
    () => validateResourceContentEntries([{
      ...article,
      social: { ...article.social, image: 'https://cdn.example.com/social.webp' }
    } as ResourceContentEntry]),
    /social\.image "https:\/\/cdn\.example\.com\/social\.webp" outside the supported public \/images\/ path convention/
  )

  assertNoValidationError(() => validateResourceContentEntries([
    { ...article, featuredImage: '/images/blog-hero.webp' } as ResourceContentEntry
  ]))
})
