import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { artifactFiles } from '../scripts/lib/release-artifact.mjs'
import { releaseFixture } from './fixtures/release-deploy.mjs'

for (const scenario of ['tracked-template', 'changed-template', 'unknown-hidden', 'symlink-template']) {
  test(`release packaging ${scenario} is resolved before manifest hashing`, () => {
    const fixture = releaseFixture('staging')
    try {
      const apache = join(fixture.output, '.htaccess')
      if (scenario === 'symlink-template') symlinkSync(join(fixture.directory, 'public/.htaccess'), apache)
      else cpSync(join(fixture.directory, 'public/.htaccess'), apache)
      if (scenario === 'changed-template') writeFileSync(apache, 'AuthType Basic\nunknown generated auth')
      if (scenario === 'unknown-hidden') writeFileSync(join(fixture.output, '.auth-secret'), 'unsupported hidden output')
      const result = spawnSync(process.execPath, ['scripts/write-release-manifest.mjs'], { cwd: fixture.directory, env: fixture.env, encoding: 'utf8' })
      assert.equal(result.status, scenario === 'tracked-template' ? 0 : 1, result.stderr)
      if (scenario === 'tracked-template') {
        assert.equal(existsSync(apache), false)
        assert.equal(Object.hasOwn(JSON.parse(readFileSync(join(fixture.output, 'release-manifest.json'))).files, '.htaccess'), false)
        assert.equal(readFileSync(join(fixture.directory, 'public/.htaccess'), 'utf8').includes('DirectoryIndex index.html'), true)
      } else if (scenario === 'unknown-hidden') {
        assert.equal(existsSync(join(fixture.output, '.auth-secret')), true)
        assert.match(result.stderr, /hidden server configuration/)
      } else {
        assert.equal(existsSync(apache), true)
        assert.match(result.stderr, /tracked Apache-only template/)
      }
    } finally { fixture.cleanup() }
  })
}

test('preflight uses the same static policy as upload and refuses unknown hidden output without a proof', () => {
  const fixture = releaseFixture('staging')
  try {
    // All command exits are synthetic successes; the final shared policy must
    // still refuse this complete, hash-consistent but unpublishable inventory.
    writeFileSync(join(fixture.output, '.unknown'), 'not publishable')
    // Rehash using the real manifest writer would itself reject this file.
    fixture.executable('npm', '#!/bin/sh\nexit 0\n')
    // Preserve the genuine artifact verifier by updating the fixture's hashes.
    fixture.manifest.files = artifactFiles(fixture.output)
    fixture.saveManifest()
    const result = spawnSync(process.execPath, ['scripts/prepare-release.mjs', 'staging'], { cwd: fixture.directory, env: fixture.env, encoding: 'utf8' })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /hidden server configuration/)
    assert.equal(existsSync(join(fixture.directory, '.output/release-proof.json')), false)
  } finally { fixture.cleanup() }
})
