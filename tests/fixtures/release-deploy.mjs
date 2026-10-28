import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { artifactFiles, releasePolicy } from '../../scripts/lib/release-artifact.mjs'
import { cleanSource, gateCommands, runtimeFiles, sha256 } from '../../scripts/lib/release-proof.mjs'

const root = new URL('../..', import.meta.url).pathname
export const canonical = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) : v)
export function releaseFixture(environment = 'production', measurementId = '') {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), 'solagree-release-')))
  for (const name of ['scripts', 'config']) cpSync(join(root, name), join(directory, name), { recursive: true })
  for (const name of ['package.json', 'package-lock.json']) cpSync(join(root, name), join(directory, name))
  mkdirSync(join(directory, 'public'))
  cpSync(join(root, 'public/.htaccess'), join(directory, 'public/.htaccess'))
  writeFileSync(join(directory, '.gitignore'), '.output\nbin\ntarget*\ncalls.log\nbundle*\n')
  const output = join(directory, '.output/public')
  const bin = join(directory, 'bin')
  const log = join(directory, 'calls.log')
  const target = join(directory, 'target')
  const store = join(directory, 'target-releases')
  mkdirSync(join(output, 'webinars'), { recursive: true })
  mkdirSync(bin)
  const policy = releasePolicy(environment, { NUXT_PUBLIC_GA_MEASUREMENT_ID: measurementId })
  const runtime = { public: { siteUrl: policy.siteOrigin, portalUrl: policy.portalUrl, portalApiBaseUrl: policy.portalApiOrigin, gaMeasurementId: policy.ga.measurementId, deploymentEnvironment: environment, initialConsultBooking: { meetingMethodMode: 'mixed' } } }
  const shell = `<!DOCTYPE html><html><head></head><body><div id="__nuxt"></div><script>window.__NUXT__={};window.__NUXT__.config=${JSON.stringify(runtime)};</script></body></html>`
  for (const name of ['index.html', '200.html', 'webinars/index.html']) writeFileSync(join(output, name), shell)
  writeFileSync(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${policy.siteOrigin}/</loc></url></urlset>`)
  execFileSync('git', ['init', '-q', directory])
  execFileSync('git', ['-C', directory, 'add', '.'])
  execFileSync('git', ['-C', directory, '-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '-qm', 'fixture'])
  const source = cleanSource(directory)
  const manifest = { schemaVersion: 1, commit: source.commit, ...policy, files: artifactFiles(output) }
  function saveManifest(value = manifest) {
    writeFileSync(join(output, 'release-manifest.json'), JSON.stringify(value))
    // Synthetic proof only for adversarial fixtures. Production proofs are
    // emitted exclusively by prepare-release after the actual commands pass.
    const proof = { schemaVersion: 1, ...source, manifestSha256: sha256(readFileSync(join(output, 'release-manifest.json'))), files: value.files, gates: gateCommands.map(command => ({ command, exitCode: 0 })), runtime: Object.fromEntries(runtimeFiles.map(path => [path, sha256(readFileSync(join(directory, path)))])) }
    writeFileSync(join(directory, '.output/release-proof.json'), JSON.stringify(proof))
  }
  saveManifest()
  function executable(name, content) {
    const path = join(bin, name)
    writeFileSync(path, content)
    chmodSync(path, 0o755)
  }
  executable('ssh', `#!${process.execPath}
import { appendFileSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
appendFileSync(process.env.TEST_DEPLOY_LOG, 'ssh\\n')
const request = JSON.parse(readFileSync(0, 'utf8'))
const originalStore = request.store
request.root = process.env.TEST_TARGET_ROOT
request.store = process.env.TEST_TARGET_ROOT + '-releases'
if (process.env.TEST_TARGET_DRIFT === 'true' && request.mode === 'promote') request.expected = '0'.repeat(64)
const encoded = process.argv.at(-1).match(/b64decode\\("([A-Za-z0-9+/=]+)"\\)/)[1]
const result = spawnSync('python3', ['-c', Buffer.from(encoded, 'base64').toString()], { input: JSON.stringify(request), encoding: 'utf8' })
if (result.status === 0) { const data = JSON.parse(result.stdout); if (request.mode === 'begin') data.path = originalStore + '/incoming/' + data.token; process.stdout.write(JSON.stringify(data)) } else process.stdout.write(result.stdout)
process.stderr.write(result.stderr)
process.exit(result.status)
`)
  executable('rsync', `#!${process.execPath}
import { appendFileSync, cpSync, writeFileSync } from 'node:fs'
appendFileSync(process.env.TEST_DEPLOY_LOG, 'rsync ' + process.argv.slice(2).join(' ') + '\\n')
if (process.env.TEST_UPLOAD_FAILURE === 'true') process.exit(23)
const token = process.argv.at(-1).split('/').filter(Boolean).at(-1)
const destination = process.env.TEST_TARGET_ROOT + '-releases/incoming/' + token
cpSync(process.argv.at(-2), destination, { recursive: true })
if (process.env.TEST_CORRUPT_UPLOAD === 'true') writeFileSync(destination + '/artifact/200.html', 'truncated')
`)
  // Shell wiring tests use stubs; release-host.integration exercises real nginx.
  executable('nginx', '#!/bin/sh\nexit 0\n')
  executable('curl', `#!${process.execPath}
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const args = process.argv.slice(2)
const url = new URL(args.at(-1))
if (url.pathname === '/about/') { process.stdout.write('301 ' + url.origin + '/about-us'); process.exit(0) }
if (args.includes('-D')) writeFileSync(args[args.indexOf('-D') + 1], 'HTTP/1.1 200 OK\\nContent-Type: text/html\\n' + (url.pathname !== '/webinars' ? 'X-Robots-Tag: noindex, nofollow\\n' : ''))
if (args[args.indexOf('-o') + 1] !== '/dev/null') writeFileSync(args[args.indexOf('-o') + 1], readFileSync(join(process.cwd(), '.output/public', url.pathname === '/webinars' ? 'webinars/index.html' : '200.html')))
process.stdout.write('200')
`)
  const env = {
    ...process.env, PATH: `${bin}:${process.env.PATH}`, TEST_DEPLOY_LOG: log,
    NUXT_PUBLIC_SITE_URL: policy.siteOrigin, NUXT_PUBLIC_PORTAL_URL: policy.portalUrl,
    NUXT_PUBLIC_PORTAL_API_BASE_URL: policy.portalApiOrigin, NUXT_PUBLIC_GA_MEASUREMENT_ID: measurementId,
    NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: environment, STAGING_BASIC_AUTH_USER: '', STAGING_BASIC_AUTH_PASSWORD: '',
    TEST_TARGET_ROOT: target, RELEASE_EXPECTED_TARGET_SHA256: sha256('absent'), RELEASE_TARGET_QUIESCED: 'true', RELEASE_INITIALIZE: 'true'
  }
  const host = request => spawnSync('python3', [join(directory, 'scripts/lib/release-host.py')], { input: JSON.stringify({ root: target, store, policy, ...request }), env, cwd: directory, encoding: 'utf8' })
  function inventory(path) {
    return JSON.parse(execFileSync('python3', ['-c', `import sys; code=open(sys.argv[1]).read().split('\\ntry:\\n    request =')[0]; exec(code); print(json.dumps(inventory(sys.argv[2])))`, join(directory, 'scripts/lib/release-host.py'), path], { encoding: 'utf8' }))
  }
  function bundle(destination = join(directory, 'bundle')) {
    rmSync(destination, { recursive: true, force: true })
    cpSync(output, join(destination, 'artifact'), { recursive: true })
    cpSync(join(directory, '.output/release-proof.json'), join(destination, 'release-proof.json'))
    for (const path of runtimeFiles) {
      mkdirSync(join(destination, 'runtime', path, '..'), { recursive: true })
      cpSync(join(directory, path), join(destination, 'runtime', path))
    }
    return destination
  }
  function seedTarget(extra = {}) {
    const stage = join(directory, 'target-seed')
    cpSync(output, join(stage, 'public'), { recursive: true })
    for (const [path, content] of Object.entries(extra)) { mkdirSync(join(stage, 'public', path, '..'), { recursive: true }); writeFileSync(join(stage, 'public', path), content) }
    bundle(join(stage, 'bundle'))
    const seal = { schemaVersion: 1, public: inventory(join(stage, 'public')), bundle: inventory(join(stage, 'bundle')) }
    const id = sha256(canonical(seal))
    writeFileSync(join(stage, 'release.json'), canonical(seal))
    writeFileSync(join(stage, 'accepted.json'), JSON.stringify({ schemaVersion: 1, id, commit: manifest.commit }))
    mkdirSync(join(store, 'releases'), { recursive: true })
    cpSync(stage, join(store, 'releases', id), { recursive: true })
    symlinkSync(join(store, 'releases', id, 'public'), target)
    rmSync(stage, { recursive: true })
    const state = JSON.parse(host({ mode: 'inspect' }).stdout)
    env.RELEASE_EXPECTED_TARGET_SHA256 = state.sha256
    return id
  }
  return {
    directory, output, target, store, manifest, env, saveManifest, executable, bundle, host, seedTarget, inventory,
    deploy(target = environment, options = ['--skip-build', '--dry-run'], override = {}) {
      const result = spawnSync('bash', [`scripts/deploy-${target}.sh`, ...options], { cwd: directory, env: { ...env, ...override }, encoding: 'utf8' })
      return { ...result, log: existsSync(log) ? readFileSync(log, 'utf8') : '' }
    },
    cleanup() { rmSync(directory, { recursive: true, force: true }) }
  }
}
