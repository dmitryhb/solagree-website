import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { deploymentAnalytics } from '../config/deployment-analytics.mjs'

for (const environment of ['dev', 'staging', 'production']) {
  for (const id of [undefined, '', 'G-LOCALTEST']) {
    test(`${environment} analytics with ${id === undefined ? 'missing' : id === '' ? 'empty' : 'explicit'} ID`, () => {
      const env = { ...process.env, NODE_ENV: 'production', NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: environment, NUXT_PUBLIC_GA_MEASUREMENT_ID: id }
      const result = spawnSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', `
        globalThis.defineNuxtConfig = config => config;
        const { default: config } = await import('./nuxt.config.ts');
        console.log(JSON.stringify({ scripts: config.app.head.script, public: config.runtimeConfig.public }));
      `], { cwd: new URL('..', import.meta.url), env, encoding: 'utf8' })
      assert.equal(result.status, 0, result.stderr)
      const config = JSON.parse(result.stdout)
      assert.equal(config.public.deploymentEnvironment, environment)
      assert.equal(config.public.gaMeasurementId, id ?? '')
      assert.equal(config.public.solagreeQuiz.analytics.enabled, Boolean(id))
      assert.equal(config.public.solagreeCaseQualifier.analytics.enabled, Boolean(id))
      assert.equal(config.scripts.length, id ? 2 : 0)
      if (id) {
        assert.match(config.scripts[0].src, /G-LOCALTEST$/)
        assert.match(config.scripts[1].innerHTML, /send_page_view: false/)
      }
    })
  }
}

test('production build mode alone does not select the production analytics property', () => {
  assert.deepEqual(deploymentAnalytics({ NODE_ENV: 'production' }), { environment: 'dev', ga: { enabled: false, measurementId: '' } })
})

test('invalid environment and unsafe measurement IDs fail without echoing values', () => {
  assert.throws(() => deploymentAnalytics({ NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: 'other' }), /must be dev, staging or production/)
  assert.throws(() => deploymentAnalytics({ NUXT_PUBLIC_GA_MEASUREMENT_ID: "secret';alert(1)" }), error => error instanceof Error && !error.message.includes('secret'))
})
