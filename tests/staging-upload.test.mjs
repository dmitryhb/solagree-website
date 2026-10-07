import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { artifactFiles } from '../scripts/lib/release-artifact.mjs'
import { releaseFixture } from './fixtures/release-deploy.mjs'

function run(fixture, env = {}, dryRun = false) {
  const result = spawnSync(process.execPath, ['scripts/staging-upload.mjs', ...(dryRun ? ['--dry-run'] : [])], { cwd: fixture.directory, env: { ...fixture.env, ...env }, encoding: 'utf8' })
  return { ...result, log: existsSync(join(fixture.directory, 'calls.log')) ? readFileSync(join(fixture.directory, 'calls.log'), 'utf8') : '' }
}
function pin(fixture) {
  const request = Buffer.from(JSON.stringify({ root: fixture.target, mode: 'inventory' })).toString('base64')
  return JSON.parse(execFileSync('python3', ['-', request], { input: readFileSync(join(fixture.directory, 'scripts/lib/staging-target.py')), encoding: 'utf8' })).sha256
}
function updateManifest(fixture) {
  fixture.manifest.files = artifactFiles(fixture.output)
  fixture.saveManifest()
}

test('full local upload retains BasicAuth, hidden directories, historical Terms and remote-only assets with a verified private backup', () => {
  const fixture = releaseFixture('staging')
  try {
    mkdirSync(join(fixture.target, 'legal/old'), { recursive: true })
    mkdirSync(join(fixture.target, '.well-known'), { recursive: true })
    writeFileSync(join(fixture.target, '.htaccess'), 'AuthType Basic\nprotected')
    writeFileSync(join(fixture.target, '.well-known/token'), 'keep hidden')
    writeFileSync(join(fixture.target, 'legal/old/index.html'), 'historical Terms')
    writeFileSync(join(fixture.target, 'remote-only.txt'), 'keep unrelated')
    writeFileSync(join(fixture.output, '.htaccess'), 'unprotected build config')
    mkdirSync(join(fixture.output, 'legal/new'), { recursive: true })
    writeFileSync(join(fixture.output, 'legal/new/index.html'), 'new approved Terms')
    updateManifest(fixture)
    const before = pin(fixture)
    const result = run(fixture, { STAGING_EXPECTED_TARGET_SHA256: before })
    assert.equal(result.status, 0, result.stderr)
    assert.equal(readFileSync(join(fixture.target, '.htaccess'), 'utf8'), 'AuthType Basic\nprotected')
    assert.equal(readFileSync(join(fixture.target, 'remote-only.txt'), 'utf8'), 'keep unrelated')
    assert.equal(readFileSync(join(fixture.target, '.well-known/token'), 'utf8'), 'keep hidden')
    assert.equal(readFileSync(join(fixture.target, 'legal/old/index.html'), 'utf8'), 'historical Terms')
    assert.equal(readFileSync(join(fixture.target, 'legal/new/index.html'), 'utf8'), 'new approved Terms')
    const backup = join(`${fixture.target}-backups`, readdirSync(`${fixture.target}-backups`)[0])
    assert.equal(JSON.parse(readFileSync(join(backup, 'inventory.json'))).sha256, before)
    assert.equal(readFileSync(join(backup, 'public/.htaccess'), 'utf8'), 'AuthType Basic\nprotected')
    assert.match(result.log, /--delay-updates --exclude=\.\*/)
    assert.doesNotMatch(result.log, /--delete|nginx/)
  } finally { fixture.cleanup() }
})

for (const scenario of ['missing-pin', 'stale-pin', 'backup-drift', 'no-hold', 'terms-conflict', 'symlink', 'file-directory-conflict', 'target-override']) {
  test(`unsafe ${scenario} refuses before backup or rsync`, () => {
    const fixture = releaseFixture('staging')
    try {
      const env = {}
      if (scenario === 'missing-pin') env.STAGING_EXPECTED_TARGET_SHA256 = ''
      if (scenario === 'stale-pin') writeFileSync(join(fixture.target, 'new.txt'), 'external write')
      if (scenario === 'backup-drift') env.TEST_TARGET_DRIFT = 'true'
      if (scenario === 'no-hold') env.STAGING_TARGET_QUIESCED = ''
      if (scenario === 'terms-conflict') {
        for (const folder of [fixture.target, fixture.output]) mkdirSync(join(folder, 'legal/old'), { recursive: true })
        writeFileSync(join(fixture.target, 'legal/old/index.html'), 'published')
        writeFileSync(join(fixture.output, 'legal/old/index.html'), 'changed')
        updateManifest(fixture)
        env.STAGING_EXPECTED_TARGET_SHA256 = pin(fixture)
      }
      if (scenario === 'symlink') symlinkSync('/tmp', join(fixture.target, 'escape'))
      if (scenario === 'file-directory-conflict') mkdirSync(join(fixture.target, 'index.html'))
      if (scenario === 'target-override') env.SSH_HOST = 'production.example'
      const result = run(fixture, env)
      assert.equal(result.status, 1)
      assert.doesNotMatch(result.log, /rsync/)
      assert.equal(existsSync(`${fixture.target}-backups`), false)
    } finally { fixture.cleanup() }
  })
}

test('dry-run inventories the target and writes no backup or uploaded files', () => {
  const fixture = releaseFixture('staging')
  try {
    const result = run(fixture, { STAGING_EXPECTED_TARGET_SHA256: '', STAGING_TARGET_QUIESCED: '' }, true)
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /target inventory SHA-256/)
    assert.deepEqual(readdirSync(fixture.target), [])
    assert.equal(existsSync(`${fixture.target}-backups`), false)
    assert.match(result.log, /--dry-run/)
  } finally { fixture.cleanup() }
})

test('preservation failure retains the verified backup and reports a traffic hold', () => {
  const fixture = releaseFixture('staging')
  try {
    writeFileSync(join(fixture.target, '.htaccess'), 'protected')
    const result = run(fixture, { STAGING_EXPECTED_TARGET_SHA256: pin(fixture), TEST_PROTECTED_DRIFT: 'true' })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /preservation verification failed; hold traffic/)
    const backup = join(`${fixture.target}-backups`, readdirSync(`${fixture.target}-backups`)[0])
    assert.equal(readFileSync(join(backup, 'public/.htaccess'), 'utf8'), 'protected')
  } finally { fixture.cleanup() }
})

test('separate Phone/Zoom artifact refuses without explicit native activation approval', () => {
  const fixture = releaseFixture('staging')
  try {
    const path = join(fixture.output, '200.html')
    writeFileSync(path, readFileSync(path, 'utf8').replace('"meetingMethodMode":"mixed"', '"meetingMethodMode":"separate"'))
    updateManifest(fixture)
    const refused = run(fixture, {}, true)
    assert.equal(refused.status, 1)
    assert.match(refused.stderr, /native activation approval/)
    assert.equal(refused.log, '')
    const approved = run(fixture, { STAGING_NATIVE_ACTIVATION_APPROVED: 'true' }, true)
    assert.equal(approved.status, 0, approved.stderr)
  } finally { fixture.cleanup() }
})

test('pinned archived artifact is accepted across a later commit, only with its exact manifest checksum', () => {
  const fixture = releaseFixture('staging')
  try {
    execFileSync('git', ['-C', fixture.directory, '-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '--allow-empty', '-qm', 'later tooling'])
    const env = { STAGING_ARTIFACT_COMMIT: fixture.manifest.commit, STAGING_ARTIFACT_MANIFEST_SHA256: createHash('sha256').update(readFileSync(join(fixture.output, 'release-manifest.json'))).digest('hex') }
    assert.equal(run(fixture, {}, true).status, 1)
    assert.equal(run(fixture, { ...env, STAGING_ARTIFACT_MANIFEST_SHA256: '0'.repeat(64) }, true).status, 1)
    const accepted = run(fixture, env, true)
    assert.equal(accepted.status, 0, accepted.stderr)
  } finally { fixture.cleanup() }
})
