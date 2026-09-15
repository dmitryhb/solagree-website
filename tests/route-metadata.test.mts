import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'

const pageMetaCases = [
  ['app/pages/index.vue', 'home'],
  ['app/pages/quiz/index.vue', 'bare'],
  ['app/pages/quiz/embed.vue', 'bare'],
  ['app/pages/partner-tools/case-qualifier-7h3m9k.vue', 'bare'],
  ['app/pages/go/[slug]/index.vue', 'bare'],
  ['app/pages/go/[slug]/embed.vue', 'bare'],
  ['app/pages/cdfa/go/[slug]/index.vue', 'bare'],
  ['app/pages/cdfa/go/[slug]/embed.vue', 'bare'],
  ['app/pages/co-branded/[slug]/index.vue', 'bare'],
  ['app/pages/co-branded/[slug]/embed.vue', 'bare'],
  ['app/pages/c/[slug]/index.vue', 'bare'],
  ['app/pages/c/[slug]/thank-you.vue', 'bare'],
  ['app/pages/review/quiz.vue', 'internal'],
  ['app/pages/review/quiz-embed.vue', 'internal'],
  ['app/pages/review/foundation.vue', 'internal']
] as const

test('declares typed shell metadata for every route family with custom chrome', () => {
  const routeMeta = readFileSync(resolve(process.cwd(), 'app/types/route-meta.d.ts'), 'utf8')
  assert.match(routeMeta, /appShell\?: AppShell/)

  for (const [page, appShell] of pageMetaCases) {
    const source = readFileSync(resolve(process.cwd(), page), 'utf8')
    assert.match(source, new RegExp(`definePageMeta\\(\\{\\s*appShell: '${appShell}'`, 's'), page)
  }
})

test('keeps app shell selection independent of route path lists', () => {
  const appSource = readFileSync(resolve(process.cwd(), 'app/app.vue'), 'utf8')

  assert.match(appSource, /const currentRoute = router\.currentRoute/)
  assert.match(appSource, /router\.afterEach/)
  assert.match(appSource, /if \(!failure\)/)
  assert.match(appSource, /to\.meta\.appShell \?\? 'internal'/)
  assert.doesNotMatch(appSource, /popstate|pageshow|window\.location/)
  assert.doesNotMatch(appSource, /quizShellRoutes|CO_BRANDED_PATH_PREFIXES/)
})
