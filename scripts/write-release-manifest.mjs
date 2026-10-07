import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { artifactFiles, manifestName, origin, releasePolicy, sourceCommit } from './lib/release-artifact.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const environment = process.env.NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT
if (!environment || environment === 'dev') {
  console.log('Release manifest omitted: set NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT via the deployment script for a deployable artifact.')
} else {
  try {
    const directory = join(root, '.output/public')
    const policy = releasePolicy(environment)
    // Check the serialized Nuxt runtime policy in the actual fallback artifact.
    const html = readFileSync(join(directory, '200.html'), 'utf8')
    const runtime = html.split('window.__NUXT__.config=')[1]?.split('</script>')[0] ?? ''
    function runtimeString(field) {
      const match = runtime.match(new RegExp(`(?:^|[,{])(?:"${field}"|${field}):("(?:[^"\\\\]|\\\\.)*")`))
      if (!match) throw new Error(`generated fallback is missing runtime ${field}`)
      return JSON.parse(match[1])
    }
    for (const [field, expected] of [
      ['siteUrl', policy.siteOrigin], ['portalUrl', policy.portalUrl], ['portalApiBaseUrl', policy.portalApiOrigin]
    ]) {
      if (origin(runtimeString(field), field) !== expected) throw new Error(`generated fallback runtime ${field} does not match the deployment destination`)
    }
    if (runtimeString('deploymentEnvironment') !== policy.environment) throw new Error('generated fallback deploymentEnvironment does not match the deployment environment')
    if (runtimeString('gaMeasurementId') !== policy.ga.measurementId) throw new Error('generated fallback gaMeasurementId does not match the deployment policy')
    const manifest = { schemaVersion: 1, commit: sourceCommit(root), ...policy, files: artifactFiles(directory) }
    writeFileSync(join(directory, manifestName), `${JSON.stringify(manifest, null, 2)}\n`)
    console.log(`Release manifest written for ${environment} at commit ${manifest.commit}`)
  } catch (error) {
    console.error(`Release manifest failed: ${error.message}`)
    process.exitCode = 1
  }
}
