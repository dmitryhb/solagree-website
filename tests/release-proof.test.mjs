import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { gateCommands } from '../scripts/lib/release-proof.mjs'
import { releaseFixture } from './fixtures/release-deploy.mjs'

for (const scenario of ['missing', 'manifest', 'inventory', 'gates', 'tree', 'lock', 'runtime', 'dirty']) {
  test(`proof ${scenario} refuses before any network or upload`, () => {
    const fixture = releaseFixture('staging')
    try {
      const path = join(fixture.directory, '.output/release-proof.json')
      const proof = JSON.parse(readFileSync(path))
      if (scenario === 'missing') rmSync(path)
      else if (scenario === 'dirty') writeFileSync(join(fixture.directory, 'scripts/uncommitted.mjs'), 'export {}')
      else {
        if (scenario === 'manifest') proof.manifestSha256 = '0'.repeat(64)
        if (scenario === 'inventory') proof.files['200.html'] = '0'.repeat(64)
        if (scenario === 'gates') proof.gates[0].exitCode = 1
        if (scenario === 'tree') proof.tree = '0'.repeat(40)
        if (scenario === 'lock') proof.lockSha256 = '0'.repeat(64)
        if (scenario === 'runtime') proof.runtime['config/nginx/co-branded-noindex.conf'] = '0'.repeat(64)
        writeFileSync(path, JSON.stringify(proof))
      }
      const result = fixture.deploy()
      assert.equal(result.status, 1)
      assert.equal(result.log, '')
    } finally { fixture.cleanup() }
  })
}

for (const failure of ['', 'lint', 'typecheck', 'test', 'test:release-host', 'generate', 'source-drift']) {
  test(`preflight executes fixed commands and ${failure || 'records successful proof'}`, () => {
    const fixture = releaseFixture('staging')
    try {
      fixture.executable('npm', `#!${process.execPath}
import { appendFileSync, writeFileSync } from 'node:fs'
const args = process.argv.slice(2)
appendFileSync(process.env.TEST_DEPLOY_LOG, 'npm ' + args.join(' ') + '\\n')
if (args.includes(process.env.FAIL_GATE)) process.exit(9)
if (process.env.FAIL_GATE === 'source-drift') writeFileSync('scripts/uncommitted.mjs', 'export {}')
`)
      const result = spawnSync(process.execPath, ['scripts/prepare-release.mjs', 'staging'], { cwd: fixture.directory, env: { ...fixture.env, FAIL_GATE: failure }, encoding: 'utf8' })
      const proofPath = join(fixture.directory, '.output/release-proof.json')
      assert.equal(result.status, failure ? 1 : 0, result.stderr)
      assert.equal(existsSync(proofPath), !failure)
      const log = readFileSync(join(fixture.directory, 'calls.log'), 'utf8')
      assert.doesNotMatch(log, /ssh|rsync/)
      if (!failure) assert.deepEqual(JSON.parse(readFileSync(proofPath)).gates.map(gate => gate.command), gateCommands)
      if (failure === 'lint') assert.equal(log.trim(), 'npm run lint')
    } finally { fixture.cleanup() }
  })
}

test('route acceptance cannot be skipped on either deployment target', () => {
  for (const environment of ['staging', 'production']) {
    const fixture = releaseFixture(environment)
    try {
      const result = fixture.deploy(environment, ['--skip-build', '--skip-route-check'])
      assert.equal(result.status, 1)
      assert.match(result.stderr, /Route checks are mandatory/)
      assert.equal(result.log, '')
    } finally { fixture.cleanup() }
  }
})
