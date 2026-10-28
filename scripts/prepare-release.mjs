import { execFileSync } from 'node:child_process'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { releasePolicy } from './lib/release-artifact.mjs'
import { cleanSource, gateCommands, proofName, runtimeFiles, sha256, verifyProof } from './lib/release-proof.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const proofPath = join(root, '.output', proofName)
try {
  const environment = process.argv[2]
  const policy = releasePolicy(environment)
  Object.assign(process.env, {
    NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: environment,
    NUXT_PUBLIC_SITE_URL: policy.siteOrigin, NUXT_PUBLIC_PORTAL_URL: policy.portalUrl,
    NUXT_PUBLIC_PORTAL_API_BASE_URL: policy.portalApiOrigin, NUXT_PUBLIC_GA_MEASUREMENT_ID: policy.ga.measurementId
  })
  rmSync(proofPath, { force: true })
  const source = cleanSource(root)
  for (const command of gateCommands) {
    console.log(`Release preflight: ${command}`)
    const [binary, ...args] = command.split(' ')
    execFileSync(binary, args, { cwd: root, stdio: 'inherit' })
    if (JSON.stringify(cleanSource(root)) !== JSON.stringify(source)) throw new Error('source changed during release preflight')
  }
  const manifestBytes = readFileSync(join(root, '.output/public/release-manifest.json'))
  const manifest = JSON.parse(manifestBytes)
  const proof = {
    schemaVersion: 1, ...source, manifestSha256: sha256(manifestBytes), files: manifest.files,
    gates: gateCommands.map(command => ({ command, exitCode: 0 })),
    runtime: Object.fromEntries(runtimeFiles.map(path => [path, sha256(readFileSync(join(root, path)))]))
  }
  verifyProof(proof, manifestBytes, root, source)
  writeFileSync(proofPath, `${JSON.stringify(proof, null, 2)}\n`, { mode: 0o600 })
  console.log(`Verified release proof written for ${source.commit}`)
} catch (error) {
  rmSync(proofPath, { force: true })
  console.error(`Release preflight failed: ${error.message}`)
  process.exitCode = 1
}
