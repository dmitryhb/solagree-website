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

describe('Approved initial Blog articles', () => {
  it('publishes exactly the approved four entries in date order with one Figma featured article', () => {
    expect(publishedArticles.map(article => article.slug)).toEqual([
      'hidden-risks-naked-mediation',
      'relieving-uneasy-feeling-resolving-divorce',
      'ai-divorce-family-law',
      'four-reasons-not-use-ai-get-divorced'
    ])
    expect(publishedArticles.filter(article => article.featured).map(article => article.slug))
      .toEqual(['four-reasons-not-use-ai-get-divorced'])
    expect(resourceContentEntries.some(article => article.title.includes('healthy divorce support future co-parenting')))
      .toBe(false)
  })

  it('keeps source body structure and original-publication notices in the safe renderer format', () => {
    const figmaArticle = getArticle('four-reasons-not-use-ai-get-divorced')
    const nakedMediation = getArticle('hidden-risks-naked-mediation')
    const aiDivorce = getArticle('ai-divorce-family-law')
    const relievingAnxiety = getArticle('relieving-uneasy-feeling-resolving-divorce')

    expect(figmaArticle.body).toContain('## 1. AI Cannot Read a Room or Understand Emotional Complexity')
    expect(figmaArticle.body).toContain('[Take The Quiz](/quiz)')
    expect(figmaArticle.body).toContain('[The Divorce Magazine](https://www.thedivorcemagazine.co.uk/4-reasons-you-shouldnt-use-ai-to-get-divorced/)')

    expect(nakedMediation.body).toContain('## The Illusion of Safety in “Naked” Mediation')
    expect(nakedMediation.body).toContain('### Phase 3: The Binding Safety Net of Arbitration.')
    expect(nakedMediation.body).toContain('NOTE: The foregoing article is not intended to give legal advice.')
    expect(nakedMediation.body).toContain('[Fresh Starts Registry](https://www.freshstartsregistry.com/blog/the-hidden-risks-of-naked-mediation-and-how-to-guarantee-a-court-free-divorce)')

    expect(aiDivorce.body).toContain('Most of us went to law school to serve the public, protect people’s rights, and make a living while doing so.')
    expect(aiDivorce.body).toContain('[NCLawyersWeekly.com](https://nclawyersweekly.com/2026/05/26/ai-divorce-is-real-but-family-law-can-still-save-itself/)')

    expect(relievingAnxiety.body).toContain('- First, that one person has the power to walk away at any point')
    expect(relievingAnxiety.body).toContain('## A Three-Phased Process to Human-Centric Divorce')
    expect(relievingAnxiety.body).toContain('### Phase 3: Arbitration')
    expect(relievingAnxiety.body).toContain('[SecondSaturday.com](https://www.secondsaturday.com/relieving-that-uneasy-feeling-when-resolving-divorce/)')

    expect(parseArticleBody(relievingAnxiety.body).some(block => block.type === 'list')).toBe(true)
    expect(JSON.stringify(parseArticleBody(nakedMediation.body))).toContain('https://www.freshstartsregistry.com/')
  })

  it('validates all four articles and exposes only their internal URLs to the sitemap', () => {
    expect(() => validateResourceContentEntries(resourceContentEntries)).not.toThrow()
    expect(getArticleSitemapRoutes(publishedArticles).map(route => route.path)).toEqual([
      '/blog/hidden-risks-naked-mediation',
      '/blog/relieving-uneasy-feeling-resolving-divorce',
      '/blog/ai-divorce-family-law',
      '/blog/four-reasons-not-use-ai-get-divorced'
    ])
  })

  it('uses the optimized approved Figma hero and neutral fallback metadata for image-less articles', () => {
    const heroPath = resolve(process.cwd(), 'public/images/blog-four-reasons-ai-divorce-hero.webp')
    const hero = readFileSync(heroPath)

    expect(getArticle('four-reasons-not-use-ai-get-divorced').featuredImage)
      .toBe('/images/blog-four-reasons-ai-divorce-hero.webp')
    expect(statSync(heroPath).size).toBe(109548)
    expect(createHash('sha256').update(hero).digest('hex'))
      .toBe('c67f91d662670883371d8c8f5b16269462da14433c0e242f8c2d2ea86ef12379')

    expect(publishedArticles.filter(article => article.slug !== 'four-reasons-not-use-ai-get-divorced')
      .every(article => !article.featuredImage && article.social.image === '/images/splash-bg.webp'))
      .toBe(true)
  })
})
