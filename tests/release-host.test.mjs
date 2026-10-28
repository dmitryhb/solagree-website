import assert from 'node:assert/strict'
import { cpSync, mkdirSync, readFileSync, readlinkSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { canonical, releaseFixture } from './fixtures/release-deploy.mjs'
import { sha256 } from '../scripts/lib/release-proof.mjs'

for (const scenario of ['missing-proof', 'failed-proof', 'wrong-environment', 'altered-artifact', 'missing-acceptance', 'symlink-entry', 'metadata-symlink']) {
  test(`rollback rejects ${scenario} while preserving current release`, () => {
    const fixture = releaseFixture('staging')
    try {
      const original = fixture.seedTarget()
      const before = readlinkSync(fixture.target)
      const copy = join(fixture.directory, 'target-copy')
      cpSync(join(fixture.store, 'releases', original), copy, { recursive: true })
      const proofPath = join(copy, 'bundle/release-proof.json')
      const proof = JSON.parse(readFileSync(proofPath))
      if (scenario === 'missing-proof') {
        // A metadata-only proof still cannot satisfy the complete gate contract.
        writeFileSync(proofPath, JSON.stringify({ schemaVersion: 1, commit: proof.commit }))
      }
      if (scenario === 'failed-proof') { proof.gates[0].exitCode = 1; writeFileSync(proofPath, JSON.stringify(proof)) }
      if (scenario === 'wrong-environment') {
        const path = join(copy, 'bundle/artifact/release-manifest.json')
        const manifest = JSON.parse(readFileSync(path))
        manifest.environment = 'production'
        writeFileSync(path, JSON.stringify(manifest))
        proof.manifestSha256 = sha256(readFileSync(path))
        writeFileSync(proofPath, JSON.stringify(proof))
      }
      if (scenario === 'altered-artifact') writeFileSync(join(copy, 'bundle/artifact/200.html'), 'tampered')
      const seal = { schemaVersion: 1, public: fixture.inventory(join(copy, 'public')), bundle: fixture.inventory(join(copy, 'bundle')) }
      const id = sha256(canonical(seal))
      writeFileSync(join(copy, 'release.json'), canonical(seal))
      writeFileSync(join(copy, 'accepted.json'), JSON.stringify(scenario === 'missing-acceptance' ? {} : { schemaVersion: 1, id }))
      const destination = join(fixture.store, 'releases', id)
      mkdirSync(destination, { recursive: true })
      cpSync(copy, destination, { recursive: true })
      if (scenario === 'symlink-entry') symlinkSync('/tmp', join(destination, 'public/escape'))
      if (scenario === 'metadata-symlink') {
        const outside = join(fixture.directory, 'target-acceptance.json')
        cpSync(join(destination, 'accepted.json'), outside)
        rmSync(join(destination, 'accepted.json'))
        symlinkSync(outside, join(destination, 'accepted.json'))
      }
      const result = fixture.host({ mode: 'rollback', release: id, expected: fixture.env.RELEASE_EXPECTED_TARGET_SHA256 })
      assert.equal(result.status, 1, result.stderr)
      assert.equal(readlinkSync(fixture.target), before)
      assert.match(result.stderr, /proof|environment|hashes|acceptance|inventory|symlinks|symbolic links/)
    } finally { fixture.cleanup() }
  })
}
