import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { releasePolicy } from './lib/release-artifact.mjs'
import { cleanSource, proofName, runtimeFiles, sha256, verifyProof } from './lib/release-proof.mjs'
import { verifyStaticPolicy } from './lib/static-artifact-policy.mjs'
// The private runtime includes ./lib/route-http-contract.mjs and the exact
// co-branded-noindex.conf checked during preflight. Host configuration changes
// remain a separately reviewed prerequisite, never part of a static release.

const root = fileURLToPath(new URL('..', import.meta.url))
const artifact = join(root, '.output/public')
let temporary
try {
  const environment = process.env.NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT
  const policy = releasePolicy(environment)
  const production = environment === 'production'
  const username = process.env.STAGING_BASIC_AUTH_USER ?? ''
  const password = process.env.STAGING_BASIC_AUTH_PASSWORD ?? ''
  if (!production && (Boolean(username) !== Boolean(password) || /[:\r\n]/.test(username) || /[\r\n]/.test(password))) throw new Error('Staging BasicAuth credentials must be set together without unsupported characters')
  const target = production
    ? { user: 'ubuntu', host: '15.204.253.205', root: '/home/solagree/public_html', store: '/home/solagree/website-releases', owner: 'solagree' }
    : { user: 'qa_solagree', host: 'solagree.qamachine.com', root: '/home/qa_solagree/public_html', store: '/home/qa_solagree/website-releases' }
  for (const [variable, expected] of [['SSH_USER', target.user], ['SSH_HOST', target.host], ['REMOTE_PATH', target.root]]) {
    if (process.env[variable] !== undefined && process.env[variable].replace(/\/$/, '') !== expected) throw new Error(`${variable} must match the reviewed ${environment} destination`)
  }
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const inspect = args.includes('--inspect')
  const rollback = args.find(arg => arg.startsWith('--rollback='))?.slice('--rollback='.length)
  if (args.some(arg => arg !== '--dry-run' && arg !== '--inspect' && !/^--rollback=[a-f0-9]{64}$/.test(arg))) throw new Error('unsupported release option; rollback requires a full release id')
  if (!inspect && !rollback) {
    execFileSync(process.execPath, [join(root, 'scripts/verify-release-artifact.mjs')], { stdio: 'inherit' })
    execFileSync(process.execPath, [join(root, 'scripts/verify-sitemap.mjs')], { stdio: 'inherit' })
    const manifestBytes = readFileSync(join(artifact, 'release-manifest.json'))
    const proof = JSON.parse(readFileSync(join(root, '.output', proofName)))
    const source = cleanSource(root)
    // Explicitly pinned ancestor artifacts retain their original source proof.
    if (process.env.STAGING_ARTIFACT_COMMIT && !production) {
      source.commit = process.env.STAGING_ARTIFACT_COMMIT
      source.tree = execFileSync('git', ['rev-parse', `${source.commit}^{tree}`], { cwd: root, encoding: 'utf8' }).trim()
      source.lockSha256 = sha256(execFileSync('git', ['show', `${source.commit}:package-lock.json`], { cwd: root }))
    }
    const manifest = verifyProof(proof, manifestBytes, root, source)
    verifyStaticPolicy(artifact, manifest)
    temporary = mkdtempSync(join(tmpdir(), 'solagree-promotion-'))
    cpSync(artifact, join(temporary, 'artifact'), { recursive: true })
    writeFileSync(join(temporary, proofName), `${JSON.stringify(proof)}\n`, { mode: 0o600 })
    for (const path of runtimeFiles) {
      mkdirSync(join(temporary, 'runtime', path, '..'), { recursive: true })
      cpSync(join(root, path), join(temporary, 'runtime', path))
    }
  }
  if (!production && !dryRun && !inspect) {
    const auth = username ? `user = "${`${username}:${password}`.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"\n` : ''
    const curlArgs = ['-sS', '--connect-timeout', '10', '--max-time', '30', '-o', '/dev/null', '-w', '%{http_code}']
    if (auth) curlArgs.push('--config', '-')
    curlArgs.push(`${policy.siteOrigin}/`)
    let status
    try { status = execFileSync('curl', curlArgs, { input: auth, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim() } catch {
      throw new Error('Staging BasicAuth preflight failed: could not reach the staging site; no files uploaded')
    }
    if (status === '401' || status === '403') throw new Error(`Staging BasicAuth preflight failed: ${username ? 'configured credentials rejected' : 'site requires credentials'}; no files uploaded`)
  }
  const helper = Buffer.from(readFileSync(join(root, 'scripts/lib/release-host.py'))).toString('base64')
  const command = `${target.owner ? `sudo -n -u ${target.owner} ` : ''}python3 -c 'import base64;exec(base64.b64decode("${helper}"))'`
  const remote = request => {
    try {
      return JSON.parse(execFileSync('ssh', ['-o', 'BatchMode=yes', `${target.user}@${target.host}`, command], {
        input: JSON.stringify({ root: target.root, store: target.store, policy, ...request }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['pipe', 'pipe', 'inherit']
      }))
    } catch { throw new Error('remote release validation failed; inspect the error above') }
  }
  const before = remote({ mode: 'inspect' })
  console.log(`Active release: ${before.id ?? 'absent'}; public acceptance: ${before.accepted === true ? 'passed' : 'not recorded'}; reviewed inventory SHA-256: ${before.sha256}`)
  if (process.env.STAGING_TARGET_INVENTORY_FILE) writeFileSync(process.env.STAGING_TARGET_INVENTORY_FILE, `${JSON.stringify(before, null, 2)}\n`, { mode: 0o600 })
  if (!dryRun && !inspect) {
    const expected = process.env.RELEASE_EXPECTED_TARGET_SHA256 ?? (!production ? process.env.STAGING_EXPECTED_TARGET_SHA256 : undefined)
    if (expected !== before.sha256) throw new Error('RELEASE_EXPECTED_TARGET_SHA256 must pin the reviewed active inventory; no files uploaded')
    if ((process.env.RELEASE_TARGET_QUIESCED ?? (!production ? process.env.STAGING_TARGET_QUIESCED : undefined)) !== 'true') throw new Error('target writers must be held; RELEASE_TARGET_QUIESCED=true is required')
    const options = { expected, initialize: process.env.RELEASE_INITIALIZE === 'true', auth: production ? {} : { STAGING_BASIC_AUTH_USER: process.env.STAGING_BASIC_AUTH_USER ?? '', STAGING_BASIC_AUTH_PASSWORD: process.env.STAGING_BASIC_AUTH_PASSWORD ?? '' }, publicCheck: production
      ? { baseUrl: policy.siteOrigin, resolve: `www.solagree.com:443:${target.host}`, insecure: true }
      : { baseUrl: policy.siteOrigin } }
    let result
    if (rollback) result = remote({ ...options, mode: 'rollback', release: rollback })
    else {
      const incoming = remote({ ...options, mode: 'begin' })
      if (!/^[a-f0-9]{32}$/.test(incoming.token) || incoming.path !== `${target.store}/incoming/${incoming.token}`) throw new Error('invalid private upload destination')
      const rsync = ['-az', '--delete', '--chmod=D700,F600']
      if (target.owner) rsync.push(`--rsync-path=sudo -n -u ${target.owner} rsync`)
      rsync.push(`${temporary}/`, `${target.user}@${target.host}:${incoming.path}/`)
      execFileSync('rsync', rsync, { stdio: 'inherit' })
      result = remote({ ...options, mode: 'promote', token: incoming.token })
    }
    console.log(`Activated immutable release ${result.id}; previous ${result.previous ?? 'absent'}; commit ${result.commit}`)
  } else if (!inspect) console.log('Dry run verified; no candidate uploaded or webroot switched.')
} catch (error) {
  console.error(`Release upload refused/failed: ${error.message}`)
  process.exitCode = 1
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true })
}
