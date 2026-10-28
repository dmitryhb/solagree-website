import { execFileSync } from 'node:child_process'
import { lstatSync, readFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

// Nuxt copies public/.htaccess, an Apache-only source template. It must never
// replace host-owned BasicAuth configuration. Strip only this exact tracked
// template before hashing; every other hidden file remains subject to refusal.
export function packagePublishableArtifact(root, directory) {
  const path = join(directory, '.htaccess')
  const stat = lstatSync(path, { throwIfNoEntry: false })
  if (!stat) return
  if (!stat.isFile()) throw new Error('generated .htaccess must be the regular tracked Apache-only template')
  const tracked = execFileSync('git', ['-C', root, 'show', 'HEAD:public/.htaccess'])
  if (!readFileSync(path).equals(tracked)) throw new Error('generated .htaccess differs from the tracked Apache-only template')
  unlinkSync(path)
}
