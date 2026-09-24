import assert from 'node:assert/strict'
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const repoRoot = new URL('..', import.meta.url).pathname
const testPassword = 'staging-test-password'

const writeExecutable = (path, contents) => {
  writeFileSync(path, contents)
  chmodSync(path, 0o755)
}

const runDeployment = ({ mode, credentials } = {}) => {
  const fixtureRoot = mkdtempSync(join(tmpdir(), 'solagree-deploy-staging-'))
  const binDir = join(fixtureRoot, 'bin')
  const outputDir = join(repoRoot, '.output', 'public')
  const logPath = join(fixtureRoot, 'calls.log')
  mkdirSync(binDir)
  const outputAlreadyExists = existsSync(outputDir)
  if (!outputAlreadyExists) mkdirSync(outputDir, { recursive: true })

  writeExecutable(join(binDir, 'node'), '#!/usr/bin/env bash\nexit 0\n')
  writeExecutable(join(binDir, 'rsync'), `#!${process.execPath}
import { appendFileSync } from 'node:fs'
appendFileSync(process.env.TEST_DEPLOY_LOG, 'rsync\\n')
`)
  writeExecutable(join(binDir, 'curl'), `#!${process.execPath}
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'

const args = process.argv.slice(2)
const url = args.find(argument => argument.startsWith('https://'))
const headerIndex = args.indexOf('-D')
const headerPath = headerIndex === -1 ? undefined : args[headerIndex + 1]
const authConfigIndex = args.indexOf('--config')
const auth = authConfigIndex === -1 ? '' : readFileSync(args[authConfigIndex + 1], 'utf8')
const mode = process.env.TEST_CURL_MODE
const isDynamic = /\\/(go|cdfa\\/go|webinars)\\//.test(url)
const isCatalogue = url.endsWith('/webinars')

appendFileSync(process.env.TEST_DEPLOY_LOG, 'curl auth=' + (auth ? 'provided' : 'none') + ' url=' + url + '\\n')

if (mode === 'transport-failure') {
  process.stdout.write('000')
  process.exit(7)
}

let status = '200'
let headers = ''
if (mode === 'protected-success' && auth !== 'user = "test-user:${testPassword}"\\n') status = '401'
if (mode === 'public-success' && auth) status = '500'
if (mode === 'invalid-credentials' && url.endsWith('/')) status = '401'
if (mode === 'status-failure' && isDynamic) status = '500'
if (isDynamic && mode !== 'header-failure') headers = 'X-Robots-Tag: noindex, nofollow\\n'
if (isCatalogue) {
  headers = mode === 'catalogue-noindex' ? 'X-Robots-Tag: noindex, nofollow\\n' : ''
  if (mode === 'catalogue-status-failure') status = '500'
}
if (headerPath && headerPath !== '-w') writeFileSync(headerPath, headers)
process.stdout.write(status)
`)

  const result = spawnSync('bash', ['scripts/deploy-staging.sh', '--skip-build'], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${binDir}:${process.env.PATH}`,
      NUXT_PUBLIC_SITE_URL: 'https://staging.example.test',
      STAGING_BASIC_AUTH_USER: '',
      STAGING_BASIC_AUTH_PASSWORD: '',
      TEST_CURL_MODE: mode,
      TEST_DEPLOY_LOG: logPath,
      ...(credentials ? {
        STAGING_BASIC_AUTH_USER: credentials.user,
        STAGING_BASIC_AUTH_PASSWORD: credentials.password
      } : {})
    }
  })

  const log = existsSync(logPath) ? readFileSync(logPath, 'utf8') : ''
  rmSync(fixtureRoot, { force: true, recursive: true })
  if (!outputAlreadyExists) rmSync(outputDir, { force: true, recursive: true })
  return { ...result, log }
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
    assert.match(result.stderr, /catalogue check failed/)
  })
}
