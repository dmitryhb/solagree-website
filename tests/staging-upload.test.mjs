import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readlinkSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { artifactFiles } from '../scripts/lib/release-artifact.mjs'
import { sha256 } from '../scripts/lib/release-proof.mjs'
import { releaseFixture } from './fixtures/release-deploy.mjs'

function run(fixture, env = {}, options = []) {
  const result = spawnSync(process.execPath, ['scripts/staging-upload.mjs', ...options], { cwd: fixture.directory, env: { ...fixture.env, ...env }, encoding: 'utf8' })
  return { ...result, log: existsSync(join(fixture.directory, 'calls.log')) ? readFileSync(join(fixture.directory, 'calls.log'), 'utf8') : '' }
}
function updateManifest(fixture) { fixture.manifest.files = artifactFiles(fixture.output); fixture.saveManifest() }
function pin(fixture) { return JSON.parse(fixture.host({ mode: 'inspect' }).stdout).sha256 }

for (const environment of ['staging', 'production']) {
  test(`${environment} first bootstrap is explicit and switches to a sealed release`, () => {
    const fixture = releaseFixture(environment)
    try {
      const denied = fixture.deploy(environment, ['--skip-build'], { RELEASE_INITIALIZE: '' })
      assert.equal(denied.status, 1)
      assert.match(denied.stderr, /explicit first-release initialization/)
      assert.equal(existsSync(fixture.target), false)
      const accepted = fixture.deploy(environment, ['--skip-build'])
      assert.equal(accepted.status, 0, accepted.stderr)
      assert.match(readlinkSync(fixture.target), /releases\/[a-f0-9]{64}\/public$/)
      assert.match(accepted.log, /--delete.*incoming\//)
      assert.doesNotMatch(accepted.log, /--delete.*public_html/)
    } finally { fixture.cleanup() }
  })
}

test('promotion preserves hidden config, remote-only files, legal history and old assets and removes obsolete managed HTML', () => {
  const fixture = releaseFixture('staging')
  try {
    mkdirSync(join(fixture.output, 'obsolete'), { recursive: true })
    writeFileSync(join(fixture.output, 'obsolete/index.html'), readFileSync(join(fixture.output, 'index.html')))
    updateManifest(fixture)
    const previous = fixture.seedTarget({ '.htaccess': 'AuthType Basic\nprotected', '.well-known/token': 'keep hidden', 'legal/history/old.pdf': 'old terms', 'legal/partner-terms/v1/manifest.json': 'old metadata', 'remote-only.txt': 'keep unrelated', '_nuxt/old.hash.js': 'lazy old' })
    rmSync(join(fixture.output, 'obsolete'), { recursive: true })
    mkdirSync(join(fixture.output, 'legal/new'), { recursive: true })
    writeFileSync(join(fixture.output, 'legal/new/index.html'), 'new approved Terms')
    updateManifest(fixture)
    const result = run(fixture)
    assert.equal(result.status, 0, result.stderr)
    for (const [path, content] of Object.entries({ '.htaccess': 'AuthType Basic\nprotected', '.well-known/token': 'keep hidden', 'legal/history/old.pdf': 'old terms', 'legal/partner-terms/v1/manifest.json': 'old metadata', 'remote-only.txt': 'keep unrelated', '_nuxt/old.hash.js': 'lazy old', 'legal/new/index.html': 'new approved Terms' })) assert.equal(readFileSync(join(fixture.target, path), 'utf8'), content)
    assert.equal(existsSync(join(fixture.target, 'obsolete/index.html')), false)
    assert.equal(existsSync(join(fixture.store, 'releases', previous, 'public/obsolete/index.html')), true)
  } finally { fixture.cleanup() }
})

for (const path of ['legal/history/old.pdf', 'legal/partner-terms/v1/index.html', 'legal/partner-terms/v1/manifest.json', '_nuxt/old.hash.js']) {
  test(`conflicting preserved ${path} fails with previous site intact`, () => {
    const fixture = releaseFixture('staging')
    try {
      fixture.seedTarget({ [path]: 'published' })
      const before = readlinkSync(fixture.target)
      mkdirSync(join(fixture.output, path, '..'), { recursive: true })
      writeFileSync(join(fixture.output, path), 'changed')
      updateManifest(fixture)
      const result = run(fixture)
      assert.equal(result.status, 1)
      assert.match(result.stderr, /protected legal history or retained asset/)
      assert.equal(readlinkSync(fixture.target), before)
      assert.equal(readFileSync(join(fixture.target, path), 'utf8'), 'published')
    } finally { fixture.cleanup() }
  })
}

test('generated legal HTML and payloads update while approved Terms remain immutable', () => {
  const fixture = releaseFixture('staging')
  try {
    const appHtml = readFileSync(join(fixture.output, 'index.html'), 'utf8')
    for (const route of ['terms-of-service', 'privacy-policy', 'accessibility']) {
      mkdirSync(join(fixture.output, 'legal', route), { recursive: true })
      writeFileSync(join(fixture.output, 'legal', route, 'index.html'), appHtml.replace('</body>', 'old managed page</body>'))
      writeFileSync(join(fixture.output, 'legal', route, '_payload.json'), '{"old":true}')
    }
    writeFileSync(join(fixture.output, 'legal/index.html'), '<html>old redirect</html>')
    updateManifest(fixture)
    fixture.seedTarget({ 'legal/partner-terms/v1/index.html': 'approved Terms' })
    for (const route of ['terms-of-service', 'privacy-policy', 'accessibility']) {
      mkdirSync(join(fixture.output, 'legal', route), { recursive: true })
      writeFileSync(join(fixture.output, 'legal', route, 'index.html'), readFileSync(join(fixture.output, 'index.html')))
      writeFileSync(join(fixture.output, 'legal', route, '_payload.json'), '{"new":true}')
    }
    writeFileSync(join(fixture.output, 'legal/index.html'), '<html>redirect</html>')
    updateManifest(fixture)
    const result = run(fixture)
    assert.equal(result.status, 0, result.stderr)
    assert.equal(readFileSync(join(fixture.target, 'legal/privacy-policy/_payload.json'), 'utf8'), '{"new":true}')
    assert.equal(readFileSync(join(fixture.target, 'legal/partner-terms/v1/index.html'), 'utf8'), 'approved Terms')
  } finally { fixture.cleanup() }
})

for (const scenario of ['missing-pin', 'stale-pin', 'no-hold', 'legacy-directory', 'symlink-escape', 'target-override', 'hidden-artifact']) {
  test(`unsafe ${scenario} refuses before upload`, () => {
    const fixture = releaseFixture('staging')
    try {
      const env = {}
      if (scenario === 'missing-pin') env.RELEASE_EXPECTED_TARGET_SHA256 = ''
      if (scenario === 'stale-pin') env.RELEASE_EXPECTED_TARGET_SHA256 = '0'.repeat(64)
      if (scenario === 'no-hold') env.RELEASE_TARGET_QUIESCED = ''
      if (scenario === 'legacy-directory') { mkdirSync(fixture.target); writeFileSync(join(fixture.target, '.htaccess'), 'protected'); env.RELEASE_EXPECTED_TARGET_SHA256 = pin(fixture) }
      if (scenario === 'symlink-escape') symlinkSync('/tmp', fixture.target)
      if (scenario === 'target-override') env.SSH_HOST = 'production.example'
      if (scenario === 'hidden-artifact') { writeFileSync(join(fixture.output, '.htaccess'), 'override'); updateManifest(fixture) }
      const result = run(fixture, env)
      assert.equal(result.status, 1)
      assert.doesNotMatch(result.log, /rsync/)
      if (scenario === 'legacy-directory') assert.equal(readFileSync(join(fixture.target, '.htaccess'), 'utf8'), 'protected')
    } finally { fixture.cleanup() }
  })
}

for (const scenario of ['upload-failure', 'corrupt-upload', 'active-drift']) {
  test(`${scenario} preserves the previous active release`, () => {
    const fixture = releaseFixture('staging')
    try {
      fixture.seedTarget()
      const before = readlinkSync(fixture.target)
      const env = scenario === 'upload-failure' ? { TEST_UPLOAD_FAILURE: 'true' } : scenario === 'corrupt-upload' ? { TEST_CORRUPT_UPLOAD: 'true' } : { TEST_TARGET_DRIFT: 'true' }
      const result = run(fixture, env)
      assert.equal(result.status, 1)
      assert.equal(readlinkSync(fixture.target), before)
    } finally { fixture.cleanup() }
  })
}

test('dry run validates proof and inventories the target without any remote writes or rsync', () => {
  const fixture = releaseFixture('staging')
  try {
    const result = run(fixture, { RELEASE_EXPECTED_TARGET_SHA256: '', RELEASE_TARGET_QUIESCED: '' }, ['--dry-run'])
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /inventory SHA-256/)
    assert.equal(existsSync(fixture.target), false)
    assert.equal(existsSync(fixture.store), false)
    assert.doesNotMatch(result.log, /rsync/)
  } finally { fixture.cleanup() }
})

test('rollback dry-run verifies the retained proof without local output and rejects an unknown release', () => {
  const fixture = releaseFixture('staging')
  try {
    const release = fixture.seedTarget()
    const before = readlinkSync(fixture.target)
    rmSync(join(fixture.directory, '.output'), { recursive: true })
    const valid = run(fixture, {}, ['--dry-run', `--rollback=${release}`])
    assert.equal(valid.status, 0, valid.stderr)
    const unknown = run(fixture, {}, ['--dry-run', `--rollback=${'0'.repeat(64)}`])
    assert.equal(unknown.status, 1)
    assert.doesNotMatch(unknown.log, /rsync/)
    assert.equal(readlinkSync(fixture.target), before)
  } finally { fixture.cleanup() }
})

test('separate Phone/Zoom artifact requires explicit native activation approval', () => {
  const fixture = releaseFixture('staging')
  try {
    for (const name of ['index.html', '200.html', 'webinars/index.html']) {
      const path = join(fixture.output, name)
      writeFileSync(path, readFileSync(path, 'utf8').replace('"meetingMethodMode":"mixed"', '"meetingMethodMode":"separate"'))
    }
    updateManifest(fixture)
    const refused = run(fixture, {}, ['--dry-run'])
    assert.equal(refused.status, 1)
    assert.match(refused.stderr, /native activation approval/)
    assert.equal(refused.log, '')
    assert.equal(run(fixture, { STAGING_NATIVE_ACTIVATION_APPROVED: 'true' }, ['--dry-run']).status, 0)
    const promoted = run(fixture, { STAGING_NATIVE_ACTIVATION_APPROVED: 'true' })
    assert.equal(promoted.status, 0, promoted.stderr)
  } finally { fixture.cleanup() }
})

for (const scenario of ['index-separate', 'webinars-separate', 'missing-runtime', 'missing-application-shell', 'missing-mode', 'duplicate-runtime', 'invalid-mode', 'inconsistent-with-approval']) {
  test(`generated HTML ${scenario} refuses before SSH even with valid hashes and synthetic proof`, () => {
    const fixture = releaseFixture('staging')
    try {
      const path = join(fixture.output, scenario === 'webinars-separate' ? 'webinars/index.html' : 'index.html')
      let html = readFileSync(path, 'utf8')
      if (scenario.includes('separate') || scenario === 'inconsistent-with-approval') html = html.replace('"meetingMethodMode":"mixed"', '"meetingMethodMode":"separate"')
      if (scenario === 'missing-runtime') html = html.replace(/<script>[^]*?<\/script>/, '')
      if (scenario === 'missing-application-shell') html = '<html>unexpected static page</html>'
      if (scenario === 'missing-mode') html = html.replace('"meetingMethodMode":"mixed"', '"otherField":"mixed"')
      if (scenario === 'duplicate-runtime') html = html.replace('</body>', '<script>window.__NUXT__.config={"meetingMethodMode":"mixed"};</script></body>')
      if (scenario === 'invalid-mode') html = html.replace('"meetingMethodMode":"mixed"', '"meetingMethodMode":"unexpected"')
      writeFileSync(path, html)
      updateManifest(fixture)
      const result = run(fixture, scenario === 'inconsistent-with-approval' ? { STAGING_NATIVE_ACTIVATION_APPROVED: 'true' } : {})
      assert.equal(result.status, 1)
      assert.match(result.stderr, /generated HTML.*(?:runtime config|meetingMethodMode)/)
      assert.equal(result.log, '')
    } finally { fixture.cleanup() }
  })
}

test('archived staging artifact requires pinned commit, manifest checksum and matching original proof', () => {
  const fixture = releaseFixture('staging')
  try {
    execFileSync('git', ['-C', fixture.directory, '-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '--allow-empty', '-qm', 'later tooling'])
    const env = { STAGING_ARTIFACT_COMMIT: fixture.manifest.commit, STAGING_ARTIFACT_MANIFEST_SHA256: sha256(readFileSync(join(fixture.output, 'release-manifest.json'))) }
    assert.equal(run(fixture, {}, ['--dry-run']).status, 1)
    assert.equal(run(fixture, { ...env, STAGING_ARTIFACT_MANIFEST_SHA256: '0'.repeat(64) }, ['--dry-run']).status, 1)
    const accepted = run(fixture, env, ['--dry-run'])
    assert.equal(accepted.status, 0, accepted.stderr)
  } finally { fixture.cleanup() }
})

for (const path of ['remote-only.txt', 'images/remote-only.svg']) {
  test(`promotion refuses a differing first claim of remote-only ${path}`, () => {
    const fixture = releaseFixture('staging')
    try {
      fixture.seedTarget({ [path]: 'host-owned bytes' })
      const before = readlinkSync(fixture.target)
      mkdirSync(join(fixture.output, path, '..'), { recursive: true })
      writeFileSync(join(fixture.output, path), 'new generated bytes')
      updateManifest(fixture)
      const result = run(fixture)
      assert.equal(result.status, 1)
      assert.match(result.stderr, /remote-only file.*ownership takeover/)
      assert.equal(readlinkSync(fixture.target), before)
      assert.equal(readFileSync(join(fixture.target, path), 'utf8'), 'host-owned bytes')
    } finally { fixture.cleanup() }
  })
}

test('an identical remote-only first claim can become managed and then receive a legitimate update', () => {
  const fixture = releaseFixture('staging')
  try {
    fixture.seedTarget({ 'shared.txt': 'same bytes' })
    writeFileSync(join(fixture.output, 'shared.txt'), 'same bytes')
    updateManifest(fixture)
    const claimed = run(fixture)
    assert.equal(claimed.status, 0, claimed.stderr)
    fixture.env.RELEASE_EXPECTED_TARGET_SHA256 = pin(fixture)
    writeFileSync(join(fixture.output, 'shared.txt'), 'managed update')
    updateManifest(fixture)
    const updated = run(fixture)
    assert.equal(updated.status, 0, updated.stderr)
    assert.equal(readFileSync(join(fixture.target, 'shared.txt'), 'utf8'), 'managed update')
  } finally { fixture.cleanup() }
})

for (const managed of [false, true]) {
  test(`rollback ${managed ? 'restores a legitimately managed file' : 'refuses a differing remote-only first claim'}`, () => {
    const fixture = releaseFixture('staging')
    try {
      writeFileSync(join(fixture.output, 'shared.txt'), 'older generated bytes')
      updateManifest(fixture)
      const older = fixture.seedTarget()
      rmSync(fixture.target)
      if (managed) writeFileSync(join(fixture.output, 'shared.txt'), 'current generated bytes')
      else rmSync(join(fixture.output, 'shared.txt'))
      updateManifest(fixture)
      fixture.seedTarget(managed ? {} : { 'shared.txt': 'current host-owned bytes' })
      const before = readlinkSync(fixture.target)
      const result = fixture.deploy('staging', [`--rollback=${older}`])
      assert.equal(result.status, managed ? 0 : 1, result.stderr)
      if (managed) assert.equal(readFileSync(join(fixture.target, 'shared.txt'), 'utf8'), 'older generated bytes')
      else {
        assert.match(result.stderr, /remote-only file.*ownership takeover/)
        assert.equal(readlinkSync(fixture.target), before)
        assert.equal(readFileSync(join(fixture.target, 'shared.txt'), 'utf8'), 'current host-owned bytes')
      }
    } finally { fixture.cleanup() }
  })
}
