import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { artifactFiles, releasePolicy } from '../../scripts/lib/release-artifact.mjs'

const root = new URL('../..', import.meta.url).pathname
export function releaseFixture(environment = 'production') {
  const directory = mkdtempSync(join(tmpdir(), 'solagree-release-'))
  cpSync(join(root, 'scripts'), join(directory, 'scripts'), { recursive: true })
  cpSync(join(root, 'config'), join(directory, 'config'), { recursive: true })
  const output = join(directory, '.output/public')
  const bin = join(directory, 'bin')
  const log = join(directory, 'calls.log')
  mkdirSync(join(output, 'webinars'), { recursive: true })
  mkdirSync(bin)
  const policy = releasePolicy(environment, { NUXT_PUBLIC_GA_MEASUREMENT_ID: 'G-TCGL2PDNNY' })
  const shell = `<!DOCTYPE html><html><head></head><body><div id="__nuxt"></div><script>window.__NUXT__={config:${JSON.stringify(policy)}};</script></body></html>`
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
  executable('rsync', '#!/bin/sh\nprintf "rsync\\n" >> "$TEST_DEPLOY_LOG"\n')
  executable('ssh', '#!/bin/sh\nprintf "ssh\\n" >> "$TEST_DEPLOY_LOG"\ncat >/dev/null\n')
  const env = {
    ...process.env, PATH: `${bin}:${process.env.PATH}`, TEST_DEPLOY_LOG: log,
    NUXT_PUBLIC_SITE_URL: policy.siteOrigin, NUXT_PUBLIC_PORTAL_URL: policy.portalUrl,
    NUXT_PUBLIC_PORTAL_API_BASE_URL: policy.portalApiOrigin, NUXT_PUBLIC_GA_MEASUREMENT_ID: 'G-TCGL2PDNNY',
    NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: environment, STAGING_BASIC_AUTH_USER: '', STAGING_BASIC_AUTH_PASSWORD: ''
  }
  return {
    directory, output, manifest, env, saveManifest, executable,
    deploy(target = environment, options = ['--skip-build', '--dry-run'], override = {}) {
      const result = spawnSync('bash', [`scripts/deploy-${target}.sh`, ...options], {
        cwd: directory, env: { ...env, ...override }, encoding: 'utf8'
      })
      return { ...result, log: existsSync(log) ? readFileSync(log, 'utf8') : '' }
    },
    cleanup() { rmSync(directory, { recursive: true, force: true }) }
  }
}
