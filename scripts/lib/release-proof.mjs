import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { sourceCommit } from './release-artifact.mjs'

export const proofName = 'release-proof.json'
export const gateCommands = ['npm run lint', 'npm run typecheck', 'npm test', 'npm run test:release-host', 'npm run generate', 'node scripts/verify-release-artifact.mjs', 'node scripts/verify-sitemap.mjs']
export const runtimeFiles = ['scripts/lib/route-http-contract.mjs', 'scripts/lib/release-candidate.mjs', 'scripts/lib/static-artifact-policy.mjs', 'config/nginx/co-branded-noindex.conf', 'config/nginx/legacy-redirects.conf']
export const sha256 = value => createHash('sha256').update(value).digest('hex')

export function cleanSource(root) {
  const status = execFileSync('git', ['-C', root, 'status', '--porcelain', '--untracked-files=normal'], { encoding: 'utf8' })
  if (status.trim()) throw new Error('release preflight requires a clean committed checkout')
  return { commit: sourceCommit(root), tree: execFileSync('git', ['-C', root, 'rev-parse', 'HEAD^{tree}'], { encoding: 'utf8' }).trim(), lockSha256: sha256(readFileSync(join(root, 'package-lock.json'))) }
}

export function verifyProof(proof, manifestBytes, runtime, source) {
  const manifest = JSON.parse(manifestBytes)
  if (proof?.schemaVersion !== 1 || proof.commit !== manifest.commit || proof.manifestSha256 !== sha256(manifestBytes)) throw new Error('release proof does not match the artifact manifest')
  if (JSON.stringify(proof.gates) !== JSON.stringify(gateCommands.map(command => ({ command, exitCode: 0 })))) throw new Error('release proof is missing the required successful preflight gates')
  if (!/^[a-f0-9]{40}$/.test(proof.tree ?? '') || !/^[a-f0-9]{64}$/.test(proof.lockSha256 ?? '')) throw new Error('release proof source identity is invalid')
  if (source && Object.entries(source).some(([key, value]) => proof[key] !== value)) throw new Error('release proof does not match the clean source checkout')
  if (JSON.stringify(proof.files) !== JSON.stringify(manifest.files)) throw new Error('release proof file inventory does not match the artifact')
  if (!proof.runtime || Object.keys(proof.runtime).length !== runtimeFiles.length || runtimeFiles.some(path => proof.runtime[path] !== sha256(readFileSync(join(runtime, path))))) throw new Error('release proof does not match the candidate HTTP contract')
  return manifest
}
