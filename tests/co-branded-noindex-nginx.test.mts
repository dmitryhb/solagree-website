import assert from 'node:assert/strict'
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import test from 'node:test'

import {
  DYNAMIC_NOINDEX_LOCATION_PREFIXES,
  EXPECTED_FALLBACK_DIRECTIVE,
  EXPECTED_TRY_FILES_DIRECTIVE,
  EXPECTED_X_ROBOTS_TAG_DIRECTIVE,
  NOINDEX_HEADER_VARIABLE,
  SPA_FALLBACK_LOCATION,
  verifyCoBrandedNoindexNginxConfig
} from '../scripts/verify-nginx-co-branded-noindex.mjs'

const readRepoFile = (relativePath: string): string =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8')

const dockerAvailable = spawnSync('docker', ['info'], { stdio: 'ignore' }).status === 0

const runDocker = (...args: string[]): string =>
  execFileSync('docker', args, { encoding: 'utf8' }).trim()

test('co-branded noindex nginx snippet passes the textual configuration check', () => {
  assert.deepEqual(verifyCoBrandedNoindexNginxConfig(), [])
})

test('nginx snippet keeps dynamic route families on a named static fallback with a server-scoped noindex header', () => {
  const config = readRepoFile('config/nginx/co-branded-noindex.conf')

  for (const prefix of DYNAMIC_NOINDEX_LOCATION_PREFIXES) {
    assert.match(config, new RegExp(`location\\s+\\^~\\s+${prefix}\\s*\\{`), `missing location block for ${prefix}`)
  }

  assert.match(config, new RegExp(`add_header X-Robots-Tag \\${NOINDEX_HEADER_VARIABLE} always;`))
  assert.ok(
    config.indexOf(EXPECTED_X_ROBOTS_TAG_DIRECTIVE) > config.lastIndexOf('location ^~ '),
    'X-Robots-Tag must remain at server scope after the locations define its marker variable'
  )
  assert.ok(config.includes(EXPECTED_TRY_FILES_DIRECTIVE))
  assert.match(
    config,
    new RegExp(`location\\s+${SPA_FALLBACK_LOCATION}\\s*\\{\\s*${EXPECTED_FALLBACK_DIRECTIVE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\}`)
  )
  assert.doesNotMatch(config, /return\s+404/)

  for (const prefix of DYNAMIC_NOINDEX_LOCATION_PREFIXES) {
    const block = config.match(new RegExp(`location\\s+\\^~\\s+${prefix}\\s*\\{([\\s\\S]*?)\\}`))?.[1]
    assert.ok(block, `missing body for ${prefix}`)
    assert.match(
      block,
      /set\s+\$co_branded_noindex_header\s+"noindex, nofollow";/,
      `${prefix} must mark its normalized request before the SPA fallback`
    )
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
  assert.doesNotMatch(
    config,
    /location\s+=\s+\/webinars(?:\/)?\s*\{\s*set\s+\$co_branded_noindex_header/m,
    'the webinar catalogue locations must not set the noindex marker'
  )
})

test('noindex matching uses normalized dynamic locations through the SPA fallback', () => {
  const config = readRepoFile('config/nginx/co-branded-noindex.conf')

  assert.match(config, /Nginx normalizes the request URI before location matching/)
  assert.match(config, /^set\s+\$co_branded_noindex_header\s+"";$/m)
  assert.doesNotMatch(config, /\bif\s*\(/, 'marker initialization must not depend on URI exceptions')
  assert.ok(config.includes(`location ${SPA_FALLBACK_LOCATION}`))
})

test('nginx preserves first-response noindex, auth, security headers, and location precedence for dynamic routes', {
  skip: !dockerAvailable && 'Docker is unavailable for the Nginx runtime regression'
}, async () => {
  const runtimeDir = mkdtempSync(join(tmpdir(), 'solagree-noindex-nginx-'))
  const containerName = `solagree-noindex-nginx-${process.pid}-${Date.now()}`

  try {
    mkdirSync(join(runtimeDir, 'site', 'webinars'), { recursive: true })
    mkdirSync(join(runtimeDir, 'site', 'go'), { recursive: true })
    mkdirSync(join(runtimeDir, 'site', 'meet', 'generated', 'thank-you'), { recursive: true })
    mkdirSync(join(runtimeDir, 'site', 'legal', 'privacy-policy'), { recursive: true })
    cpSync(new URL('../config/nginx/co-branded-noindex.conf', import.meta.url), join(runtimeDir, 'noindex.conf'))
    cpSync(new URL('../config/nginx/legacy-redirects.conf', import.meta.url), join(runtimeDir, 'legacy.conf'))
    writeFileSync(join(runtimeDir, 'site', '200.html'), 'SPA fallback')
    writeFileSync(join(runtimeDir, 'site', 'plain.html'), 'Ordinary static page')
    writeFileSync(join(runtimeDir, 'site', 'go', 'existing.html'), 'Existing dynamic-family static file')
    writeFileSync(join(runtimeDir, 'site', 'webinars', 'index.html'), 'Webinar catalogue')
    writeFileSync(join(runtimeDir, 'site', 'meet', 'generated', 'index.html'), 'Generated intake form')
    writeFileSync(join(runtimeDir, 'site', 'meet', 'generated', 'thank-you', 'index.html'), 'Generated intake thank-you')
    writeFileSync(join(runtimeDir, 'site', 'meet', 'existing.html'), 'Existing intake static file')
    writeFileSync(join(runtimeDir, 'site', 'legal', 'privacy-policy', 'index.html'), 'Privacy policy')
    writeFileSync(join(runtimeDir, 'site', 'sitemap.xml'), '<urlset>fixture sitemap</urlset>')
    writeFileSync(join(runtimeDir, 'users'), 'user:$apr1$hir611$HkWMaK0PkjgCJmQFAYotH/\n')
    writeFileSync(join(runtimeDir, 'nginx.conf'), `error_log /dev/stderr notice;
events {}
http {
  server {
    listen 8080;
    root /usr/share/nginx/html;
    auth_basic "HIR-611";
    auth_basic_user_file /etc/nginx/conf.d/users;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    index index.html;
    include /etc/nginx/conf.d/legacy.conf;
    include /etc/nginx/conf.d/noindex.conf;
    # These regexes would win over ordinary prefixes. The dynamic ^~ and
    # exact catalogue locations must keep their existing precedence.
    location ~ ^/(meet|go|webinars|cdfa/go)/ { return 418; }
    location ~ ^/legal/ { try_files $uri $uri/ =404; }
    location / { try_files $uri $uri/ /200.html; }
  }
}
`)

    runDocker(
      'run', '--rm', '-d', '--name', containerName, '-p', '127.0.0.1::8080',
      '-v', `${join(runtimeDir, 'nginx.conf')}:/etc/nginx/nginx.conf:ro`,
      '-v', `${join(runtimeDir, 'noindex.conf')}:/etc/nginx/conf.d/noindex.conf:ro`,
      '-v', `${join(runtimeDir, 'legacy.conf')}:/etc/nginx/conf.d/legacy.conf:ro`,
      '-v', `${join(runtimeDir, 'users')}:/etc/nginx/conf.d/users:ro`,
      '-v', `${join(runtimeDir, 'site')}:/usr/share/nginx/html:ro`,
      'nginx:1.27-alpine'
    )

    const port = runDocker('port', containerName, '8080/tcp').match(/:(\d+)$/)?.[1]
    assert.ok(port, 'Docker must publish the temporary Nginx listener')

    const baseUrl = `http://127.0.0.1:${port}`
    const authorization = `Basic ${Buffer.from('user:pass').toString('base64')}`
    // Docker publishes the port before nginx necessarily starts listening.
    // Wait only for startup; HTTP contract failures below are never retried.
    const startupDeadline = Date.now() + 5_000
    while (true) {
      try {
        const response = await fetch(`${baseUrl}/plain.html`, { headers: { authorization }, redirect: 'manual' })
        assert.equal(response.status, 200, 'temporary nginx must become ready with the expected auth configuration')
        await response.arrayBuffer()
        break
      } catch (error) {
        if (!(error instanceof TypeError) || Date.now() >= startupDeadline) throw error
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }
    const dynamicPaths = [
      ['/go/partner', 'SPA fallback'],
      ['/go//partner?source=duplicate-slash', 'SPA fallback'],
      ['/go/existing.html', 'Existing dynamic-family static file'],
      ['/cdfa/go/partner', 'SPA fallback'],
      ['/webinars/event-1', 'SPA fallback'],
      ['/%67o/example', 'SPA fallback'],
      ['/cdfa/%67o/example?source=review', 'SPA fallback'],
      ['/web%69nars/example', 'SPA fallback'],
      ['/webinars/%65vent-1?source=encoded', 'SPA fallback'],
      ['/meet/unknown-slug', 'SPA fallback'],
      ['/meet/unknown-slug/?source=trailing-slash', 'SPA fallback'],
      ['/meet/unknown-slug/thank-you', 'SPA fallback'],
      ['/meet/unknown-slug/thank-you/?source=confirmation', 'SPA fallback'],
      ['/m%65et/unknown-slug?source=encoded', 'SPA fallback'],
      ['/meet//unknown-slug/thank-you', 'SPA fallback'],
      ['/meet/existing.html', 'Existing intake static file'],
      // nginx's index module internally redirects these directories to their
      // index.html files. The noindex marker must survive that path too.
      ['/meet/generated/', 'Generated intake form'],
      ['/meet/generated/index.html', 'Generated intake form'],
      ['/meet/generated/thank-you/?source=static', 'Generated intake thank-you']
    ] as const

    for (const [path, expectedBody] of dynamicPaths) {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: { authorization },
        redirect: 'manual'
      })

      assert.equal(response.status, 200, `${path} must return an authenticated HTTP 200`)
      assert.equal(await response.text(), expectedBody, `${path} must serve the expected static response`)
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow', `${path} must be noindexed`)
      assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN', `${path} must retain security headers`)
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff', `${path} must retain security headers`)
    }

    for (const path of ['/meet/generated', '/meet/generated/thank-you']) {
      const response = await fetch(`${baseUrl}${path}`, { headers: { authorization }, redirect: 'manual' })
      assert.equal(response.status, 301, `${path} must preserve nginx's directory trailing-slash redirect`)
      assert.equal(new URL(response.headers.get('location') ?? '', baseUrl).pathname, `${path}/`)
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow', 'even the initial directory redirect must be noindexed')
      assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN')
    }

    const indexablePaths = [
      ['/webinars', 200, 'Webinar catalogue'],
      ['/webinars?source=catalogue', 200, 'Webinar catalogue'],
      ['/web%69nars?source=encoded-catalogue', 200, 'Webinar catalogue'],
      ['/webinars/', 301, null],
      ['/webinars/?source=trailing-slash', 301, null],
      ['/200.html', 200, 'SPA fallback'],
      ['/%32%30%30.html', 200, 'SPA fallback'],
      ['//200.html?source=duplicate-slash', 200, 'SPA fallback'],
      ['/plain.html', 200, 'Ordinary static page'],
      ['/legal/privacy-policy/', 200, 'Privacy policy'],
      ['/legal/privacy-policy/index.html?source=legal', 200, 'Privacy policy'],
      ['/sitemap.xml', 200, '<urlset>fixture sitemap</urlset>'],
      ['/meeting/unknown-slug', 200, 'SPA fallback'],
      ['/ordinary-client-route?source=fallback', 200, 'SPA fallback']
    ] as const

    for (const [path, expectedStatus, expectedBody] of indexablePaths) {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: { authorization },
        redirect: 'manual'
      })

      assert.equal(response.status, expectedStatus, `${path} must preserve indexable handling`)
      if (expectedBody !== null) {
        assert.equal(await response.text(), expectedBody, `${path} must serve the expected indexable response`)
      }
      assert.equal(response.headers.get('x-robots-tag'), null, `${path} must remain indexable`)
      assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN', `${path} must retain security headers`)
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff', `${path} must retain security headers`)
    }

    // Representative precedence checks only: HIR-605 owns full redirect parity.
    for (const [path, target] of [
      ['/privacy-policy', '/legal/privacy-policy'],
      ['/category/guides', '/faq'],
      ['/c/intake-slug', '/meet/intake-slug'],
      ['/site-map', '/sitemap.xml'],
      ['/site-map/?source=legacy', '/sitemap.xml']
    ]) {
      const response = await fetch(`${baseUrl}${path}`, { headers: { authorization }, redirect: 'manual' })
      assert.equal(response.status, 301, `${path} must preserve its HTTP redirect`)
      assert.equal(new URL(response.headers.get('location') ?? '', baseUrl).pathname, target)
      assert.equal(response.headers.get('x-robots-tag'), null, `${path} must not acquire intake noindex`)
    }

    for (const path of ['/%67o/example', '/meet/unknown-slug', '/m%65et/unknown-slug/thank-you']) {
      const unauthorized = await fetch(`${baseUrl}${path}`, { redirect: 'manual' })
      assert.equal(unauthorized.status, 401, `${path} must remain protected by BasicAuth`)
      assert.match(unauthorized.headers.get('www-authenticate') ?? '', /^Basic /)
      assert.equal(unauthorized.headers.get('x-robots-tag'), 'noindex, nofollow')
      assert.equal(unauthorized.headers.get('x-frame-options'), 'SAMEORIGIN')
    }

    rmSync(join(runtimeDir, 'site', '200.html'))
    for (const path of ['/go/missing-fallback', '/meet/missing-fallback', '/meet/missing-fallback/thank-you']) {
      const missingFallback = await fetch(`${baseUrl}${path}`, { headers: { authorization }, redirect: 'manual' })
      assert.equal(missingFallback.status, 404, `${path} must fail closed when /200.html is missing`)
      assert.equal(missingFallback.headers.get('x-robots-tag'), 'noindex, nofollow')
      assert.equal(missingFallback.headers.get('x-frame-options'), 'SAMEORIGIN')
    }

    const logs = spawnSync('docker', ['logs', containerName], { encoding: 'utf8' })
    assert.equal(logs.status, 0, 'Docker logs must remain readable for regression diagnostics')
    assert.doesNotMatch(
      `${logs.stdout}${logs.stderr}`,
      /uninitialized .*co_branded_noindex_header/i,
      'no request shape may emit an uninitialized noindex-marker warning'
    )
  } catch (error) {
    const logs = spawnSync('docker', ['logs', containerName], { encoding: 'utf8' })
    throw new Error(`Temporary nginx regression failed. Container logs:\n${logs.stdout}${logs.stderr}`, { cause: error })
  } finally {
    spawnSync('docker', ['stop', containerName], { stdio: 'ignore' })
    rmSync(runtimeDir, { recursive: true, force: true })
  }
})

test('robots.txt never disallows the dynamic route families', () => {
  const robots = readRepoFile('public/robots.txt')
  const disallowLines = robots
    .split('\n')
    .map(line => line.trim())
    .filter(line => /^disallow:/i.test(line))

  for (const line of disallowLines) {
    assert.equal(
      /\/(go|cdfa\/go|webinars|meet)(\/|$|\?)/.test(line),
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
    if (script.includes('scripts/verify-deployed-routes.mjs')) continue
    assert.ok(script.includes('scripts/release-upload.mjs'), `${name} must call the route verifier or release uploader`)
    const uploader = readRepoFile('scripts/release-upload.mjs')
    assert.ok(uploader.includes('./lib/route-http-contract.mjs'), 'the release uploader must verify the shared HTTP route contract')
    assert.ok(uploader.includes('co-branded-noindex.conf'), 'the release uploader must verify the noindex snippet')
  }

  const verifier = readRepoFile('scripts/verify-deployed-routes.mjs')
  const contract = readRepoFile('scripts/lib/route-http-contract.mjs')
  assert.ok(verifier.includes('./lib/route-http-contract.mjs'), 'the route verifier must use the shared HTTP contract')
  assert.ok(contract.includes('X-Robots-Tag'), 'the shared contract must check X-Robots-Tag')
  assert.ok(contract.includes('noindex'), 'the shared contract must check dynamic noindex')
  assert.ok(contract.includes('/webinars/__webinar-route-check__'), 'the shared contract must probe webinar details')
  assert.ok(contract.includes("'/webinars'"), 'the shared contract must check the indexable catalogue')

  assert.ok(
    production.includes('co-branded-noindex.conf'),
    'production deploy must reference the required config/nginx/co-branded-noindex.conf host contract'
  )
})

test('deployment documentation states the noindexed soft-404 limitation for dynamic URLs', () => {
  const docs = readRepoFile('docs/production-deployment.md')

  assert.match(docs, /soft-404/i)
  assert.match(docs, /solagree-co-branded-noindex\.conf/)
  assert.match(docs, /X-Robots-Tag/)
  assert.match(docs, /normalizes escaped path/i)
  assert.match(docs, /BasicAuth/)

  const webinarDocs = readRepoFile('docs/webinars.md')
  assert.match(webinarDocs, /normalizes escaped path/i)
  assert.match(webinarDocs, /\/webinars\//)

  const readme = readRepoFile('README.md')

  assert.match(readme, /noindex/i)
  assert.match(readme, /X-Robots-Tag/)
})
