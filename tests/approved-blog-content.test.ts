import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { publishedArticles, resourceContentEntries } from '../app/data/resource-content'
import { getArticleSitemapRoutes } from '../app/data/sitemap-routes'
import { parseArticleBody } from '../app/utils/article-content'
import { getPublishedArticleBySlug, validateResourceContentEntries } from '../shared/resource-content-validation'

const getArticle = (slug: string) => {
  const article = getPublishedArticleBySlug(resourceContentEntries, slug)

  if (!article) {
    throw new Error(`Expected approved article "${slug}" to be published.`)
  }

  return article
}

describe('Approved Blog articles', () => {
  it('publishes the approved entries in date order with one featured article', () => {
    expect(publishedArticles.map(article => article.slug)).toEqual([
      'healthy-divorce-future-co-parenting',
      'hidden-risks-naked-mediation',
      'relieving-uneasy-feeling-resolving-divorce',
      'ai-divorce-family-law',
      'four-reasons-not-use-ai-get-divorced'
    ])
    expect(publishedArticles.filter(article => article.featured).map(article => article.slug))
      .toEqual(['four-reasons-not-use-ai-get-divorced'])
    expect(getArticle('ai-divorce-family-law').category).toBe('For Professionals')
    expect(publishedArticles.every(article => article.authorImage === '/images/amanda.webp')).toBe(true)
    expect(publishedArticles.every(article => article.authorRole === 'CEO & Founder, SOLAGREE®')).toBe(true)
  })

  it('keeps source body structure and original-publication notices in the safe renderer format', () => {
    const figmaArticle = getArticle('four-reasons-not-use-ai-get-divorced')
    const nakedMediation = getArticle('hidden-risks-naked-mediation')
    const aiDivorce = getArticle('ai-divorce-family-law')
    const relievingAnxiety = getArticle('relieving-uneasy-feeling-resolving-divorce')
    const healthyCoParenting = getArticle('healthy-divorce-future-co-parenting')

    expect(figmaArticle.body).toContain('## 1. AI Cannot Read a Room or Understand Emotional Complexity')
    expect(figmaArticle.body).toContain('[Take The Quiz](/quiz)')
    expect(figmaArticle.body).toContain('/images/blog-four-reasons-ai-divorce-document-review.webp')
    expect(figmaArticle.body).toContain('/images/blog-four-reasons-ai-divorce-family-embrace.webp')
    expect(figmaArticle.body).toContain('[The Divorce Magazine](https://www.thedivorcemagazine.co.uk/4-reasons-you-shouldnt-use-ai-to-get-divorced/)')
    expect(figmaArticle.relatedArticleSlugs).toEqual([
      'ai-divorce-family-law',
      'relieving-uneasy-feeling-resolving-divorce'
    ])
    expect(parseArticleBody(figmaArticle.body).filter(block => block.type === 'image')).toHaveLength(2)
    expect(parseArticleBody(figmaArticle.body).filter(block => block.type === 'callout')).toHaveLength(1)

    expect(nakedMediation.body).toContain('## The Illusion of Safety in “Naked” Mediation')
    expect(nakedMediation.body).toContain('### Phase 3: The Binding Safety Net of Arbitration.')
    expect(nakedMediation.body).toContain('NOTE: The foregoing article is not intended to give legal advice.')
    expect(nakedMediation.body).toContain('[Fresh Starts Registry](https://www.freshstartsregistry.com/blog/the-hidden-risks-of-naked-mediation-and-how-to-guarantee-a-court-free-divorce)')

    expect(aiDivorce.body).toContain('Most of us went to law school to serve the public, protect people’s rights, and make a living while doing so.')
    expect(aiDivorce.body).toContain('[NCLawyersWeekly.com](https://nclawyersweekly.com/2026/05/26/ai-divorce-is-real-but-family-law-can-still-save-itself/)')

    expect(relievingAnxiety.body).toContain('- First, that one person has the power to walk away at any point')
    expect(relievingAnxiety.body).toContain('## A Three-Phased Process to Human-Centric Divorce')
    expect(relievingAnxiety.body).toContain('### Phase 3: Arbitration')
    expect(parseArticleBody(relievingAnxiety.body).filter(block => block.type === 'callout')).toHaveLength(1)
    expect(relievingAnxiety.body).toContain('[SecondSaturday.com](https://www.secondsaturday.com/relieving-that-uneasy-feeling-when-resolving-divorce/)')

    expect(healthyCoParenting.category).toBe('Mindset & Wellness')
    expect(healthyCoParenting.body).toContain('## How court conflict may affect co-parenting')
    expect(healthyCoParenting.body).toContain('## How the SOLAGREE process offers another path')
    expect(healthyCoParenting.body).toContain('## Prepare for a healthier co-parenting future')

    expect(parseArticleBody(relievingAnxiety.body).some(block => block.type === 'list')).toBe(true)
    expect(JSON.stringify(parseArticleBody(nakedMediation.body))).toContain('https://www.freshstartsregistry.com/')
  })

  it('validates every article and exposes only their internal URLs to the sitemap', () => {
    expect(() => validateResourceContentEntries(resourceContentEntries)).not.toThrow()
    expect(getArticleSitemapRoutes(publishedArticles).map(route => route.path)).toEqual([
      '/blog/healthy-divorce-future-co-parenting',
      '/blog/hidden-risks-naked-mediation',
      '/blog/relieving-uneasy-feeling-resolving-divorce',
      '/blog/ai-divorce-family-law',
      '/blog/four-reasons-not-use-ai-get-divorced'
    ])
  })

  it('uses the optimized approved hero and editorial thumbnails for every published article', () => {
    const heroPath = resolve(process.cwd(), 'public/images/blog-four-reasons-ai-divorce-hero.webp')
    const hero = readFileSync(heroPath)

    expect(getArticle('four-reasons-not-use-ai-get-divorced').featuredImage)
      .toBe('/images/blog-four-reasons-ai-divorce-hero.webp')
    expect(statSync(heroPath).size).toBe(106730)
    expect(createHash('sha256').update(hero).digest('hex'))
      .toBe('42c5c0b62325441e192214061dd2a1cf7887940706009644b37f3851cde5ac17')

    expect(statSync(resolve(process.cwd(), 'public/images/blog-four-reasons-ai-divorce-document-review.webp')).size)
      .toBe(97532)
    expect(statSync(resolve(process.cwd(), 'public/images/blog-four-reasons-ai-divorce-family-embrace.webp')).size)
      .toBe(141230)

    expect(publishedArticles.map(article => article.featuredImage)).toEqual([
      '/images/blog-healthy-divorce-future-co-parenting.webp',
      '/images/blog-hidden-risks-naked-mediation.webp',
      '/images/blog-relieving-uneasy-feeling-resolving-divorce.webp',
      '/images/blog-ai-divorce-family-law.webp',
      '/images/blog-four-reasons-ai-divorce-hero.webp'
    ])
    expect(publishedArticles.every(article => article.social.image === article.featuredImage)).toBe(true)
  })
})
