import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { artifactFiles, releasePolicy } from '../../scripts/lib/release-artifact.mjs'
import { createHash } from 'node:crypto'

const root = new URL('../..', import.meta.url).pathname
export function releaseFixture(environment = 'production', measurementId = '') {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), 'solagree-release-')))
  cpSync(join(root, 'scripts'), join(directory, 'scripts'), { recursive: true })
  cpSync(join(root, 'config'), join(directory, 'config'), { recursive: true })
  const output = join(directory, '.output/public')
  const bin = join(directory, 'bin')
  const log = join(directory, 'calls.log')
  mkdirSync(join(output, 'webinars'), { recursive: true })
  mkdirSync(bin)
  const policy = releasePolicy(environment, { NUXT_PUBLIC_GA_MEASUREMENT_ID: measurementId })
  const runtime = { public: { siteUrl: policy.siteOrigin, portalUrl: policy.portalUrl, portalApiBaseUrl: policy.portalApiOrigin, gaMeasurementId: policy.ga.measurementId, deploymentEnvironment: environment, initialConsultBooking: { meetingMethodMode: 'mixed' } } }
  const shell = `<!DOCTYPE html><html><head></head><body><div id="__nuxt"></div><script>window.__NUXT__={};window.__NUXT__.config=${JSON.stringify(runtime)};</script></body></html>`
  writeFileSync(join(output, 'index.html'), shell)
  writeFileSync(join(output, '200.html'), shell)
  writeFileSync(join(output, 'webinars/index.html'), shell)
  writeFileSync(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${policy.siteOrigin}/</loc></url></urlset>`)
  execFileSync('git', ['init', '-q', directory])
  execFileSync('git', ['-C', directory, '-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '--allow-empty', '-qm', 'fixture'])
  const commit = execFileSync('git', ['-C', directory, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  const manifest = { schemaVersion: 1, commit, ...policy, files: artifactFiles(output) }
  function saveManifest(value = manifest) { writeFileSync(join(output, 'release-manifest.json'), JSON.stringify(value)) }
  saveManifest()
  function executable(name, content) {
    const path = join(bin, name)
    writeFileSync(path, content)
    chmodSync(path, 0o755)
  }
  const target = join(directory, 'target')
  mkdirSync(target)
  const targetFingerprint = createHash('sha256').update('{"directories":[],"files":{}}').digest('hex')
  executable('ssh', `#!${process.execPath}
import { appendFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
appendFileSync(process.env.TEST_DEPLOY_LOG, 'ssh\\n')
if (!process.argv.at(-1).startsWith('python3 - ')) process.exit(0)
const request = JSON.parse(Buffer.from(process.argv.at(-1).split(' ').at(-1), 'base64'))
request.root = process.env.TEST_TARGET_ROOT
if (request.backup) request.backup = process.env.TEST_TARGET_ROOT + '-backups/' + request.backup.split('/').at(-1)
if (request.mode === 'backup' && process.env.TEST_TARGET_DRIFT === 'true') writeFileSync(process.env.TEST_TARGET_ROOT + '/external-write.txt', 'drift')
const result = spawnSync('python3', ['-', Buffer.from(JSON.stringify(request)).toString('base64')], { input: await new Promise(resolve => { let data = ''; process.stdin.on('data', chunk => { data += chunk }); process.stdin.on('end', () => resolve(data)) }), encoding: 'utf8' })
process.stdout.write(result.stdout)
process.stderr.write(result.stderr)
process.exit(result.status)
`)
  // Fake rsync copies the same regular artifact files while retaining hidden target configuration.
  executable('rsync', `#!${process.execPath}
import { appendFileSync, cpSync, readdirSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
appendFileSync(process.env.TEST_DEPLOY_LOG, 'rsync ' + process.argv.slice(2).join(' ') + '\\n')
if (!process.argv.includes('--dry-run')) {
  function copy(source, destination) {
    mkdirSync(destination, { recursive: true })
    for (const name of readdirSync(source)) {
      if (name.startsWith('.')) continue
      if (statSync(join(source, name)).isDirectory()) copy(join(source, name), join(destination, name))
      else cpSync(join(source, name), join(destination, name))
    }
  }
  copy(process.argv.at(-2), process.env.TEST_TARGET_ROOT)
  if (process.env.TEST_PROTECTED_DRIFT === 'true') writeFileSync(join(process.env.TEST_TARGET_ROOT, '.htaccess'), 'tampered')
}
`)
  const env = {
    ...process.env, PATH: `${bin}:${process.env.PATH}`, TEST_DEPLOY_LOG: log,
    NUXT_PUBLIC_SITE_URL: policy.siteOrigin, NUXT_PUBLIC_PORTAL_URL: policy.portalUrl,
    NUXT_PUBLIC_PORTAL_API_BASE_URL: policy.portalApiOrigin, NUXT_PUBLIC_GA_MEASUREMENT_ID: measurementId,
    NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: environment, STAGING_BASIC_AUTH_USER: '', STAGING_BASIC_AUTH_PASSWORD: '',
    TEST_TARGET_ROOT: target, STAGING_EXPECTED_TARGET_SHA256: targetFingerprint, STAGING_TARGET_QUIESCED: 'true'
  }
  return {
    directory, output, target, manifest, env, saveManifest, executable,
    deploy(target = environment, options = ['--skip-build', '--dry-run'], override = {}) {
      const result = spawnSync('bash', [`scripts/deploy-${target}.sh`, ...options], {
        cwd: directory, env: { ...env, ...override }, encoding: 'utf8'
      })
      return { ...result, log: existsSync(log) ? readFileSync(log, 'utf8') : '' }
    },
    cleanup() { rmSync(directory, { recursive: true, force: true }) }
  }
}
