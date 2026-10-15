import assert from 'node:assert/strict'
import test from 'node:test'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, chmodSync, symlinkSync, readlinkSync, renameSync } from 'node:fs'
import { join } from 'node:path'
import { releaseFixture } from './fixtures/release-deploy.mjs'
import { artifactFiles } from '../scripts/lib/release-artifact.mjs'

function updateManifest(fixture) {
  fixture.manifest.files = artifactFiles(fixture.output)
  fixture.saveManifest()
}

for (const options of [[], ['--dry-run'], ['--skip-build']]) {
  test(`production refuses without confirmation (${options.join(' ') || 'build'}) before generation or remote calls`, () => {
    const fixture = releaseFixture()
    try {
      const result = fixture.deploy('production', options, { DEPLOY_CONFIRM_PRODUCTION: '' })
      assert.equal(result.status, 1)
      assert.match(result.stderr, /requires --i-confirm-production-deploy/)
      assert.equal(result.log, '')
      assert.doesNotMatch(result.stdout, /Generating/)
    } finally { fixture.cleanup() }
  })
}

test('explicit production flag accepts a reviewed dry run', () => {
  const fixture = releaseFixture()
  try {
    const result = fixture.deploy('production', ['--i-confirm-production-deploy', '--skip-build', '--dry-run'], { DEPLOY_CONFIRM_PRODUCTION: '' })
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.log, /rsync/)
    assert.doesNotMatch(result.log, /ssh/)
  } finally { fixture.cleanup() }
})

for (const id of ['', '   ', '\u00a0', 'G-LOCALTEST']) {
  test(`production analytics requires an explicit, consistent choice (${id || 'empty'})`, () => {
    const fixture = releaseFixture('production', id.trim())
    try {
      const result = fixture.deploy('production', undefined, { ANALYTICS_DISABLED: id.trim() ? 'true' : '', NUXT_PUBLIC_GA_MEASUREMENT_ID: id })
      assert.equal(result.status, 1)
      assert.match(result.stderr, /Production analytics requires|conflicts with a selected GA/)
      assert.equal(result.log, '')
    } finally { fixture.cleanup() }
  })
}

for (const scenario of ['separate', 'invalid', 'empty', 'invalid-phone']) {
  test(`production booking policy rejects ${scenario} before upload`, () => {
    const fixture = releaseFixture()
    try {
      const override = scenario === 'invalid-phone'
        ? { NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_TAJ_PHONE_EVENT_PATH: 'https://other.test/event' }
        : { NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_MEETING_METHOD_MODE: scenario === 'empty' ? '' : scenario }
      const result = fixture.deploy('production', undefined, override)
      assert.equal(result.status, 1)
      assert.match(result.stderr, /booking verification failed/)
      assert.equal(result.log, '')
    } finally { fixture.cleanup() }
  })
}

for (const scenario of ['separate', 'missing-runtime', 'missing-mode', 'duplicate-runtime', 'inconsistent', 'phone-mismatch']) {
  test(`production generated HTML rejects ${scenario}, even with matching manifest hashes`, () => {
    const fixture = releaseFixture()
    try {
      const names = scenario === 'separate' ? ['index.html', '200.html', 'webinars/index.html'] : ['index.html']
      for (const name of names) {
        const path = join(fixture.output, name)
        let html = readFileSync(path, 'utf8')
        if (['separate', 'inconsistent'].includes(scenario)) html = html.replace('"meetingMethodMode":"mixed"', '"meetingMethodMode":"separate"')
        if (scenario === 'missing-runtime') html = html.replace(/<script>[^]*?<\/script>/, '')
        if (scenario === 'missing-mode') html = html.replace('"meetingMethodMode":"mixed"', '"other":"mixed"')
        if (scenario === 'duplicate-runtime') html += '<script>window.__NUXT__.config={meetingMethodMode:"mixed"};</script>'
        if (scenario === 'phone-mismatch') html = html.replace('"tajPhoneEventPath":""', '"tajPhoneEventPath":"initial-consults/taj-phone"')
        writeFileSync(path, html)
      }
      updateManifest(fixture)
      const result = fixture.deploy()
      assert.equal(result.status, 1)
      assert.match(result.stderr, /generated HTML/)
      assert.equal(result.log, '')
    } finally { fixture.cleanup() }
  })
}

test('production approved separate artifact matches the selected phone paths', () => {
  const fixture = releaseFixture()
  try {
    for (const name of ['index.html', '200.html', 'webinars/index.html']) {
      const path = join(fixture.output, name)
      writeFileSync(path, readFileSync(path, 'utf8').replace('"meetingMethodMode":"mixed"', '"meetingMethodMode":"separate"').replace('"tajPhoneEventPath":""', '"tajPhoneEventPath":"initial-consults/taj-phone"'))
    }
    updateManifest(fixture)
    const result = fixture.deploy('production', undefined, {
      NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_MEETING_METHOD_MODE: 'separate',
      PRODUCTION_NATIVE_ACTIVATION_APPROVED: 'true',
      NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_TAJ_PHONE_EVENT_PATH: 'initial-consults/taj-phone'
    })
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.log, /rsync/)
  } finally { fixture.cleanup() }
})

test('production rsync preserves historical Terms and ACME, excludes hidden files and removes previously public metadata', () => {
  const rsync = execFileSync('which', ['rsync'], { encoding: 'utf8' }).trim()
  const fixture = releaseFixture()
  try {
    for (const [base, path, value] of [
      [fixture.target, 'legal/partner-terms/2025-01-01/index.html', 'historical accepted Terms'],
      [fixture.target, '.well-known/acme-challenge/existing', 'live challenge'],
      [fixture.target, '.server-config', 'private server config'],
      [fixture.target, 'release-manifest.json', 'old manifest'],
      [fixture.target, '.htaccess', 'old Apache config'],
      [fixture.output, '.htaccess', 'unexpected build config'],
      [fixture.output, '.private/file', 'hidden artifact'],
      [fixture.output, '.well-known/new-public', 'public discovery']
    ]) {
      mkdirSync(join(base, path, '..'), { recursive: true })
      writeFileSync(join(base, path), value)
    }
    updateManifest(fixture)
    fixture.executable('rsync', `#!${process.execPath}
import { appendFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
const args = process.argv.slice(2)
appendFileSync(process.env.TEST_DEPLOY_LOG, 'rsync ' + args.join(' ') + '\\n')
const local = args.filter(arg => !arg.startsWith('--rsync-path='))
local[local.length - 1] = process.env.TEST_TARGET_ROOT + '/'
const result = spawnSync(${JSON.stringify(rsync)}, local, { stdio: 'inherit' })
process.exit(result.status)
`)
    const result = fixture.deploy('production', ['--skip-build', '--skip-route-check'])
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.log, /--filter=P \/legal\/partner-terms\/\*\*\*/)
    assert.equal(readFileSync(join(fixture.target, 'legal/partner-terms/2025-01-01/index.html'), 'utf8'), 'historical accepted Terms')
    assert.equal(readFileSync(join(fixture.target, '.well-known/acme-challenge/existing'), 'utf8'), 'live challenge')
    assert.equal(readFileSync(join(fixture.target, '.well-known/new-public'), 'utf8'), 'public discovery')
    assert.equal(readFileSync(join(fixture.target, '.server-config'), 'utf8'), 'private server config')
    assert.equal(existsSync(join(fixture.target, 'release-manifest.json')), false)
    assert.equal(existsSync(join(fixture.target, '.htaccess')), false)
    assert.equal(existsSync(join(fixture.target, '.private')), false)
  } finally { fixture.cleanup() }
})

for (const scenario of ['nginx-test', 'existing-includes', 'missing-snippets', 'symlinks', 'insertion-failure', 'snippet-failure', 'reload-failure', 'recovery-failure', 'success']) {
  test(`production nginx snapshot/restore handles ${scenario}`, () => {
    const fixture = releaseFixture()
    try {
      const nginxRoot = join(fixture.directory, 'nginx')
      mkdirSync(nginxRoot)
      const config = join(nginxRoot, 'site.conf')
      const legacy = join(nginxRoot, 'legacy.conf')
      const noindex = join(nginxRoot, 'noindex.conf')
      const includes = scenario === 'existing-includes' ? `    include ${legacy};\n    include ${noindex};\n` : ''
      const original = `server {\n    server_name ${scenario === 'insertion-failure' ? 'other.test' : 'www.solagree.com'};\n${includes}    root /site;\n}\n`
      writeFileSync(config, original)
      chmodSync(config, 0o640)
      if (scenario !== 'missing-snippets') {
        writeFileSync(legacy, 'original legacy snippet')
        writeFileSync(noindex, 'original noindex snippet')
        chmodSync(legacy, 0o600)
      }
      if (scenario === 'symlinks') {
        for (const path of [config, legacy]) {
          renameSync(path, `${path}.original`)
          symlinkSync(path.split('/').at(-1) + '.original', path)
        }
      }
      fixture.executable('sudo', `#!${process.execPath}
import { appendFileSync, existsSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
const args = process.argv.slice(3)
appendFileSync(process.env.TEST_DEPLOY_LOG, JSON.stringify(args) + '\\n')
if (args[0] === 'chown') process.exit(0)
if (args[0] === 'mktemp') args[2] = process.env.TEST_NGINX_ROOT + '/backup.XXXXXX'
if (args[0] === 'nginx' || args[0] === 'systemctl') {
  const marker = process.env.TEST_NGINX_ROOT + '/' + args[0] + '-called'
  const first = !existsSync(marker)
  writeFileSync(marker, 'called')
  const failure = process.env.TEST_NGINX_SCENARIO
  if (args[0] === 'nginx' && failure === 'recovery-failure') process.exit(1)
  if (first && ((args[0] === 'nginx' && ['nginx-test', 'existing-includes', 'missing-snippets', 'symlinks'].includes(failure)) || (args[0] === 'systemctl' && failure === 'reload-failure'))) process.exit(1)
  process.exit(0)
}
const result = spawnSync(args[0], args.slice(1), { stdio: 'inherit' })
process.exit(result.status)
`)
      const result = spawnSync('bash', [join(fixture.directory, 'scripts/lib/install-production-nginx.sh')], {
        env: { ...fixture.env, TEST_NGINX_ROOT: nginxRoot, TEST_NGINX_SCENARIO: scenario,
          REMOTE_OWNER: 'fixture', REMOTE_PATH: fixture.target, REMOTE_NGINX_SITE_CONFIG: config,
          REMOTE_LEGACY_REDIRECTS_SNIPPET: legacy, REMOTE_CO_BRANDED_NOINDEX_SNIPPET: noindex,
          LEGACY_REDIRECTS_SNIPPET_B64: scenario === 'snippet-failure' ? '!invalid' : Buffer.from('new legacy snippet').toString('base64'),
          CO_BRANDED_NOINDEX_SNIPPET_B64: Buffer.from('new noindex snippet').toString('base64') }, encoding: 'utf8'
      })
      assert.equal(result.status, scenario === 'success' ? 0 : scenario === 'insertion-failure' ? 2 : 1, result.stderr)
      const calls = readFileSync(join(fixture.directory, 'calls.log'), 'utf8').trim().split('\n').map(line => JSON.parse(line))
      const replacements = calls.findIndex(args => args[0] === 'tee')
      for (const path of [config, legacy, noindex]) {
        const snapshots = calls.filter(args => args[0] === 'cp' && args[2] === path)
        assert.equal(snapshots.length, scenario === 'missing-snippets' && path !== config ? 0 : 1)
        if (snapshots.length) assert.ok(calls.indexOf(snapshots[0]) < replacements)
      }
      if (scenario === 'success') {
        const installed = readFileSync(config, 'utf8')
        assert.ok(installed.includes(`include ${legacy};`))
        assert.ok(installed.includes(`include ${noindex};`))
        assert.equal(readFileSync(legacy, 'utf8'), 'new legacy snippet')
      } else {
        assert.equal(readFileSync(config, 'utf8'), original)
        assert.equal(statSync(config).mode & 0o777, 0o640)
        if (scenario === 'symlinks') {
          assert.equal(readlinkSync(config), 'site.conf.original')
          assert.equal(readlinkSync(legacy), 'legacy.conf.original')
          assert.equal(readFileSync(`${config}.original`, 'utf8'), original)
          assert.equal(readFileSync(`${legacy}.original`, 'utf8'), 'original legacy snippet')
        }
        if (scenario === 'missing-snippets') {
          assert.equal(existsSync(legacy), false)
          assert.equal(existsSync(noindex), false)
        } else {
          assert.equal(readFileSync(legacy, 'utf8'), 'original legacy snippet')
          assert.equal(readFileSync(noindex, 'utf8'), 'original noindex snippet')
          assert.equal(statSync(legacy).mode & 0o777, 0o600)
        }
        if (scenario === 'recovery-failure') assert.match(result.stderr, /recovery failed; original files retained/)
        else assert.match(result.stderr, /Original nginx files restored and reloaded/)
      }
      assert.equal(existsSync(`${config}.tmp`), false)
      assert.equal(readdirSync(nginxRoot).some(name => name.startsWith('backup.')), scenario === 'recovery-failure')
    } finally { fixture.cleanup() }
  })
}

test('production route probes retain certificate verification', () => {
  const script = readFileSync(new URL('../scripts/deploy-production.sh', import.meta.url), 'utf8')
  assert.doesNotMatch(script, /--insecure|\s-k(?:\s|$)/)
  assert.match(script, /--resolve/)
})
