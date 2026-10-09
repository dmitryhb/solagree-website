import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const script = new URL('../scripts/patch-devtools-simple-git.mjs', import.meta.url)
const original = "import Git from 'simple-git';"
const patched = "import { simpleGit as Git } from 'simple-git';"

for (const scenario of ['original', 'patched', 'changed-version', 'changed-import', 'duplicate-import']) {
  test(`DevTools patch handles ${scenario} safely`, async (context) => {
    const root = await mkdtemp(join(tmpdir(), 'solagree-devtools-patch-'))
    context.after(() => rm(root, { recursive: true, force: true }))
    const dependency = join(root, 'node_modules/@nuxt/devtools')
    const target = join(dependency, 'dist/chunks/module-main.mjs')
    await mkdir(join(root, 'node_modules/nuxt'), { recursive: true })
    await mkdir(join(dependency, 'dist/chunks'), { recursive: true })
    await writeFile(join(root, 'package.json'), '{}')
    await writeFile(join(root, 'node_modules/nuxt/package.json'), '{}')
    await writeFile(join(dependency, 'package.json'), JSON.stringify({
      version: scenario === 'changed-version' ? '3.4.3' : '3.4.2'
    }))
    const source = scenario === 'changed-import' ? "import SomethingElse from 'simple-git';"
      : scenario === 'patched' ? patched
        : scenario === 'duplicate-import' ? `${original}\n${original}` : original
    await writeFile(target, `${source}\nconst unchanged = true;\n`)
    const before = await readFile(target, 'utf8')
    const result = spawnSync(process.execPath, [fileURLToPath(script)], { cwd: root, encoding: 'utf8' })

    if (scenario === 'original' || scenario === 'patched') {
      assert.equal(result.status, 0, result.stderr)
      assert.equal(await readFile(target, 'utf8'), `${patched}\nconst unchanged = true;\n`)
      assert.equal(spawnSync(process.execPath, [fileURLToPath(script)], { cwd: root }).status, 0)
    } else {
      assert.notEqual(result.status, 0)
      assert.match(result.stderr, /review/i)
      assert.equal(await readFile(target, 'utf8'), before)
    }
  })
}
