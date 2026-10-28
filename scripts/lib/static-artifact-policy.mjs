import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export function verifyStaticPolicy(directory, manifest, env = process.env) {
  const modes = new Set()
  const immutableLegal = path => path.startsWith('legal/') && path !== 'legal/index.html'
    && !/^legal\/(?:terms-of-service|privacy-policy|accessibility)\/(?:index\.html|_payload\.json)$/.test(path)
  for (const path of Object.keys(manifest.files)) {
    if (path.split('/').some(part => part.startsWith('.')) || /\.(?:conf|ini|php)$/i.test(path)) throw new Error('artifact contains hidden server configuration or executable files')
    if (!path.endsWith('.html')) continue
    const html = readFileSync(join(directory, path), 'utf8')
    const assignments = [...html.matchAll(/window\.__NUXT__\.config\s*=\s*([^]*?)<\/script>/g)]
    const applicationShell = /id\s*=\s*["']__nuxt["']|window\.__NUXT__|\/_nuxt\//.test(html)
    if (path.startsWith('legal/') && !applicationShell && assignments.length === 0 && (path === 'legal/index.html' || immutableLegal(path))) continue
    if (assignments.length !== 1) throw new Error(`generated HTML ${path} must have exactly one Nuxt runtime config`)
    const values = [...assignments[0][1].matchAll(/(?:"meetingMethodMode"|meetingMethodMode):"([^"]+)"/g)]
    if (values.length !== 1 || !['mixed', 'separate'].includes(values[0][1])) throw new Error(`generated HTML ${path} is missing an unambiguous Initial Consult meetingMethodMode`)
    modes.add(values[0][1])
  }
  if (modes.size !== 1) throw new Error('generated HTML has inconsistent Initial Consult meetingMethodMode values')
  if (manifest.environment === 'staging' && modes.has('separate') && env.STAGING_NATIVE_ACTIVATION_APPROVED !== 'true') throw new Error('staging artifact must retain mixed Initial Consult mode; separate mode requires explicit native activation approval')
}
