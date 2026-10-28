// Required preflight: cached nginx image and local Chromium, no image pulls or
// provider requests. Runs the actual Python release helper and shared HTTP gate.
import assert from 'node:assert/strict'
import { execFileSync, spawn } from 'node:child_process'
import { chmodSync, cpSync, existsSync, mkdirSync, readFileSync, readlinkSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { chromium } from '@playwright/test'
import { artifactFiles, releasePolicy } from '../scripts/lib/release-artifact.mjs'
import { sha256 } from '../scripts/lib/release-proof.mjs'
import { releaseFixture } from './fixtures/release-deploy.mjs'

const image = 'nginx:1.29-alpine'
execFileSync('docker', ['image', 'inspect', image], { stdio: 'ignore' })
function setup() {
  const fixture = releaseFixture('staging')
  chmodSync(fixture.directory, 0o755)
  rmSync(join(fixture.directory, 'bin/curl'))
  fixture.executable('nginx', `#!${process.execPath}
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
const args = process.argv.slice(2)
const prefix = args[args.indexOf('-p') + 1]
const path = args[args.indexOf('-c') + 1]
const name = 'solagree-hir624-' + createHash('sha256').update(prefix).digest('hex').slice(0, 16)
if (args.includes('-s')) { execFileSync('docker', ['stop', '-t', '2', name], { stdio: 'ignore' }); process.exit(0) }
const original = readFileSync(path, 'utf8')
const port = original.match(/listen 127\\.0\\.0\\.1:(\\d+)/)[1]
const config = path + '.docker'
writeFileSync(config, original.replace('listen 127.0.0.1:', 'listen 0.0.0.0:'))
const docker = ['run', '--pull=never', '--rm', '--name', name, '--entrypoint', 'nginx', '-v', process.env.TEST_TARGET_ROOT + '/..:' + process.env.TEST_TARGET_ROOT + '/..']
if (!args.includes('-t')) docker.push('-d', '-p', '127.0.0.1:' + port + ':' + port)
docker.push('${image}', '-p', prefix, '-c', config, '-g', 'daemon off;')
if (args.includes('-t')) docker.push('-t')
execFileSync('docker', docker, { stdio: 'inherit' })
`)
  const helper = request => {
    const result = fixture.host(request)
    assert.equal(result.status, 0, result.stderr)
    return JSON.parse(result.stdout)
  }
  const state = () => helper({ mode: 'inspect' })
  const request = extra => ({ expected: state().sha256, initialize: true, publicCheck: { baseUrl: fixture.baseUrl }, ...extra })
  const promote = () => {
    const options = request({})
    const incoming = helper({ ...options, mode: 'begin' })
    cpSync(fixture.bundle(), incoming.path, { recursive: true })
    return helper({ ...options, mode: 'promote', token: incoming.token })
  }
  const rollback = release => helper(request({ mode: 'rollback', release }))
  return Object.assign(fixture, { helper, state, request, promote, rollback })
}
async function startPublic(fixture) {
  const server = createServer()
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  await new Promise(resolve => server.close(resolve))
  const prefix = join(fixture.directory, 'target-public-nginx')
  mkdirSync(prefix)
  const config = join(prefix, 'nginx.conf')
  writeFileSync(config, `pid ${prefix}/nginx.pid; error_log ${prefix}/error.log; events {} http { access_log off; default_type text/html; types { application/javascript js mjs; } server { listen 127.0.0.1:${port}; root ${fixture.target}; add_header X-Robots-Tag "noindex, nofollow" always; include ${fixture.directory}/config/nginx/co-branded-noindex.conf; location / { try_files $uri $uri/ /200.html; } } }`)
  execFileSync(join(fixture.directory, 'bin/nginx'), ['-p', prefix + '/', '-c', config], { env: fixture.env, stdio: 'pipe' })
  fixture.baseUrl = `http://127.0.0.1:${port}`
  return () => execFileSync(join(fixture.directory, 'bin/nginx'), ['-p', prefix + '/', '-c', config, '-s', 'quit'], { env: fixture.env, stdio: 'ignore' })
}
function save(fixture) { fixture.manifest.files = artifactFiles(fixture.output); fixture.saveManifest() }
function childHost(fixture, request) {
  const child = spawn('python3', [join(fixture.directory, 'scripts/lib/release-host.py')], { cwd: fixture.directory, env: fixture.env, stdio: ['pipe', 'pipe', 'pipe'] })
  let stdout = '', stderr = ''
  child.stdout.on('data', chunk => { stdout += chunk })
  child.stderr.on('data', chunk => { stderr += chunk })
  child.stdin.end(JSON.stringify({ root: fixture.target, store: fixture.store, policy: releasePolicy('staging', fixture.env), ...request }))
  // policy fields only, not the entire manifest.
  return new Promise(resolve => child.on('close', status => resolve({ status, stdout, stderr })))
}

if (process.env.TEST_PREPARED_RELEASE !== 'true') {
test('real nginx promotion is atomic, rollback needs no rebuild and browser tabs retain both generations of lazy chunks', async () => {
  const fixture = setup()
  let stop, browser
  try {
    mkdirSync(join(fixture.output, '_nuxt'))
    writeFileSync(join(fixture.output, '_nuxt/old.a1b2.mjs'), 'export const value = "old lazy chunk"')
    save(fixture)
    stop = await startPublic(fixture)
    const first = fixture.promote()
    const executablePath = process.env.RELEASE_CHROMIUM_EXECUTABLE ?? (existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome') ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined)
    browser = await chromium.launch({ headless: true, executablePath })
    const oldTab = await browser.newPage()
    await oldTab.route('**/*', route => route.request().url().startsWith(fixture.baseUrl) ? route.continue() : route.abort())
    await oldTab.goto(fixture.baseUrl)
    rmSync(join(fixture.output, '_nuxt/old.a1b2.mjs'))
    writeFileSync(join(fixture.output, '_nuxt/new.c3d4.mjs'), 'export const value = "new lazy chunk"')
    writeFileSync(join(fixture.output, '200.html'), readFileSync(join(fixture.output, '200.html'), 'utf8').replace('</body>', 'release two</body>'))
    save(fixture)
    const options = fixture.request({})
    const incoming = fixture.helper({ ...options, mode: 'begin' })
    cpSync(fixture.bundle(), incoming.path, { recursive: true })
    const oldBody = readFileSync(join(fixture.target, '200.html'), 'utf8')
    const nextBody = readFileSync(join(fixture.output, '200.html'), 'utf8')
    let finished = false
    const promotion = childHost(fixture, { ...options, mode: 'promote', token: incoming.token }).then(result => { finished = true; return result })
    let reads = 0
    while (!finished) {
      const response = await fetch(fixture.baseUrl + '/go/atomic-reader?check=1')
      assert.equal(response.status, 200)
      assert.ok([oldBody, nextBody].includes(await response.text()), 'reader saw partial or mixed output')
      reads++
    }
    const promoted = await promotion
    assert.equal(promoted.status, 0, promoted.stderr)
    assert.ok(reads > 0)
    const second = JSON.parse(promoted.stdout)
    assert.notEqual(second.id, first.id)
    assert.equal(await oldTab.evaluate(async () => (await import('/_nuxt/old.a1b2.mjs?old-tab=1')).value), 'old lazy chunk')
    const newTab = await browser.newPage()
    await newTab.route('**/*', route => route.request().url().startsWith(fixture.baseUrl) ? route.continue() : route.abort())
    await newTab.goto(fixture.baseUrl)
    const restored = fixture.rollback(first.id)
    assert.equal(restored.commit, first.commit)
    assert.equal(readFileSync(join(fixture.target, '200.html'), 'utf8').includes('release two'), false)
    assert.equal(await newTab.evaluate(async () => (await import('/_nuxt/new.c3d4.mjs?after-rollback=1')).value), 'new lazy chunk')
    assert.equal(await oldTab.evaluate(async () => (await import('/_nuxt/old.a1b2.mjs?after-rollback=1')).value), 'old lazy chunk')
    // Every response through an encoded path/query still carries the exact shell.
    const response = await newTab.request.get(`${fixture.baseUrl}/%67o/missing?campaign=one`)
    assert.equal(response.status(), 200)
    assert.match(response.headers()['x-robots-tag'], /noindex/)
    assert.equal(await response.text(), readFileSync(join(fixture.target, '200.html'), 'utf8'))
    assert.equal(existsSync(join(fixture.store, 'releases', second.id)), true)
  } finally { if (browser) await browser.close(); if (stop) stop(); fixture.cleanup() }
})

test('real candidate HTTP failure and failed public acceptance preserve the active release', async () => {
  const fixture = setup()
  let stop
  try {
    stop = await startPublic(fixture)
    fixture.promote()
    const before = readlinkSync(fixture.target)
    const options = fixture.request({})
    const incoming = fixture.helper({ ...options, mode: 'begin' })
    cpSync(fixture.bundle(), incoming.path, { recursive: true })
    // The valid manifest/proof cannot mask an invalid copied HTTP contract.
    writeFileSync(join(incoming.path, 'runtime/config/nginx/co-branded-noindex.conf'), '# broken candidate config')
    const proofPath = join(incoming.path, 'release-proof.json')
    const proof = JSON.parse(readFileSync(proofPath))
    proof.runtime['config/nginx/co-branded-noindex.conf'] = sha256('# broken candidate config')
    writeFileSync(proofPath, JSON.stringify(proof))
    const rejected = fixture.host({ ...options, mode: 'promote', token: incoming.token })
    assert.equal(rejected.status, 1)
    assert.match(rejected.stderr, /without an X-Robots-Tag/)
    assert.equal(readlinkSync(fixture.target), before)
    // A valid private candidate with an unreachable public endpoint is switched
    // back under the same lock. The prior immutable release is untouched.
    const next = fixture.helper({ ...options, mode: 'begin' })
    cpSync(fixture.bundle(), next.path, { recursive: true })
    const failedPublic = fixture.host({ ...options, mode: 'promote', token: next.token, publicCheck: { baseUrl: 'http://127.0.0.1:1' } })
    assert.equal(failedPublic.status, 1)
    assert.match(failedPublic.stderr, /previous webroot restored/)
    assert.equal(readlinkSync(fixture.target), before)
  } finally { if (stop) stop(); fixture.cleanup() }
})

test('concurrent promotion and rollback serialize on one lock and stale candidates cannot switch', async () => {
  const fixture = setup()
  let stop
  try {
    stop = await startPublic(fixture)
    const first = fixture.promote()
    writeFileSync(join(fixture.output, '200.html'), readFileSync(join(fixture.output, '200.html'), 'utf8').replace('</body>', 'concurrent candidate</body>'))
    save(fixture)
    const options = fixture.request({})
    const incoming = fixture.helper({ ...options, mode: 'begin' })
    cpSync(fixture.bundle(), incoming.path, { recursive: true })
    const results = await Promise.all([
      childHost(fixture, { ...options, mode: 'promote', token: incoming.token }),
      childHost(fixture, { ...options, mode: 'rollback', release: first.id })
    ])
    assert.equal(results.filter(result => result.status === 0).length, 1, JSON.stringify(results))
    assert.match(results.find(result => result.status !== 0).stderr, /release lock|inventory changed/)
    const state = fixture.state()
    assert.match(state.id, /^[a-f0-9]{64}$/)
    assert.equal((await fetch(fixture.baseUrl + '/webinars')).status, 200)
    // A candidate pinned before an actual promotion cannot later replace it.
    if (state.sha256 !== options.expected) {
      const stale = fixture.host({ ...options, mode: 'rollback', release: first.id })
      assert.equal(stale.status, 1)
      assert.match(stale.stderr, /inventory changed/)
    }
  } finally { if (stop) stop(); fixture.cleanup() }
})
} else {
  test('genuine prepared artifact promotes through the real client/helper and preserves host auth', async () => {
    const root = fileURLToPath(new URL('..', import.meta.url))
    const manifest = JSON.parse(readFileSync(join(root, '.output/public/release-manifest.json')))
    const proof = JSON.parse(readFileSync(join(root, '.output/release-proof.json')))
    assert.equal(manifest.environment, 'staging')
    assert.equal(proof.commit, execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim())
    assert.equal(existsSync(join(root, '.output/public/.htaccess')), false)
    assert.equal(Object.hasOwn(manifest.files, '.htaccess'), false)
    assert.equal(Object.hasOwn(proof.files, '.htaccess'), false)
    const fixture = setup()
    let stop
    try {
      fixture.seedTarget({ '.htaccess': 'AuthType Basic\nhost-owned auth', '.well-known/token': 'host-owned challenge' })
      stop = await startPublic(fixture)
      // Only the SSH/rsync transport is replaced. curl executes against real
      // local nginx, with every public URL mapped to the isolated fixture.
      fixture.env.TEST_REAL_CURL_BASE_URL = fixture.baseUrl
      fixture.env.TEST_PREPARED_SITE_ORIGIN = manifest.siteOrigin
      fixture.executable('curl', `#!${process.execPath}
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
const args = process.argv.slice(2).map(arg => {
  if (!/^https?:\\/\\//.test(arg)) return arg
  const url = new URL(arg)
  if (url.origin === process.env.TEST_PREPARED_SITE_ORIGIN) return process.env.TEST_REAL_CURL_BASE_URL + url.pathname + url.search
  if (url.hostname !== '127.0.0.1') throw new Error('fixture refuses external HTTP requests')
  return arg
})
const result = spawnSync('/usr/bin/curl', args, { input: readFileSync(0) })
if (result.stdout) process.stdout.write(result.stdout)
if (result.stderr) process.stderr.write(result.stderr)
process.exit(result.status ?? 1)
`)
      const result = execFileSync(process.execPath, [join(root, 'scripts/release-upload.mjs')], { cwd: root, env: fixture.env, encoding: 'utf8' })
      assert.match(result, /Activated immutable release/)
      assert.deepEqual(JSON.parse(readFileSync(join(fixture.target, 'release-manifest.json'))), manifest)
      assert.equal(readFileSync(join(fixture.target, '.htaccess'), 'utf8'), 'AuthType Basic\nhost-owned auth')
      assert.equal(readFileSync(join(fixture.target, '.well-known/token'), 'utf8'), 'host-owned challenge')
      assert.equal(fixture.state().accepted, true)
    } finally { if (stop) stop(); fixture.cleanup() }
  })
}
