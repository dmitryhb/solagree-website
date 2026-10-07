import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { artifactFiles, manifestName, releasePolicy, sourceCommit } from './lib/release-artifact.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const environment = process.env.NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT
if (!environment || environment === 'dev') {
  console.log('Release manifest omitted: set NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT via the deployment script for a deployable artifact.')
} else {
  try {
    const directory = join(root, '.output/public')
    const policy = releasePolicy(environment)
    // Read the generated runtime configuration, rather than trusting the build invocation alone.
    const html = readFileSync(join(directory, '200.html'), 'utf8')
    for (const value of [policy.siteOrigin, policy.portalUrl, policy.portalApiOrigin]) {
      if (!html.includes(value)) throw new Error('generated fallback does not contain the deployment origins')
    }
    const manifest = { schemaVersion: 1, commit: sourceCommit(root), ...policy, files: artifactFiles(directory) }
    writeFileSync(join(directory, manifestName), `${JSON.stringify(manifest, null, 2)}\n`)
    console.log(`Release manifest written for ${environment} at commit ${manifest.commit}`)
  } catch (error) {
    console.error(`Release manifest failed: ${error.message}`)
    process.exitCode = 1
  }
}
