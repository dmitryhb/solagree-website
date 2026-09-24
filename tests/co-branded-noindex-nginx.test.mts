import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  EXPECTED_X_ROBOTS_TAG_DIRECTIVE,
  NOINDEX_HEADER_VARIABLE,
  verifyCoBrandedNoindexNginxConfig
} from '../scripts/verify-nginx-co-branded-noindex.mjs'

const readRepoFile = (relativePath: string): string =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8')

test('co-branded noindex nginx snippet passes the textual configuration check', () => {
  assert.deepEqual(verifyCoBrandedNoindexNginxConfig(), [])
})

test('nginx snippet keeps dynamic route families on the static fallback with a server-scoped noindex header', () => {
  const config = readRepoFile('config/nginx/co-branded-noindex.conf')

  for (const prefix of ['/go/', '/cdfa/go/', '/webinars/']) {
    assert.match(config, new RegExp(`location\\s+\\^~\\s+${prefix}\\s*\\{`), `missing location block for ${prefix}`)
  }

  assert.match(config, new RegExp(`add_header X-Robots-Tag \\${NOINDEX_HEADER_VARIABLE} always;`))
  assert.ok(
    config.indexOf(EXPECTED_X_ROBOTS_TAG_DIRECTIVE) < config.search(/^\s*location\b/m),
    'X-Robots-Tag must be declared before location matching can restart at /200.html'
  )
  assert.match(config, /if\s*\(\$request_uri\s+~\s+\^\/\(\?:go\|cdfa\/go\)\/\)/)
  assert.match(config, /if\s*\(\$request_uri\s+~\s+\^\/webinars\/\[\^\?\]\)/)
  assert.match(config, /try_files \$uri \$uri\/ \/200\.html;/)
  assert.doesNotMatch(config, /return\s+404/)

  for (const prefix of ['/go/', '/cdfa/go/', '/webinars/']) {
    const block = config.match(new RegExp(`location\\s+\\^~\\s+${prefix}\\s*\\{([\\s\\S]*?)\\}`))?.[1]
    assert.ok(block, `missing body for ${prefix}`)
    assert.doesNotMatch(
      block,
      /add_header\s+X-Robots-Tag/,
      `${prefix} must inherit the server-level header and its other security headers`
    )
  }
})

test('webinar catalogue remains indexable while event detail paths are noindexed', () => {
  const config = readRepoFile('config/nginx/co-branded-noindex.conf')
  assert.match(config, /location\s+=\s+\/webinars\s*\{\s*try_files\s+\/webinars\/index\.html\s+=404;\s*\}/)
  assert.match(config, /location\s+=\s+\/webinars\/\s*\{\s*return\s+301\s+\/webinars;\s*\}/)
  assert.match(config, /if\s*\(\$request_uri\s+~\s+\^\/webinars\/\[\^\?\]\)/)
  assert.doesNotMatch(
    config,
    /if\s*\(\$request_uri\s+~\s+\^\/webinars\/\)\s*\{/,
    '/webinars/ must redirect to the indexable canonical catalogue without noindex'
  )
})

test('noindex matching uses the original request URI through the SPA fallback', () => {
  const config = readRepoFile('config/nginx/co-branded-noindex.conf')

  assert.match(
    config,
    /if\s*\(\$request_uri\s+~\s+\^\/\(\?:go\|cdfa\/go\)\/\)/,
    'co-branded routes, including query-string requests, must be marked from the original request URI'
  )
  assert.match(
    config,
    /if\s*\(\$request_uri\s+~\s+\^\/webinars\/\[\^\?\]\)/,
    'webinar detail routes must require a path segment after /webinars/'
  )
  assert.doesNotMatch(
    config,
    /if\s*\(\$uri\s+~/,
    '$uri becomes /200.html during the fallback and cannot select the noindex header'
  )
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
  assert.match(docs, /\$request_uri/)
  assert.match(docs, /BasicAuth/)

  const webinarDocs = readRepoFile('docs/webinars.md')
  assert.match(webinarDocs, /\$request_uri/)
  assert.match(webinarDocs, /\/webinars\//)

  const readme = readRepoFile('README.md')

  assert.match(readme, /noindex/i)
  assert.match(readme, /X-Robots-Tag/)
})
