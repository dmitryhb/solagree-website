// Runs on the prepared static host. This is the same HTTP acceptance contract as
// the public deploy verifier, against the isolated candidate before activation.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { checkRoutes } from './route-http-contract.mjs'
import { verifyStaticPolicy } from './static-artifact-policy.mjs'

try {
  const request = JSON.parse(readFileSync(0, 'utf8'))
  verifyStaticPolicy(request.artifactDirectory, JSON.parse(readFileSync(join(request.artifactDirectory, 'release-manifest.json'))), request.env)
  await checkRoutes(request)
} catch (error) {
  console.error(`Candidate HTTP check failed: ${error.message}`)
  process.exitCode = 1
}
