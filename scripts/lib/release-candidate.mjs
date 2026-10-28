// Runs on the prepared static host. This is the same HTTP acceptance contract as
// the public deploy verifier, against the isolated candidate before activation.
import { readFileSync } from 'node:fs'
import { checkRoutes } from './route-http-contract.mjs'

try {
  const request = JSON.parse(readFileSync(0, 'utf8'))
  await checkRoutes(request)
} catch (error) {
  console.error(`Candidate HTTP check failed: ${error.message}`)
  process.exitCode = 1
}
