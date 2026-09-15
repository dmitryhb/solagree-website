import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'
import { findLegacyRedirectTarget } from '../app/data/legacy-redirects.ts'

const nginxConfig = readFileSync(resolve(process.cwd(), 'config/nginx/legacy-redirects.conf'), 'utf8')

const exactParityCases = [
  ['/about', '/about-us'],
  ['/accessibility', '/legal/accessibility'],
  ['/author', '/faq'],
  ['/be-a-part-of-the-future-with-us-for-lawyers-mediators-and-cdfa-professionals', '/attorneys'],
  ['/category', '/faq'],
  ['/comments/feed', '/faq'],
  ['/disclaimer', '/legal/terms-of-service'],
  ['/feed', '/faq'],
  ['/frequently-asked-questions', '/faq'],
  ['/privacy-policy', '/legal/privacy-policy'],
  ['/tag', '/faq'],
  ['/terms-of-service', '/legal/terms-of-service'],
  ['/the-solagree-method-vs-traditional-divorce', '/#how-it-works'],
  ['/the-solagree-process', '/#how-it-works'],
  ['/webinars-and-events', '/webinar'],
  ['/wilmington-divorce-family-law-office', '/contact'],
  ['/wilmington-divorce-mediation', '/contact']
] as const

test('keeps client and HTTP redirects aligned for exact legacy paths', () => {
  for (const [legacyPath, destination] of exactParityCases) {
    assert.equal(findLegacyRedirectTarget(legacyPath), destination, legacyPath)
    assert.equal(findLegacyRedirectTarget(`${legacyPath}/`), destination, `${legacyPath}/`)
    assert.match(nginxConfig, new RegExp(`location = ${legacyPath.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')} \\{ return 301 "${destination.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}"; \\}`))
    assert.match(nginxConfig, new RegExp(`location = ${legacyPath.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}/ \\{ return 301 "${destination.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}"; \\}`))
  }
})

test('normalizes contact trailing slash without a canonical URL loop', () => {
  assert.equal(findLegacyRedirectTarget('/contact'), undefined)
  assert.equal(findLegacyRedirectTarget('/contact/'), '/contact')
  assert.match(nginxConfig, /location = \/contact\/ \{ return 301 "\/contact"; \}/)
})

test('redirects category, author, and tag slugs in both layers', () => {
  for (const [prefix, slug] of [['/category/', 'guides'], ['/author/', 'jane-doe'], ['/tag/', 'divorce']]) {
    assert.equal(findLegacyRedirectTarget(`${prefix}${slug}`), '/faq')
    assert.equal(findLegacyRedirectTarget(`${prefix}${slug}/`), '/faq')
    assert.match(nginxConfig, new RegExp(`location \\^~ ${prefix.replace('/', '\\/')} \\{ return 301 "\\/faq"; \\}`))
  }
})

test('retains explicit server-only and regex redirect ownership', () => {
  assert.equal(findLegacyRedirectTarget('/site-map'), undefined)
  assert.equal(findLegacyRedirectTarget('/site-map/'), undefined)
  assert.match(nginxConfig, /location = \/site-map \{ return 301 "\/sitemap\.xml"; \}/)
  assert.match(nginxConfig, /location = \/site-map\/ \{ return 301 "\/sitemap\.xml"; \}/)

  assert.match(nginxConfig, /location ~ \^\/c\/\(\.\*\)\$ \{ return 301 "\/meet\/\$1"; \}/)
  const clientRedirectPage = readFileSync(resolve(process.cwd(), 'app/pages/c/[slug]/index.vue'), 'utf8')
  assert.match(clientRedirectPage, /path: `\/meet\/\$\{encodeURIComponent\(slug\.value\)\}`/)
})

test('does not create redirect loops for canonical destinations', () => {
  for (const destination of new Set(exactParityCases.map(([, destination]) => destination))) {
    const path = destination.split('#', 1)[0] || '/'
    assert.equal(findLegacyRedirectTarget(path), undefined, path)
  }
})
