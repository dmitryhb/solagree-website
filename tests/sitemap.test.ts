import { describe, expect, it } from 'vitest'
import { legalNavItems } from '../app/data/legal-pages'
import { publishedNewsItems, resourceContentEntries } from '../app/data/resource-content'
import { getArticleSitemapRoutes, sitemapRoutes } from '../app/data/sitemap-routes'
import { normalizeSiteUrl, renderSitemapXml } from '../app/utils/sitemap-xml'
import { getPublishedArticles } from '../shared/resource-content-validation'

const SITE_URL = 'https://www.solagree.com'

const NON_INDEXABLE_PATH_PATTERNS: Array<readonly [string, RegExp]> = [
  ['co-branded dynamic routes', /^\/(go|cdfa\/go|c|co-branded|cdfa\/co-branded)\//],
  ['embed hosts', /\/embed$/],
  ['internal review tooling', /^\/review(\/|$)/],
  ['admin intake', /^\/admin(\/|$)/],
  ['unlisted partner tools', /^\/partner-tools(\/|$)/],
  ['consult booking flows', /^\/book-(a-solagree|an-attorney)-consult(\/|$)/],
  ['meeting short links', /^\/meet(\/|$)/],
  ['external news details', /^\/news\//]
]

const getSitemapLocs = (xml: string): string[] => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1] || '')

describe('Sitemap document rendering', () => {
  it('renders a complete XML urlset document for every route exactly once', () => {
    const xml = renderSitemapXml(sitemapRoutes, SITE_URL)
    const locs = getSitemapLocs(xml)

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true)

    expect(locs).toHaveLength(sitemapRoutes.length)
    expect(new Set(locs).size).toBe(sitemapRoutes.length)

    const expectedLocs = sitemapRoutes.map(route => `${SITE_URL}${route.path === '/' ? '' : route.path}`)
    expect(locs).toEqual(expectedLocs)
    expect(locs).toContain(SITE_URL)
    expect(locs).toContain(`${SITE_URL}/blog`)
    expect(locs).toContain(`${SITE_URL}/news`)
  })

  it('uses the runtime site origin and never leaks a trailing slash or a foreign origin', () => {
    expect(renderSitemapXml([{ changefreq: 'weekly', path: '/', priority: 1 }], `${SITE_URL}/`))
      .toBe([
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        `    <loc>${SITE_URL}</loc>`,
        '    <changefreq>weekly</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>',
        '</urlset>'
      ].join('\n'))

    expect(normalizeSiteUrl(undefined)).toBe(SITE_URL)
    expect(normalizeSiteUrl('https://staging.example.com///')).toBe('https://staging.example.com')

    const stagingLocs = getSitemapLocs(renderSitemapXml(sitemapRoutes, 'https://solagree.qamachine.com'))
    expect(stagingLocs.map(loc => new URL(loc).origin)).toEqual(
      stagingLocs.map(() => 'https://solagree.qamachine.com')
    )
  })

  it('escapes XML-special characters in location values', () => {
    const xml = renderSitemapXml(
      [{ changefreq: 'monthly', path: `/blog/a&b<c>"d'e`, priority: 0.5 }],
      SITE_URL
    )

    expect(xml).toContain(`<loc>${SITE_URL}/blog/a&amp;b&lt;c&gt;&quot;d&apos;e</loc>`)
    expect(getSitemapLocs(xml)).toHaveLength(1)
  })
})

describe('Sitemap route list', () => {
  it('lists the public static, legal, and published article routes and nothing else', () => {
    const publishedArticlePaths = getArticleSitemapRoutes(getPublishedArticles(resourceContentEntries))
      .map(route => route.path)
    const expectedPaths = [
      '/',
      '/quiz',
      '/webinar',
      '/webinar/cdfa',
      '/webinar/view',
      '/webinar/cdfa/view',
      '/attorneys',
      '/cdfa',
      '/attorney-application',
      '/cdfa-application',
      '/contact',
      '/about-us',
      '/faq',
      '/blog',
      '/news',
      ...legalNavItems.map(item => item.to),
      ...publishedArticlePaths
    ]

    expect(sitemapRoutes.map(route => route.path)).toEqual(expectedPaths)
    expect(legalNavItems.map(item => item.to)).toContain('/legal/terms-of-service')
  })

  it('includes every published internal article exactly once', () => {
    const blogPaths = sitemapRoutes.filter(route => route.path.startsWith('/blog/')).map(route => route.path)
    const publishedSlugs = getPublishedArticles(resourceContentEntries).map(article => article.slug)

    expect(blogPaths).toEqual(publishedSlugs.map(slug => `/blog/${slug}`))
    expect(new Set(blogPaths).size).toBe(blogPaths.length)
  })

  it('excludes drafts, unpublished entries, and external news coverage', () => {
    const renderedPaths = sitemapRoutes.map(route => route.path)
    const publishedSlugs = new Set(getPublishedArticles(resourceContentEntries).map(article => article.slug))
    const articleEntries = resourceContentEntries.filter(entry => entry.kind === 'article')

    expect(articleEntries.every(entry => publishedSlugs.has(entry.slug)
      ? renderedPaths.includes(`/blog/${entry.slug}`)
      : !renderedPaths.includes(`/blog/${entry.slug}`))).toBe(true)

    const externalNewsSlugs = publishedNewsItems.map(item => item.slug)
    const xml = renderSitemapXml(sitemapRoutes, SITE_URL)

    for (const slug of externalNewsSlugs) {
      expect(xml).not.toContain(`/${slug}`)
    }

    expect(renderedPaths).not.toContain('/site-map')
  })

  it('contains no non-indexable dynamic routes', () => {
    const xml = renderSitemapXml(sitemapRoutes, SITE_URL)
    const locs = getSitemapLocs(xml)
    const paths = sitemapRoutes.map(route => route.path)

    for (const [label, pattern] of NON_INDEXABLE_PATH_PATTERNS) {
      expect(paths.filter(path => pattern.test(path)), `unexpected ${label} in sitemap routes`).toEqual([])
      expect(locs.filter(loc => pattern.test(loc.replace(SITE_URL, ''))), `unexpected ${label} in rendered sitemap`).toEqual([])
    }
  })
})
