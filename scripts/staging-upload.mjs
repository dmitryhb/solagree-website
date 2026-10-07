import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const artifact = join(root, '.output/public')
const protectedPath = path => path.split('/').some(part => part.startsWith('.'))
const immutablePath = path => path.startsWith('legal/')

function verifyMeetingModes(manifest) {
  const modes = new Set()
  for (const path of Object.keys(manifest.files).filter(path => path.endsWith('.html'))) {
    const html = readFileSync(join(artifact, path), 'utf8')
    const assignments = [...html.matchAll(/window\.__NUXT__\.config\s*=\s*([^]*?)<\/script>/g)]
    // Standalone legal documents have no Nuxt runtime. Application shells must have exactly one.
    const applicationShell = /id\s*=\s*["']__nuxt["']|window\.__NUXT__|\/_nuxt\//.test(html)
    if (immutablePath(path) && !applicationShell && assignments.length === 0) continue
    if (assignments.length !== 1) throw new Error(`generated HTML ${path} must have exactly one Nuxt runtime config`)
    const values = [...assignments[0][1].matchAll(/(?:"meetingMethodMode"|meetingMethodMode):"([^"]+)"/g)]
    if (values.length !== 1 || !['mixed', 'separate'].includes(values[0][1])) {
      throw new Error(`generated HTML ${path} is missing an unambiguous Initial Consult meetingMethodMode`)
    }
    modes.add(values[0][1])
  }
  if (modes.size !== 1) throw new Error('generated HTML has inconsistent Initial Consult meetingMethodMode values')
  if (modes.has('separate') && process.env.STAGING_NATIVE_ACTIVATION_APPROVED !== 'true') {
    throw new Error('staging artifact must retain mixed Initial Consult mode; separate mode requires explicit native activation approval')
  }
}

try {
  execFileSync(process.execPath, [join(root, 'scripts/verify-release-artifact.mjs')], { stdio: 'inherit' })
  const dryRun = process.argv.includes('--dry-run')
  const target = {
    user: process.env.SSH_USER ?? 'qa_solagree',
    host: process.env.SSH_HOST ?? 'solagree.qamachine.com',
    root: (process.env.REMOTE_PATH ?? '/home/qa_solagree/public_html/').replace(/\/$/, '')
  }
  if (target.user !== 'qa_solagree' || target.host !== 'solagree.qamachine.com' || target.root !== '/home/qa_solagree/public_html') {
    throw new Error('staging destination must be the reviewed qa_solagree staging webroot')
  }
  const manifest = JSON.parse(readFileSync(join(artifact, 'release-manifest.json'), 'utf8'))
  verifyMeetingModes(manifest)
  // Server configuration never belongs to the static artifact upload.
  for (const path of Object.keys(manifest.files)) {
    if (!protectedPath(path) && /\.(?:conf|ini|php)$/i.test(path)) throw new Error('artifact contains server configuration or executable files')
  }
  const helper = readFileSync(join(root, 'scripts/lib/staging-target.py'), 'utf8')
  const remote = request => JSON.parse(execFileSync('ssh', ['-o', 'BatchMode=yes', `${target.user}@${target.host}`, `python3 - ${Buffer.from(JSON.stringify({ root: target.root, ...request })).toString('base64')}`], { input: helper, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }))
  const before = remote({ mode: 'inventory' })
  console.log(`Staging target inventory SHA-256: ${before.sha256}`)
  for (const [path, hash] of Object.entries(before.files)) {
    if (immutablePath(path) && manifest.files[path] && manifest.files[path] !== hash) throw new Error('existing legal artifact differs; immutable Terms/history cannot be overwritten')
  }
  for (const directory of before.directories) {
    if (manifest.files[directory]) throw new Error('artifact file collides with a target directory')
  }
  for (const path of Object.keys(manifest.files)) {
    const parts = path.split('/')
    for (let i = 1; i < parts.length; i++) {
      if (before.files[parts.slice(0, i).join('/')]) throw new Error('artifact directory collides with a target file')
    }
  }
  if (process.env.STAGING_TARGET_INVENTORY_FILE) writeFileSync(process.env.STAGING_TARGET_INVENTORY_FILE, `${JSON.stringify(before, null, 2)}\n`, { mode: 0o600 })
  if (!dryRun) {
    if (process.env.STAGING_EXPECTED_TARGET_SHA256 !== before.sha256) throw new Error('STAGING_EXPECTED_TARGET_SHA256 must pin the reviewed target inventory; no files uploaded')
    if (process.env.STAGING_TARGET_QUIESCED !== 'true') throw new Error('target writers must be held; set STAGING_TARGET_QUIESCED=true after maintenance hold')
    const backup = `/home/qa_solagree/website-backups/${Date.now()}-${before.sha256.slice(0, 12)}`
    const saved = remote({ mode: 'backup', expected: before.sha256, backup })
    console.log(`Verified private staging backup: ${saved.backup}`)
    if (remote({ mode: 'inventory' }).sha256 !== before.sha256) throw new Error('target changed after backup; no files uploaded')
  }
  const args = ['-az', '--delay-updates', '--exclude=.*']
  execFileSync(process.execPath, [join(root, 'scripts/verify-release-artifact.mjs')], { stdio: 'inherit' })
  verifyMeetingModes(manifest)
  if (dryRun) args.push('--dry-run')
  args.push(`${artifact}/`, `${target.user}@${target.host}:${target.root}/`)
  execFileSync('rsync', args, { stdio: 'inherit' })
  if (!dryRun) {
    const after = remote({ mode: 'inventory' })
    const expected = { ...manifest.files, 'release-manifest.json': createHash('sha256').update(readFileSync(join(artifact, 'release-manifest.json'))).digest('hex') }
    for (const [path, hash] of Object.entries(before.files)) {
      if ((protectedPath(path) || !expected[path] || immutablePath(path)) && after.files[path] !== hash) throw new Error('target preservation verification failed; hold traffic and use the verified backup')
    }
    for (const [path, hash] of Object.entries(expected)) {
      if (!protectedPath(path) && after.files[path] !== hash) throw new Error('uploaded artifact verification failed; hold traffic and use the verified backup')
    }
    for (const directory of before.directories) {
      if (!after.directories.includes(directory)) throw new Error('target directory preservation verification failed')
    }
    console.log(`Full artifact verified; protected and remote-only files preserved (${Object.keys(expected).filter(path => !protectedPath(path)).length} uploaded files; hidden server configuration excluded).`)
  }
} catch (error) {
  console.error(`Staging upload refused/failed: ${error.message}`)
  process.exitCode = 1
}
