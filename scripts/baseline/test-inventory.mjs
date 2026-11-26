import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../..', import.meta.url))
const defaultOutput = join(root, 'baseline-output/test-inventory.json')
const vitestConfigs = ['vitest.config.ts', 'vitest.analytics-client.config.ts']

/**
 * Turns an absolute path inside the repository into a repository-relative one so inventories taken in
 * different checkouts are comparable.
 *
 * @param {string} path Absolute or relative path.
 * @returns {string} Repository-relative posix path.
 */
const toRepoPath = (path) => relative(root, resolve(root, path)).split('\\').join('/')

/**
 * Sorts a list of test records by file, then title, so output order never depends on the runner.
 *
 * @param {{ file: string, title: string }[]} records Records to sort.
 * @returns {{ file: string, title: string }[]} The same records, ordered.
 */
const sortRecords = (records) => records.sort((a, b) => a.file.localeCompare(b.file) || a.title.localeCompare(b.title))

/**
 * Lists every vitest test for one config via `vitest list --json`.
 *
 * @param {string} config Vitest config file name.
 * @returns {{ file: string, title: string }[]} Test records.
 */
const listVitest = (config) => {
  const output = execFileSync('npx', ['vitest', 'list', '--json', '--config', config], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  const start = output.indexOf('[')
  return sortRecords(JSON.parse(output.slice(start)).map((entry) => ({ file: toRepoPath(entry.file), title: entry.name })))
}

/**
 * Lists `node --test` files and their tests. `node --test` cannot list without running, so each file is
 * executed once with the TAP reporter and its `# Subtest:` lines are read (nested ones joined with ` > `).
 *
 * @returns {{ file: string, title: string, status: string }[]} Test records with pass, fail or skip status.
 */
const listNodeTests = () => {
  const files = readdirSync(join(root, 'tests')).filter((name) => /\.test\.m[jt]s$/.test(name)).sort().map((name) => `tests/${name}`)
  const records = []
  for (const file of files) {
    const result = spawnSync(process.execPath, ['--experimental-strip-types', '--test', '--test-reporter=tap', file], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    const stack = []
    for (const line of result.stdout.split('\n')) {
      const subtest = line.match(/^(\s*)# Subtest: (.*)$/)
      if (subtest) {
        const depth = subtest[1].length / 4
        stack.length = depth
        stack[depth] = subtest[2]
        continue
      }
      const outcome = line.match(/^(\s*)(not ok|ok) \d+ - (.*?)(?: # (SKIP|TODO).*)?$/)
      if (!outcome) continue
      const depth = outcome[1].length / 4
      const path = [...stack.slice(0, depth), outcome[3]]
      records.push({ file, title: path.join(' > '), status: outcome[4]?.toLowerCase() ?? (outcome[2] === 'ok' ? 'pass' : 'fail') })
    }
  }
  return sortRecords(records)
}

/**
 * Lists the Playwright tests of one config via `playwright test --list --reporter=json`.
 *
 * @param {string} config Playwright config file name.
 * @returns {{ file: string, title: string }[]} Test records.
 */
const listPlaywright = (config) => {
  const result = spawnSync('npx', ['playwright', 'test', '--list', '--reporter=json', '-c', config], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  const report = JSON.parse(result.stdout)
  const records = []
  const visit = (suite, titles) => {
    const nextTitles = suite.title && !suite.file ? [...titles, suite.title] : suite.file ? [] : titles
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        const project = test.projectName ? `[${test.projectName}] ` : ''
        records.push({ file: toRepoPath(join(report.config.rootDir, spec.file)), title: `${project}${[...nextTitles, spec.title].join(' > ')}` })
      }
    }
    for (const child of suite.suites ?? []) visit(child, nextTitles)
  }
  for (const suite of report.suites ?? []) visit(suite, [])
  return sortRecords(records)
}

/**
 * Builds the full test inventory: both vitest configs, `node --test` files and all Playwright configs.
 *
 * @returns {object} Inventory with per-runner lists and counts.
 */
export const createTestInventory = () => {
  const playwrightConfigs = readdirSync(root).filter((name) => /^playwright\..*\.config\.ts$/.test(name)).sort()
  const inventory = {
    schemaVersion: 1,
    vitest: Object.fromEntries(vitestConfigs.map((config) => [config, listVitest(config)])),
    nodeTest: listNodeTests(),
    playwright: Object.fromEntries(playwrightConfigs.map((config) => [config, listPlaywright(config)]))
  }
  inventory.counts = {
    vitest: Object.fromEntries(Object.entries(inventory.vitest).map(([config, list]) => [config, list.length])),
    nodeTest: inventory.nodeTest.length,
    playwright: Object.fromEntries(Object.entries(inventory.playwright).map(([config, list]) => [config, list.length]))
  }
  return inventory
}

/**
 * Compares two inventories and reports tests that disappeared or appeared.
 *
 * @param {object} before Baseline inventory.
 * @param {object} after Current inventory.
 * @returns {string[]} Difference lines; empty when identical.
 */
export const compareInventories = (before, after) => {
  const flatten = (inventory) => {
    const keys = new Map()
    for (const [group, lists] of [['vitest', inventory.vitest], ['playwright', inventory.playwright]]) {
      for (const [config, list] of Object.entries(lists)) list.forEach((test) => keys.set(`${group}:${config} | ${test.file} | ${test.title}`, ''))
    }
    inventory.nodeTest.forEach((test) => keys.set(`node:test | ${test.file} | ${test.title}`, test.status))
    return keys
  }
  const was = flatten(before)
  const now = flatten(after)
  const lines = []
  for (const [key, status] of was) {
    if (!now.has(key)) lines.push(`REMOVED ${key}`)
    else if (now.get(key) !== status) lines.push(`STATUS  ${key}: ${status} -> ${now.get(key)}`)
  }
  for (const key of now.keys()) if (!was.has(key)) lines.push(`ADDED   ${key}`)
  return lines.sort()
}

/**
 * Entry point: writes the inventory, or with `--compare <file>` prints differences and fails on any.
 *
 * @returns {void}
 */
const main = () => {
  const args = process.argv.slice(2)
  const option = (flag) => (args.includes(flag) ? resolve(args[args.indexOf(flag) + 1]) : null)
  const compare = option('--compare')
  const output = option('--out') ?? defaultOutput
  const inventory = createTestInventory()
  if (compare) {
    const differences = compareInventories(JSON.parse(readFileSync(compare, 'utf8')), inventory)
    console.log(differences.length ? differences.join('\n') : 'Test inventory matches the baseline.')
    if (differences.length) {
      console.error(`Test inventory differs from the baseline in ${differences.length} place(s). Removed tests or status changes are not allowed in a refactor; added tests are.`)
      process.exitCode = 1
    }
    return
  }
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, `${JSON.stringify(inventory, null, 2)}\n`)
  console.log(`Test inventory written to ${output}`)
  console.log(JSON.stringify(inventory.counts))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
