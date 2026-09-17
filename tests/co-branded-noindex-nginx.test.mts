import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { verifyCoBrandedNoindexNginxConfig } from '../scripts/verify-nginx-co-branded-noindex.mjs'

const readRepoFile = (relativePath: string): string =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8')

test('co-branded noindex nginx snippet passes the textual configuration check', () => {
  assert.deepEqual(verifyCoBrandedNoindexNginxConfig(), [])
})

test('nginx snippet keeps dynamic route families on the static fallback with a noindex header', () => {
  const config = readRepoFile('config/nginx/co-branded-noindex.conf')

  for (const prefix of ['/go/', '/cdfa/go/', '/webinars/']) {
    assert.match(config, new RegExp(`location\\s+\\^~\\s+${prefix}\\s*\\{`), `missing location block for ${prefix}`)
  }

  assert.match(config, /add_header X-Robots-Tag "noindex, nofollow" always;/)
  assert.match(config, /try_files \$uri \$uri\/ \/200\.html;/)
  assert.doesNotMatch(config, /return\s+404/)
})

test('webinar catalogue remains indexable while event detail paths are noindexed', () => {
  const config = readRepoFile('config/nginx/co-branded-noindex.conf')
  assert.match(config, /location\s+=\s+\/webinars\s*\{\s*try_files\s+\/webinars\/index\.html\s+=404;\s*\}/)
  assert.match(config, /location\s+=\s+\/webinars\/\s*\{\s*return\s+301\s+\/webinars;\s*\}/)
  assert.match(config, /location\s+\^~\s+\/webinars\/\s*\{\s*add_header X-Robots-Tag "noindex, nofollow" always;/)
})

test('robots.txt never disallows the dynamic route families', () => {
  const robots = readRepoFile('public/robots.txt')
  const disallowLines = robots
    .split('\n')
    .map(line => line.trim())
    .filter(line => /^disallow:/i.test(line))

  for (const line of disallowLines) {
    assert.equal(
      /\/(go|cdfa\/go|webinars)(\/|$|\?)/.test(line),
      false,
      `robots.txt must not disallow dynamic routes (found "${line}") — crawlers must fetch these URLs to see the noindex signal`
    )
  }
})

test('deployment scripts verify the noindex header after upload', () => {
  const production = readRepoFile('scripts/deploy-production.sh')
  const staging = readRepoFile('scripts/deploy-staging.sh')

  for (const [name, script] of [
    ['scripts/deploy-production.sh', production],
    ['scripts/deploy-staging.sh', staging]
  ] as const) {
    assert.ok(script.includes('X-Robots-Tag'), `${name} must assert the X-Robots-Tag header`)
    assert.ok(script.includes('noindex, nofollow'), `${name} must assert the full noindex, nofollow value`)
    assert.ok(script.includes('/webinars/__webinar-route-check__'), `${name} must probe a webinar detail URL`)
    assert.ok(script.includes('WEBINAR_CATALOG_STATUS'), `${name} must check the indexable webinar catalogue`)
  }

  assert.ok(
    production.includes('co-branded-noindex.conf'),
    'production deploy must install config/nginx/co-branded-noindex.conf'
  )
})

test('deployment documentation states the noindexed soft-404 limitation for dynamic URLs', () => {
  const docs = readRepoFile('docs/production-deployment.md')

  assert.match(docs, /soft-404/i)
  assert.match(docs, /solagree-co-branded-noindex\.conf/)
  assert.match(docs, /X-Robots-Tag/)

  const readme = readRepoFile('README.md')

  assert.match(readme, /noindex/i)
  assert.match(readme, /X-Robots-Tag/)
})
