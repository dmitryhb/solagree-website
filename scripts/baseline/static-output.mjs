import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../..', import.meta.url))
const defaultDirectory = join(root, '.output/public')
const defaultOutput = join(root, 'baseline-output/static-output.json')

const buildIdPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g
const assetPathPattern = /\/_nuxt\/([\w@%+.-]+?)\.(js|mjs|css)\b/g

/**
 * Hashes a string with SHA-256.
 *
 * @param {string} value Text to hash.
 * @returns {string} Hex digest.
 */
const sha256 = (value) => createHash('sha256').update(value).digest('hex')

/**
 * Replaces the content hash in a built asset file name. `entry.C5BB3NLs` becomes `entry`; a chunk that
 * is only a hash (`20a-J8mY`) becomes `<chunk>`.
 *
 * @param {string} stem Asset file name without extension.
 * @returns {string} Stable stem.
 */
const stripAssetHash = (stem) => {
  const dotIndex = stem.lastIndexOf('.')
  return dotIndex === -1 ? '<chunk>' : stem.slice(0, dotIndex)
}

/**
 * Drops bytes after the closing `</html>`. Nitro prerendering occasionally leaves a stray `/html>` tail
 * on a page (seen on `webinar/index.html`, differing between two builds of the same commit).
 *
 * @param {string} source Raw HTML or other text.
 * @returns {string} Text cut after `</html>` when present.
 */
const stripTrailingGarbage = (source) => {
  const end = source.lastIndexOf('</html>')
  return end === -1 ? source : source.slice(0, end + '</html>'.length)
}

/**
 * Removes everything that changes between two builds of the same source: the Nuxt build id, content
 * hashes in `/_nuxt/*` file names, prerender timestamps and `<!-- -->` fragment comments, then
 * collapses whitespace.
 *
 * @param {string} source Raw HTML, JSON or XML text.
 * @returns {string} Normalized text.
 */
export const normalizeText = (source) => {
  return stripTrailingGarbage(source)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(buildIdPattern, '<build-id>')
    .replace(assetPathPattern, (_match, stem, extension) => `/_nuxt/${stripAssetHash(stem)}.${extension}`)
    .replace(/(prerenderedAt|timestamp)(["']?\s*:\s*)\d{10,}/g, '$1$2<time>')
    .replace(/\b1[5-9]\d{11}\b/g, '<time>')
    // Nuxt records the prerendered route in the payload; a crawler-reached route may or may not keep its trailing slash.
    .replace(/\\u002F",<time>\]/g, '",<time>]')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extracts the visible text of an HTML page: scripts, styles and tags are dropped.
 *
 * @param {string} html Raw HTML.
 * @returns {string} Whitespace-collapsed text content.
 */
export const extractTextContent = (html) => {
  return stripTrailingGarbage(html)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Lists all files below a directory, sorted, as posix paths relative to it.
 *
 * @param {string} directory Directory to walk.
 * @returns {string[]} Relative file paths.
 */
const listFiles = (directory) => {
  const files = []
  const visit = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const absolute = join(current, entry.name)
      if (entry.isDirectory()) visit(absolute)
      else files.push(relative(directory, absolute).split(sep).join('/'))
    }
  }
  visit(directory)
  return files.sort()
}

/**
 * Splits CSS into flat rules. At-rules with a block (`@media`, `@supports`, `@layer`) are flattened so
 * each rule keeps its at-rule prefix; statement at-rules (`@import`, `@charset`) are kept as-is.
 *
 * @param {string} css Stylesheet text.
 * @returns {{ selector: string, text: string }[]} Flat rules.
 */
export const splitCssRules = (css) => {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const rules = []
  const parse = (start, end, prefix) => {
    let index = start
    while (index < end) {
      let cursor = index
      let depth = 0
      let quote = ''
      let blockStart = -1
      for (; cursor < end; cursor += 1) {
        const char = text[cursor]
        if (char === '\\') cursor += 1
        else if (quote) {
          if (char === quote) quote = ''
        } else if (char === '"' || char === "'") quote = char
        else if (char === '(') depth += 1
        else if (char === ')') depth -= 1
        else if (depth === 0 && (char === '{' || char === ';')) {
          blockStart = char === '{' ? cursor : -1
          break
        }
      }
      const prelude = text.slice(index, cursor).replace(/\s+/g, ' ').trim()
      if (blockStart === -1) {
        if (prelude) rules.push({ selector: `${prefix}${prelude}`, text: `${prefix}${prelude};` })
        index = cursor + 1
        continue
      }
      let nesting = 0
      let blockEnd = blockStart
      quote = ''
      for (; blockEnd < end; blockEnd += 1) {
        const char = text[blockEnd]
        if (char === '\\') blockEnd += 1
        else if (quote) {
          if (char === quote) quote = ''
        } else if (char === '"' || char === "'") quote = char
        else if (char === '{') nesting += 1
        else if (char === '}') {
          nesting -= 1
          if (nesting === 0) break
        }
      }
      const body = text.slice(blockStart + 1, blockEnd)
      if (prelude.startsWith('@') && /\{[^}]*\{|[^{};]\s*\{/.test(body) && !/^@(font-face|page|keyframes|-webkit-keyframes|property|counter-style)/.test(prelude)) {
        parse(blockStart + 1, blockEnd, `${prefix}${prelude} >> `)
      } else {
        const normalizedBody = body.replace(/\s+/g, ' ').replace(/\s*([:;,{}])\s*/g, '$1').trim()
        rules.push({ selector: `${prefix}${prelude}`, text: `${prefix}${prelude}{${normalizedBody}}` })
      }
      index = blockEnd + 1
    }
  }
  parse(0, text.length, '')
  return rules
}

/**
 * Summarises every `_nuxt/*.css` file: rules are sorted, so reordering rules or renaming hashed files
 * does not change the result.
 *
 * @param {string} directory Static output directory.
 * @returns {{ files: number, rules: number, selectorsHash: string, fullHash: string }} CSS summary.
 */
const summarizeCss = (directory) => {
  const cssFiles = listFiles(directory).filter((file) => file.startsWith('_nuxt/') && file.endsWith('.css'))
  const rules = cssFiles.flatMap((file) => splitCssRules(normalizeText(readFileSync(join(directory, file), 'utf8')).replace(/ ?(\{|\}|;|,|:) ?/g, '$1')))
  const selectors = [...new Set(rules.map((rule) => rule.selector))].sort()
  const texts = rules.map((rule) => rule.text).sort()
  return {
    files: cssFiles.length,
    rules: rules.length,
    selectorsHash: sha256(selectors.join('\n')),
    fullHash: sha256(texts.join('\n'))
  }
}

/**
 * Builds the baseline snapshot of a generated static site.
 *
 * @param {string} directory Static output directory, normally `.output/public`.
 * @returns {object} Snapshot with per-page hashes and one overall hash.
 */
export const createStaticOutputSnapshot = (directory) => {
  if (!existsSync(directory) || !statSync(directory).isDirectory()) {
    throw new Error(`Static output not found at ${directory}. Run "npm run generate" first.`)
  }
  const files = listFiles(directory)
  const pages = {}
  const textContent = {}
  const payloads = {}
  for (const file of files) {
    const isHtml = file.endsWith('.html')
    const isSitemap = file === 'sitemap.xml'
    const isPayload = file.endsWith('_payload.json')
    if (!isHtml && !isSitemap && !isPayload) continue
    const source = readFileSync(join(directory, file), 'utf8')
    const normalized = normalizeText(source)
    if (isPayload) payloads[file] = sha256(normalized)
    else pages[file] = sha256(normalized)
    if (isHtml) textContent[file] = sha256(extractTextContent(source))
  }
  const css = summarizeCss(directory)
  const overall = sha256(JSON.stringify({ pages, textContent, payloads, css }))
  return { schemaVersion: 1, overallHash: overall, pages, textContent, payloads, css }
}

/**
 * Compares two snapshots page by page.
 *
 * @param {object} before Baseline snapshot.
 * @param {object} after Current snapshot.
 * @returns {string[]} Human-readable difference lines; empty when identical.
 */
export const compareSnapshots = (before, after) => {
  const lines = []
  for (const section of ['pages', 'textContent', 'payloads']) {
    const paths = [...new Set([...Object.keys(before[section] ?? {}), ...Object.keys(after[section] ?? {})])].sort()
    for (const path of paths) {
      const was = before[section]?.[path]
      const now = after[section]?.[path]
      if (was === now) continue
      const kind = !was ? 'ADDED  ' : !now ? 'REMOVED' : 'CHANGED'
      lines.push(`${kind} [${section}] ${path}`)
    }
  }
  for (const key of ['files', 'rules', 'selectorsHash', 'fullHash']) {
    if (before.css?.[key] !== after.css?.[key]) lines.push(`CHANGED [css] ${key}: ${before.css?.[key]} -> ${after.css?.[key]}`)
  }
  return lines
}

/**
 * Reads the current git commit so a snapshot can be traced back to a revision.
 *
 * @returns {string} Commit sha, or `unknown` outside git.
 */
const readCommit = () => {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
  } catch {
    return 'unknown'
  }
}

/**
 * Reads CLI flags: `--dir`, `--out` and `--compare`.
 *
 * @param {string[]} argv Arguments after the script name.
 * @returns {{ directory: string, output: string, compare: string | null }} Parsed options.
 */
const parseArguments = (argv) => {
  const options = { directory: defaultDirectory, output: defaultOutput, compare: null }
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index]
    const value = argv[index + 1]
    if (!['--dir', '--out', '--compare'].includes(flag) || !value) throw new Error(`Unknown or incomplete argument: ${flag}`)
    if (flag === '--dir') options.directory = resolve(value)
    if (flag === '--out') options.output = resolve(value)
    if (flag === '--compare') options.compare = resolve(value)
    index += 1
  }
  return options
}

/**
 * Entry point: writes the snapshot, or with `--compare` prints differences and fails when there are any.
 *
 * @returns {void}
 */
const main = () => {
  const options = parseArguments(process.argv.slice(2))
  const snapshot = createStaticOutputSnapshot(options.directory)
  if (options.compare) {
    const baseline = JSON.parse(readFileSync(options.compare, 'utf8'))
    const differences = compareSnapshots(baseline, snapshot)
    if (differences.length === 0) {
      console.log(`Static output matches the baseline (${snapshot.overallHash}).`)
      return
    }
    console.log(differences.join('\n'))
    console.error(`Static output differs from the baseline in ${differences.length} place(s).`)
    process.exitCode = 1
    return
  }
  mkdirSync(dirname(options.output), { recursive: true })
  writeFileSync(options.output, `${JSON.stringify({ ...snapshot, commit: readCommit() }, null, 2)}\n`)
  console.log(`Static output baseline written to ${options.output}`)
  console.log(`Overall hash: ${snapshot.overallHash} (${Object.keys(snapshot.pages).length} pages, ${snapshot.css.rules} CSS rules)`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
