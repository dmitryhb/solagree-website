import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { manifestName, releasePolicy, sourceCommit, verifyManifest } from './lib/release-artifact.mjs'

try {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const expected = releasePolicy(process.env.NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT)
  // Production deployment must explicitly choose enabled or disabled analytics.
  // Use HIR-619's normalized policy, including Unicode/whitespace-only empty IDs.
  if (process.argv.includes('--require-explicit-analytics')) {
    const disabled = process.env.ANALYTICS_DISABLED === 'true'
    if (!expected.ga.enabled && !disabled) throw new Error('Production analytics requires NUXT_PUBLIC_GA_MEASUREMENT_ID or ANALYTICS_DISABLED=true')
    if (expected.ga.enabled && disabled) throw new Error('ANALYTICS_DISABLED=true conflicts with a selected GA measurement ID')
  }
  if (process.argv.includes('--policy-only')) {
    console.log(`Deployment policy verified for ${expected.environment}`)
  } else {
    const directory = join(root, '.output/public')
    let manifest
    try { manifest = JSON.parse(readFileSync(join(directory, manifestName), 'utf8')) } catch {
      throw new Error('release-manifest.json is missing or invalid; generate an artifact for the target environment')
    }
    let commit = sourceCommit(root)
    if (expected.environment === 'staging' && process.env.STAGING_ARTIFACT_COMMIT) {
      commit = process.env.STAGING_ARTIFACT_COMMIT
      if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('STAGING_ARTIFACT_COMMIT must be a full commit SHA')
      const hash = createHash('sha256').update(readFileSync(join(directory, manifestName))).digest('hex')
      if (!/^[a-f0-9]{64}$/.test(process.env.STAGING_ARTIFACT_MANIFEST_SHA256 ?? '') || hash !== process.env.STAGING_ARTIFACT_MANIFEST_SHA256) {
        throw new Error('explicit staging artifact requires its exact manifest SHA-256')
      }
      try { execFileSync('git', ['-C', root, 'merge-base', '--is-ancestor', commit, 'HEAD'], { stdio: 'ignore' }) } catch {
        throw new Error('explicit staging artifact commit must be an ancestor of the current source commit')
      }
    } else if (process.env.STAGING_ARTIFACT_MANIFEST_SHA256 && expected.environment === 'staging') {
      throw new Error('STAGING_ARTIFACT_COMMIT is required with a manifest SHA-256')
    }
    verifyManifest(manifest, expected, commit, directory)
    console.log(`Release artifact verified for ${expected.environment} at commit ${manifest.commit}`)
  }
} catch (error) {
  console.error(`Release artifact verification failed: ${error.message}`)
  process.exitCode = 1
}
