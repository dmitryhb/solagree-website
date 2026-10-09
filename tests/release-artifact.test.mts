import assert from 'node:assert/strict'
import { join } from 'node:path'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { releaseFixture } from './fixtures/release-deploy.mjs'

for (const environment of ['staging', 'production']) {
  test(`${environment} valid --skip-build reaches rsync`, () => {
    const fixture = releaseFixture(environment)
    try {
      const result = fixture.deploy()
      assert.equal(result.status, 0, result.stderr)
      assert.match(result.log, /rsync/)
    } finally { fixture.cleanup() }
  })
  for (const field of ['environment', 'siteOrigin', 'portalUrl', 'portalApiOrigin', 'commit', 'ga']) {
    test(`${environment} rejects mismatching manifest ${field} before remote operations`, () => {
      const fixture = releaseFixture(environment)
      try {
        const manifest = { ...fixture.manifest, [field]: field === 'ga' ? { enabled: true, measurementId: 'G-TEST' } : 'wrong' }
        fixture.saveManifest(manifest)
        const result = fixture.deploy()
        assert.equal(result.status, 1)
        assert.match(result.stderr, new RegExp(field))
        assert.equal(result.log, '')
      } finally { fixture.cleanup() }
    })
  }
  test(`${environment} rejects missing manifest before rsync`, () => {
    const fixture = releaseFixture(environment)
    try {
      rmSync(join(fixture.output, 'release-manifest.json'))
      const result = fixture.deploy()
      assert.equal(result.status, 1)
      assert.match(result.stderr, /manifest.*missing/)
      assert.equal(result.log, '')
    } finally { fixture.cleanup() }
  })
  for (const action of ['change', 'add', 'remove']) {
    test(`${environment} rejects ${action}d artifact files`, () => {
      const fixture = releaseFixture(environment)
      try {
        if (action === 'change') writeFileSync(join(fixture.output, '200.html'), 'wrong fallback')
        if (action === 'add') writeFileSync(join(fixture.output, 'extra.html'), 'extra')
        if (action === 'remove') rmSync(join(fixture.output, '200.html'))
        const result = fixture.deploy()
        assert.equal(result.status, 1)
        assert.equal(result.log, '')
      } finally { fixture.cleanup() }
    })
  }
}

test('production rejects staging artifact before rsync', () => {
  const fixture = releaseFixture('staging')
  try {
    const result = fixture.deploy('production', undefined, {
      NUXT_PUBLIC_SITE_URL: 'https://www.solagree.com', NUXT_PUBLIC_PORTAL_URL: 'https://portal.solagree.com', NUXT_PUBLIC_PORTAL_API_BASE_URL: 'https://portal.solagree.com'
    })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /environment/)
    assert.equal(result.log, '')
  } finally { fixture.cleanup() }
})
for (const value of ['', 'https://solagree.qamachine.com', 'https://www.solagree.com/path', 'https://secret:password@www.solagree.com', 'https://www.solagree.com?secret=xyz']) {
  test('production rejects URL override without exposing its contents', () => {
    const fixture = releaseFixture()
    try {
      const result = fixture.deploy('production', undefined, { NUXT_PUBLIC_SITE_URL: value })
      assert.equal(result.status, 1)
      assert.match(result.stderr, /siteOrigin/)
      assert.doesNotMatch(result.stderr, /secret|password|xyz/)
      assert.equal(result.log, '')
    } finally { fixture.cleanup() }
  })
}

test('postgenerate manifest records the artifact identity and hashes', () => {
  const fixture = releaseFixture()
  try {
    rmSync(join(fixture.output, 'release-manifest.json'))
    const result = spawnSync(process.execPath, ['scripts/write-release-manifest.mjs'], { cwd: fixture.directory, env: fixture.env, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
    assert.deepEqual(JSON.parse(readFileSync(join(fixture.output, 'release-manifest.json'), 'utf8')), fixture.manifest)
  } finally { fixture.cleanup() }
})

for (const [field, value] of [
  ['siteUrl', 'https://solagree.qamachine.com'],
  ['portalUrl', 'https://solagree-portal.qamachine.com'],
  ['portalApiBaseUrl', 'https://solagree-portal.qamachine.com'],
  ['gaMeasurementId', 'G-UNEXPECTED'],
  ['deploymentEnvironment', 'staging']
]) {
  test(`manifest creation rejects incorrect generated runtime ${field}`, () => {
    const fixture = releaseFixture()
    try {
      const path = join(fixture.output, '200.html')
      const content = readFileSync(path, 'utf8').replace(new RegExp(`"${field}":"[^"]*"`), `"${field}":"${value}"`)
      writeFileSync(path, content)
      const result = spawnSync(process.execPath, ['scripts/write-release-manifest.mjs'], { cwd: fixture.directory, env: fixture.env, encoding: 'utf8' })
      assert.equal(result.status, 1)
      assert.match(result.stderr, new RegExp(field))
    } finally { fixture.cleanup() }
  })
}

for (const environment of ['staging', 'production']) {
  test(`${environment} explicitly selected GA policy passes skip-build without sending analytics`, () => {
    const fixture = releaseFixture(environment, 'G-LOCALTEST')
    try {
      const result = fixture.deploy()
      assert.equal(result.status, 0, result.stderr)
      assert.match(result.log, /rsync/)
      const disabled = fixture.deploy(environment, undefined, { NUXT_PUBLIC_GA_MEASUREMENT_ID: '', ANALYTICS_DISABLED: 'true' })
      assert.equal(disabled.status, 1)
      assert.match(disabled.stderr, /ga policy/)
    } finally { fixture.cleanup() }
  })
}
