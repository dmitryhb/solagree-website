import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url))

export const DYNAMIC_NOINDEX_LOCATION_PREFIXES = ['/go/', '/cdfa/go/', '/webinars/']
export const NOINDEX_HEADER_VARIABLE = '$co_branded_noindex_header'
export const EXPECTED_X_ROBOTS_TAG_DIRECTIVE = `add_header X-Robots-Tag ${NOINDEX_HEADER_VARIABLE} always;`
export const SPA_FALLBACK_LOCATION = '@solagree_spa_fallback'
export const EXPECTED_TRY_FILES_DIRECTIVE = `try_files $uri $uri/ ${SPA_FALLBACK_LOCATION};`
export const EXPECTED_FALLBACK_DIRECTIVE = 'try_files /200.html =404;'

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
 * fallback response, the /200.html SPA fallback, and
 * deploy scripts that install and verify the snippet. The header is configured
 * at server scope, while a marker is set in normalized dynamic locations. That
 * preserves inherited security headers and covers percent-encoded aliases. A
 * named fallback serves /200.html without restarting server rewrites, so the
 * marker remains set on dynamic responses.
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

  const noindexHeaderIndex = config.indexOf(EXPECTED_X_ROBOTS_TAG_DIRECTIVE)

  if (noindexHeaderIndex === -1) {
    failures.push(
      `config/nginx/co-branded-noindex.conf must add X-Robots-Tag from ${NOINDEX_HEADER_VARIABLE} at server scope.`
    )
  }

  if (!/^set\s+\$co_branded_noindex_header\s+"";$/m.test(config)) {
    failures.push(
      'The server-scoped noindex marker must initialize unconditionally before location matching.'
    )
  }

  if (/\bif\s*\(/.test(config)) {
    failures.push(
      'The noindex snippet must not depend on raw or normalized URI exceptions for marker initialization.'
    )
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

    if (!directives.includes(`set ${NOINDEX_HEADER_VARIABLE} "noindex, nofollow";`)) {
      failures.push(
        `"location ^~ ${prefix}" must set ${NOINDEX_HEADER_VARIABLE} after nginx normalizes the request URI.`
      )
    }

    if (directives.some(directive => directive.startsWith('add_header X-Robots-Tag '))) {
      failures.push(
        `"location ^~ ${prefix}" must not define X-Robots-Tag: it must inherit the server-level header through the /200.html internal redirect.`
      )
    }

    if (!directives.includes(EXPECTED_TRY_FILES_DIRECTIVE)) {
      failures.push(
        `"location ^~ ${prefix}" must contain exactly "${EXPECTED_TRY_FILES_DIRECTIVE}".`
      )
    }
  }

  if (!new RegExp(`location\\s+${SPA_FALLBACK_LOCATION}\\s*\\{\\s*${EXPECTED_FALLBACK_DIRECTIVE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\}`).test(config)) {
    failures.push(
      `"location ${SPA_FALLBACK_LOCATION}" must contain exactly "${EXPECTED_FALLBACK_DIRECTIVE}".`
    )
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
