import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { manifestName, releasePolicy, sourceCommit, verifyManifest } from './lib/release-artifact.mjs'

try {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const expected = releasePolicy(process.env.NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT)
  if (process.argv.includes('--policy-only')) {
    console.log(`Deployment policy verified for ${expected.environment}`)
  } else {
    const directory = join(root, '.output/public')
    let manifest
    try { manifest = JSON.parse(readFileSync(join(directory, manifestName), 'utf8')) } catch {
      throw new Error('release-manifest.json is missing or invalid; generate an artifact for the target environment')
    }
    verifyManifest(manifest, expected, sourceCommit(root), directory)
    console.log(`Release artifact verified for ${expected.environment} at commit ${manifest.commit}`)
  }
} catch (error) {
  console.error(`Release artifact verification failed: ${error.message}`)
  process.exitCode = 1
}
