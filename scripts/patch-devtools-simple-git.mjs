import { readFile, rename, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'

// HIR-660: stable DevTools still imports the default removed by simple-git 4.
// Keep this narrowly scoped patch until upstream supports the secured major.
const projectRequire = createRequire(resolve('package.json'))
const nuxtRequire = createRequire(projectRequire.resolve('nuxt/package.json'))
const metadataPath = nuxtRequire.resolve('@nuxt/devtools/package.json')
const metadata = JSON.parse(await readFile(metadataPath, 'utf8'))

if (metadata.version !== '3.4.2') {
  throw new Error('Review the DevTools simple-git patch before changing @nuxt/devtools 3.4.2')
}

const modulePath = join(dirname(metadataPath), 'dist/chunks/module-main.mjs')
const source = await readFile(modulePath, 'utf8')
const original = "import Git from 'simple-git';"
const patched = "import { simpleGit as Git } from 'simple-git';"

if (source.includes(original)) {
  if (source.split(original).length !== 2 || source.includes(patched)) {
    throw new Error('Unexpected DevTools simple-git imports; review the patch')
  }
  // Replace the file atomically so a pnpm hardlink never mutates its store.
  const temporaryPath = `${modulePath}.hir-660-tmp`
  await writeFile(temporaryPath, source.replace(original, patched))
  await rename(temporaryPath, modulePath)
} else if (source.split(patched).length !== 2) {
  throw new Error('DevTools import changed; review or remove the simple-git patch')
}
