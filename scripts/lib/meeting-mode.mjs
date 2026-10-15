import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Standalone legal history has no Nuxt runtime; generated legal pages do.
export const generatedLegalPath = path => path === 'legal/index.html'
  || /^legal\/(?:terms-of-service|privacy-policy|accessibility)\/(?:index\.html|_payload\.json)$/.test(path)
export const immutablePath = path => path.startsWith('legal/') && !generatedLegalPath(path)

export function verifyMeetingModes(manifest, artifact, { environment = 'staging', approved = false, expectedMode, phonePaths } = {}) {
  const modes = new Set()
  for (const path of Object.keys(manifest.files).filter(path => path.endsWith('.html'))) {
    const html = readFileSync(join(artifact, path), 'utf8')
    const assignments = [...html.matchAll(/window\.__NUXT__\.config\s*=\s*([^]*?)<\/script>/g)]
    // Standalone legal documents have no Nuxt runtime. Application shells must have exactly one.
    const applicationShell = /id\s*=\s*["']__nuxt["']|window\.__NUXT__|\/_nuxt\//.test(html)
    if (path.startsWith('legal/') && !applicationShell && assignments.length === 0) {
      // Nuxt's /legal index is a static redirect, while the three generated pages need runtime.
      if (path === 'legal/index.html' || immutablePath(path)) continue
    }
    if (assignments.length !== 1) throw new Error(`generated HTML ${path} must have exactly one Nuxt runtime config`)
    const values = [...assignments[0][1].matchAll(/(?:"meetingMethodMode"|meetingMethodMode):"([^"]+)"/g)]
    if (values.length !== 1 || !['mixed', 'separate'].includes(values[0][1])) {
      throw new Error(`generated HTML ${path} is missing an unambiguous Initial Consult meetingMethodMode`)
    }
    if (expectedMode && values[0][1] !== expectedMode) {
      throw new Error(`generated HTML ${path} meetingMethodMode does not match the deployment policy`)
    }
    for (const [field, expected] of Object.entries(phonePaths ?? {})) {
      const matches = [...assignments[0][1].matchAll(new RegExp(`(?:^|[,{])(?:"${field}"|${field}):("(?:[^"\\\\]|\\\\.)*")`, 'g'))]
      if (matches.length !== 1 || JSON.parse(matches[0][1]) !== expected) {
        throw new Error(`generated HTML ${path} ${field} does not match the deployment policy`)
      }
    }
    modes.add(values[0][1])
  }
  if (modes.size !== 1) throw new Error('generated HTML has inconsistent Initial Consult meetingMethodMode values')
  if (modes.has('separate') && !approved) {
    throw new Error(`${environment} artifact must retain mixed Initial Consult mode; separate mode requires explicit native activation approval`)
  }
}
