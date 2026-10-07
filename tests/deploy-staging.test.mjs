import assert from 'node:assert/strict'
import test from 'node:test'
import { releaseFixture } from './fixtures/release-deploy.mjs'

const testPassword = 'staging-test-password'

const runDeployment = ({ mode, credentials, environment = 'staging' } = {}) => {
  const fixture = releaseFixture(environment)
  fixture.executable('curl', `#!${process.execPath}
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const args = process.argv.slice(2)
const url = args.find(argument => argument.startsWith('https://'))
const headerIndex = args.indexOf('-D')
const bodyIndex = args.indexOf('-o')
const authConfigIndex = args.indexOf('--config')
const authPath = authConfigIndex === -1 ? '' : args[authConfigIndex + 1]
const auth = authPath === '-' ? readFileSync(0, 'utf8') : authPath ? readFileSync(authPath, 'utf8') : ''
const mode = process.env.TEST_CURL_MODE
const isDynamic = /\\/(go|cdfa\\/go|webinars)\\//.test(url)
const isCatalogue = url.endsWith('/webinars')
appendFileSync(process.env.TEST_DEPLOY_LOG, 'curl auth=' + (auth ? 'provided' : 'none') + ' url=' + url + '\\n')
if (mode === 'transport-failure') { process.stdout.write('000'); process.exit(7) }
if (url.endsWith('/about/')) { process.stdout.write('301 https://www.solagree.com/about-us'); process.exit(0) }
let status = '200'
if (mode === 'protected-success' && auth !== 'user = "test-user:${testPassword}"\\n') status = '401'
if (mode === 'public-success' && auth) status = '500'
if (mode === 'invalid-credentials' && url.endsWith('/')) status = '401'
if (mode === 'status-failure' && isDynamic) status = '500'
if (/^\\d+$/.test(mode) && isDynamic) status = mode
let headers = 'HTTP/1.1 ' + status + '\\nContent-Type: text/html; charset=utf-8\\n'
if (isDynamic && mode !== 'header-failure') headers += 'X-Robots-Tag: noindex, nofollow\\n'
if (isCatalogue) {
  if (mode === 'catalogue-noindex') headers += 'X-Robots-Tag: noindex, nofollow\\n'
  if (mode === 'catalogue-status-failure') status = '500'
}
if (headerIndex !== -1) writeFileSync(args[headerIndex + 1], headers)
if (bodyIndex !== -1 && args[bodyIndex + 1] !== '/dev/null') {
  const body = mode === 'wrong-body' ? '<html>proxy page</html>' : readFileSync(join(process.cwd(), '.output/public', isCatalogue ? 'webinars/index.html' : '200.html'))
  writeFileSync(args[bodyIndex + 1], body)
}
process.stdout.write(status)
`)
  try {
    return fixture.deploy(environment, ['--skip-build'], {
      TEST_CURL_MODE: mode,
      ...(credentials ? { STAGING_BASIC_AUTH_USER: credentials.user, STAGING_BASIC_AUTH_PASSWORD: credentials.password } : {})
    })
  } finally { fixture.cleanup() }
}

test('staging deployment accepts authorized protected route checks without logging credentials', () => {
  const result = runDeployment({
    mode: 'protected-success',
    credentials: { user: 'test-user', password: testPassword }
  })

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.log, /curl auth=provided/)
  assert.match(result.log, /rsync/)
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, new RegExp(testPassword))
})

test('staging deployment accepts public route checks without credentials', () => {
  const result = runDeployment({ mode: 'public-success' })

  assert.equal(result.status, 0, result.stderr)
  assert.match(result.log, /curl auth=none/)
  assert.match(result.log, /rsync/)
})

test('staging deployment rejects invalid BasicAuth before upload without logging credentials', () => {
  const result = runDeployment({
    mode: 'invalid-credentials',
    credentials: { user: 'test-user', password: testPassword }
  })

  assert.equal(result.status, 1)
  assert.match(result.stderr, /BasicAuth preflight failed/)
  assert.doesNotMatch(result.log, /rsync/)
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, new RegExp(testPassword))
})

test('staging deployment reports missing credentials before upload when staging is protected', () => {
  const result = runDeployment({ mode: 'invalid-credentials' })

  assert.equal(result.status, 1)
  assert.match(result.stderr, /requires credentials/)
  assert.doesNotMatch(result.log, /rsync/)
})

test('staging deployment rejects non-200 dynamic route responses', () => {
  const result = runDeployment({ mode: 'status-failure' })

  assert.equal(result.status, 1)
  assert.match(result.stderr, /HTTP 500; expected an authorized HTTP 200 response/)
})

test('staging deployment rejects missing noindex headers on dynamic route responses', () => {
  const result = runDeployment({ mode: 'header-failure' })

  assert.equal(result.status, 1)
  assert.match(result.stderr, /without an[\n ]+X-Robots-Tag: noindex, nofollow header/)
})

test('staging deployment rejects preflight transport failures before upload', () => {
  const result = runDeployment({ mode: 'transport-failure' })

  assert.equal(result.status, 1)
  assert.match(result.stderr, /preflight failed: could not reach the staging site/)
  assert.doesNotMatch(result.log, /rsync/)
})

test('staging deployment rejects partial credentials before requests or upload', () => {
  const result = runDeployment({ credentials: { user: 'test-user', password: '' } })

  assert.equal(result.status, 1)
  assert.match(result.stderr, /must be set together/)
  assert.equal(result.log, '')
})

for (const mode of ['catalogue-noindex', 'catalogue-status-failure']) {
  test(`staging deployment rejects ${mode}`, () => {
    const result = runDeployment({ mode })

    assert.equal(result.status, 1)
    assert.match(result.stderr, /catalogue check failed|webinars returned HTTP 500/)
  })
}

for (const environment of ['staging', 'production']) {
  for (const mode of ['public-success', '301', '401', '404', '500', '503', 'wrong-body']) {
    test(`${environment} deploy script uses the shared HTTP contract for ${mode}`, () => {
      const result = runDeployment({ environment, mode })
      assert.equal(result.status, mode === 'public-success' ? 0 : 1, result.stderr)
      assert.match(result.log, /rsync/)
      if (/^\d+$/.test(mode)) assert.match(result.stderr, new RegExp(`HTTP ${mode}; expected`))
      if (mode === 'wrong-body') assert.match(result.stderr, /body does not match/)
    })
  }
}
