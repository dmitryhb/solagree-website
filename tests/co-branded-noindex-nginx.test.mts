import assert from 'node:assert/strict'
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import test from 'node:test'

import {
  EXPECTED_X_ROBOTS_TAG_DIRECTIVE,
  NOINDEX_HEADER_VARIABLE,
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

test('nginx snippet keeps dynamic route families on the static fallback with a server-scoped noindex header', () => {
  const config = readRepoFile('config/nginx/co-branded-noindex.conf')

  for (const prefix of ['/go/', '/cdfa/go/', '/webinars/']) {
    assert.match(config, new RegExp(`location\\s+\\^~\\s+${prefix}\\s*\\{`), `missing location block for ${prefix}`)
  }

  assert.match(config, new RegExp(`add_header X-Robots-Tag \\${NOINDEX_HEADER_VARIABLE} always;`))
  assert.ok(
    config.indexOf(EXPECTED_X_ROBOTS_TAG_DIRECTIVE) > config.lastIndexOf('location ^~ /webinars/'),
    'X-Robots-Tag must remain at server scope after the locations define its marker variable'
  )
  assert.match(config, /try_files \$uri \$uri\/ \/200\.html;/)
  assert.doesNotMatch(config, /return\s+404/)

  for (const prefix of ['/go/', '/cdfa/go/', '/webinars/']) {
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
  assert.match(config, /if\s*\(\$uri\s+!=\s+\/200\.html\)/)
  assert.match(config, /if\s*\(\$request_uri\s+~\s+\^\/200\\\.html\(\?:\[\?#\]\|\$\)\)/)
  assert.doesNotMatch(
    config,
    /if\s*\(\$request_uri\s+~\s+\^\/(?:\(\?:go\|cdfa\/go\)|webinars)/,
    'raw dynamic-route matching misses percent-encoded aliases'
  )
})

test('nginx normalizes encoded dynamic aliases before the fallback without dropping auth or security headers', {
  skip: !dockerAvailable && 'Docker is unavailable for the Nginx runtime regression'
}, async () => {
  const runtimeDir = mkdtempSync(join(tmpdir(), 'hir-611-nginx-'))
  const containerName = `hir-611-nginx-${process.pid}-${Date.now()}`

  try {
    mkdirSync(join(runtimeDir, 'site', 'webinars'), { recursive: true })
    cpSync(new URL('../config/nginx/co-branded-noindex.conf', import.meta.url), join(runtimeDir, 'noindex.conf'))
    writeFileSync(join(runtimeDir, 'site', '200.html'), 'SPA fallback')
    writeFileSync(join(runtimeDir, 'site', 'webinars', 'index.html'), 'Webinar catalogue')
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
    include /etc/nginx/conf.d/noindex.conf;
    location / { try_files $uri $uri/ /200.html; }
  }
}
`)

    runDocker(
      'run', '--rm', '-d', '--name', containerName, '-p', '127.0.0.1::8080',
      '-v', `${join(runtimeDir, 'nginx.conf')}:/etc/nginx/nginx.conf:ro`,
      '-v', `${join(runtimeDir, 'noindex.conf')}:/etc/nginx/conf.d/noindex.conf:ro`,
      '-v', `${join(runtimeDir, 'users')}:/etc/nginx/conf.d/users:ro`,
      '-v', `${join(runtimeDir, 'site')}:/usr/share/nginx/html:ro`,
      'nginx:1.27-alpine'
    )

    const port = runDocker('port', containerName, '8080/tcp').match(/:(\d+)$/)?.[1]
    assert.ok(port, 'Docker must publish the temporary Nginx listener')

    const baseUrl = `http://127.0.0.1:${port}`
    const authorization = `Basic ${Buffer.from('user:pass').toString('base64')}`
    const dynamicPaths = [
      '/go/partner',
      '/cdfa/go/partner',
      '/webinars/event-1',
      '/%67o/example',
      '/cdfa/%67o/example?source=review',
      '/web%69nars/example'
    ]

    for (const path of dynamicPaths) {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: { authorization },
        redirect: 'manual'
      })

      assert.equal(response.status, 200, `${path} must use the SPA fallback`)
      assert.equal(await response.text(), 'SPA fallback', `${path} must serve /200.html`)
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow', `${path} must be noindexed`)
      assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN', `${path} must retain security headers`)
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff', `${path} must retain security headers`)
    }

    for (const [path, expectedStatus] of [['/webinars', 200], ['/webinars/', 301], ['/200.html', 200]] as const) {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: { authorization },
        redirect: 'manual'
      })

      assert.equal(response.status, expectedStatus, `${path} must preserve catalogue handling`)
      assert.equal(response.headers.get('x-robots-tag'), null, `${path} must remain indexable`)
      assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN', `${path} must retain security headers`)
    }

    const unauthorized = await fetch(`${baseUrl}/%67o/example`, { redirect: 'manual' })
    assert.equal(unauthorized.status, 401, 'the normalized dynamic alias must remain protected by BasicAuth')
    assert.match(unauthorized.headers.get('www-authenticate') ?? '', /^Basic /)
    assert.equal(unauthorized.headers.get('x-robots-tag'), 'noindex, nofollow')
    assert.equal(unauthorized.headers.get('x-frame-options'), 'SAMEORIGIN')
    const logs = spawnSync('docker', ['logs', containerName], { encoding: 'utf8' })
    assert.equal(logs.status, 0, 'Docker logs must remain readable for regression diagnostics')
    assert.doesNotMatch(
      `${logs.stdout}${logs.stderr}`,
      /using uninitialized "co_branded_noindex_header" variable/,
      'indexable requests must not emit an uninitialized noindex-marker warning'
    )
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
  assert.match(docs, /normalizes escaped path/i)
  assert.match(docs, /BasicAuth/)

  const webinarDocs = readRepoFile('docs/webinars.md')
  assert.match(webinarDocs, /normalizes escaped path/i)
  assert.match(webinarDocs, /\/webinars\//)

  const readme = readRepoFile('README.md')

  assert.match(readme, /noindex/i)
  assert.match(readme, /X-Robots-Tag/)
})
