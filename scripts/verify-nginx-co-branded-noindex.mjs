import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url))

export const DYNAMIC_NOINDEX_LOCATION_PREFIXES = ['/go/', '/cdfa/go/', '/webinars/']
export const EXPECTED_X_ROBOTS_TAG_DIRECTIVE = 'add_header X-Robots-Tag "noindex, nofollow" always;'
export const EXPECTED_TRY_FILES_DIRECTIVE = 'try_files $uri $uri/ /200.html;'

const readRepoFile = (relativePath) => readFileSync(`${ROOT_DIR}${relativePath}`, 'utf8')

/**
 * Extracts the directive body of one `location ^~ <prefix> { ... }` block.
 * Returns null when the block is missing or the file has unbalanced braces.
 */
const extractLocationBlock = (config, prefix) => {
  const openCount = [...config.matchAll(/\{/g)].length
  const closeCount = [...config.matchAll(/\}/g)].length

  if (openCount !== closeCount) {
    return null
  }

  const blockPattern = new RegExp(`location\\s+\\^~\\s+${prefix}\\s*\\{([\\s\\S]*?)\\}`)
  const match = config.match(blockPattern)

  return match ? match[1] : null
}

const normalizeDirective = (line) => line.trim().replace(/\s+/g, ' ')

/**
 * Textual regression check for the dynamic-route noindex nginx snippet.
 *
 * `nginx -t` is not available in CI or on developer laptops for this repo, so
 * this validates the structure the static hosting contract depends on:
 * all dynamic location families, the X-Robots-Tag noindex header on every
 * response, the /200.html SPA fallback (never a true HTTP 404), and deploy
 * scripts that install and verify the snippet.
 *
 * Returns an array of failure messages; empty means the configuration passed.
 */
export const verifyCoBrandedNoindexNginxConfig = () => {
  const failures = []
  let config

  try {
    config = readRepoFile('config/nginx/co-branded-noindex.conf')
  } catch {
    return ['config/nginx/co-branded-noindex.conf is missing.']
  }

  for (const prefix of DYNAMIC_NOINDEX_LOCATION_PREFIXES) {
    const block = extractLocationBlock(config, prefix)

    if (block === null) {
      failures.push(
        `config/nginx/co-branded-noindex.conf has no balanced "location ^~ ${prefix}" block.`
      )
      continue
    }

    const directives = block.split('\n').map(normalizeDirective).filter(Boolean)

    if (!directives.includes(EXPECTED_X_ROBOTS_TAG_DIRECTIVE)) {
      failures.push(
        `"location ^~ ${prefix}" must contain exactly "${EXPECTED_X_ROBOTS_TAG_DIRECTIVE}".`
      )
    }

    if (!directives.includes(EXPECTED_TRY_FILES_DIRECTIVE)) {
      failures.push(
        `"location ^~ ${prefix}" must contain exactly "${EXPECTED_TRY_FILES_DIRECTIVE}".`
      )
    }
  }

  if (!/location\s+=\s+\/webinars\s*\{\s*try_files\s+\/webinars\/index\.html\s+=404;\s*\}/.test(config)
    || !/location\s+=\s+\/webinars\/\s*\{\s*return\s+301\s+\/webinars;\s*\}/.test(config)) {
    failures.push('The indexable /webinars catalogue needs exact locations before the dynamic noindex prefix.')
  }

  if (/return\s+404/.test(config)) {
    failures.push(
      'config/nginx/co-branded-noindex.conf must not return a true HTTP 404: the static fallback architecture only supports noindexed soft-404s for these URLs.'
    )
  }

  let productionScript
  let stagingScript

  try {
    productionScript = readRepoFile('scripts/deploy-production.sh')
    stagingScript = readRepoFile('scripts/deploy-staging.sh')
  } catch {
    failures.push('scripts/deploy-production.sh and scripts/deploy-staging.sh must exist.')
    return failures
  }

  for (const [scriptName, script] of [
    ['scripts/deploy-production.sh', productionScript],
    ['scripts/deploy-staging.sh', stagingScript]
  ]) {
    if (!script.includes('X-Robots-Tag')) {
      failures.push(`${scriptName} must verify the X-Robots-Tag noindex header after deployment.`)
    }
  }

  if (!productionScript.includes('co-branded-noindex.conf')) {
    failures.push(
      'scripts/deploy-production.sh must install config/nginx/co-branded-noindex.conf on the server.'
    )
  }

  return failures
}

const isCliInvocation = process.argv[1] && import.meta.url === `file://${process.argv[1]}`

if (isCliInvocation) {
  const failures = verifyCoBrandedNoindexNginxConfig()

  if (failures.length > 0) {
    console.error('Co-branded noindex nginx verification failed:')
    for (const failure of failures) {
      console.error(`  - ${failure}`)
    }
    process.exit(1)
  }

  console.log('Co-branded noindex nginx verification passed.')
}
