import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, lstatSync } from 'node:fs'
import { join, relative } from 'node:path'

export const manifestName = 'release-manifest.json'
export const releaseTargets = {
  staging: {
    siteOrigin: 'https://solagree.qamachine.com',
    portalUrl: 'https://solagree-portal.qamachine.com',
    portalApiOrigin: 'https://solagree-portal.qamachine.com'
  },
  production: {
    siteOrigin: 'https://www.solagree.com',
    portalUrl: 'https://portal.solagree.com',
    portalApiOrigin: 'https://portal.solagree.com'
  }
}

export function origin(value, field) {
  let url
  try { url = new URL(value) } catch { throw new Error(`${field} must be an HTTPS origin`) }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error(`${field} must be an HTTPS origin without credentials, path, query or fragment`)
  }
  return url.origin
}

export function releasePolicy(environment, env = process.env) {
  const target = releaseTargets[environment]
  if (!target) throw new Error('deployment environment must be staging or production')
  const fields = { siteOrigin: 'NUXT_PUBLIC_SITE_URL', portalUrl: 'NUXT_PUBLIC_PORTAL_URL', portalApiOrigin: 'NUXT_PUBLIC_PORTAL_API_BASE_URL' }
  const values = Object.fromEntries(Object.entries(fields).map(([field, variable]) => {
    const actual = origin(env[variable] ?? target[field], field)
    // Overrides may normalize trailing slashes, but cannot change the target destination.
    if (actual !== target[field]) throw new Error(`${field} does not match the ${environment} deployment destination`)
    return [field, actual]
  }))
  const measurementId = (env.NUXT_PUBLIC_GA_MEASUREMENT_ID ?? '').trim()
  if (measurementId && !/^G-[A-Z0-9]+$/.test(measurementId)) throw new Error('ga.measurementId must be a GA4 measurement ID or empty')
  return { environment, ...values, ga: { enabled: Boolean(measurementId), measurementId } }
}

export function sourceCommit(root) {
  return execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
}

export function artifactFiles(directory) {
  const files = {}
  function visit(folder) {
    for (const entry of readdirSync(folder).sort()) {
      const fullPath = join(folder, entry)
      const path = relative(directory, fullPath).split('\\').join('/')
      if (path === manifestName) continue
      const stat = lstatSync(fullPath)
      if (stat.isDirectory()) visit(fullPath)
      else if (stat.isFile()) files[path] = createHash('sha256').update(readFileSync(fullPath)).digest('hex')
      else throw new Error('artifact files must be regular files or directories')
    }
  }
  visit(directory)
  for (const required of ['index.html', '200.html', 'webinars/index.html', 'sitemap.xml']) {
    if (!files[required]) throw new Error(`artifact is missing ${required}`)
  }
  return files
}

export function verifyManifest(manifest, expected, commit, directory) {
  if (manifest?.schemaVersion !== 1) throw new Error('manifest schemaVersion must be 1')
  if (manifest.commit !== commit) throw new Error('manifest commit does not match the current source commit')
  for (const field of ['environment', 'siteOrigin', 'portalUrl', 'portalApiOrigin']) {
    if (manifest[field] !== expected[field]) throw new Error(`manifest ${field} does not match the deployment destination`)
  }
  if (manifest.ga?.enabled !== expected.ga.enabled || manifest.ga?.measurementId !== expected.ga.measurementId) {
    throw new Error('manifest ga policy does not match the deployment policy')
  }
  const files = artifactFiles(directory)
  if (!manifest.files || Object.keys(files).length !== Object.keys(manifest.files).length
    || Object.entries(files).some(([path, hash]) => manifest.files[path] !== hash)) {
    throw new Error('manifest files do not match the generated artifact hashes')
  }
}
