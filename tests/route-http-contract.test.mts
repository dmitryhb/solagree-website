import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { checkRoutes } from '../scripts/lib/route-http-contract.mjs'
import { releaseFixture } from './fixtures/release-deploy.mjs'

const failureModes = ['301', '401', '404', '500', '503', 'connection-error', 'missing-noindex', 'wrong-body', 'auth-page', 'wrong-content-type', 'catalogue-wrong-body']
type HttpCase = { environment: 'staging' | 'production'; mode: string; catalogueRobots: string | null; passes: boolean }
const cases: HttpCase[] = [
  ...(['staging', 'production'] as const).flatMap(environment => ['valid', ...failureModes].map(mode => ({
    environment, mode, catalogueRobots: environment === 'staging' ? 'noindex, nofollow' : null, passes: mode === 'valid'
  }))),
  ...([
    ['staging', 'noindex, nofollow', true],
    ['staging', null, false],
    ['staging', 'noindex', false],
    ['staging', 'nofollow', false],
    ['staging', 'none', false],
    ['production', 'index, follow', true],
    ['production', 'noindex, nofollow', false],
    ['production', 'none', false]
  ] as const).map(([environment, catalogueRobots, passes]) => ({ environment, catalogueRobots, passes, mode: 'catalogue-policy' }))
]

for (const { environment, mode, catalogueRobots, passes } of cases) {
  test(`HTTP contract: ${environment} ${mode} catalogue robots=${catalogueRobots}`, async () => {
    const fixture = releaseFixture(environment)
    const server = createServer((request, response) => {
      if (mode === 'connection-error') { request.socket.destroy(); return }
      const catalogue = request.url === '/webinars'
      response.statusCode = /^\d+$/.test(mode) ? Number(mode) : 200
      response.setHeader('Content-Type', mode === 'wrong-content-type' ? 'application/json' : 'text/html; charset=utf-8')
      if (!catalogue && mode !== 'missing-noindex') response.setHeader('X-Robots-Tag', 'noindex, nofollow')
      if (catalogue && catalogueRobots) response.setHeader('X-Robots-Tag', String(catalogueRobots))
      if (mode === '301') response.setHeader('Location', '/other')
      response.end((mode === 'wrong-body' || (catalogue && mode === 'catalogue-wrong-body')) ? '<html>proxy error</html>' : mode === 'auth-page' ? '<html>Login required</html>' : readFileSync(join(fixture.output, catalogue ? 'webinars/index.html' : '200.html')))
    })
    try {
      await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
      const address = server.address() as { port: number }
      // The manifest, rather than the hostname, auth or caller environment, selects the policy.
      const env = { ...fixture.env, NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: environment === 'staging' ? 'production' : 'staging' }
      const promise = checkRoutes({ baseUrl: `http://127.0.0.1:${address.port}`, artifactDirectory: fixture.output, env })
      if (passes) await promise
      else await assert.rejects(promise, mode === 'catalogue-policy' ? environment === 'staging' ? /without an X-Robots-Tag: noindex, nofollow header/ : /must remain indexable/ : /^Error:/)
    } finally {
      await new Promise<void>(resolve => server.close(() => resolve()))
      fixture.cleanup()
    }
  })
}

for (const environment of [undefined, null, '', 'preview', 'Staging']) {
  test(`HTTP contract rejects invalid manifest environment ${String(environment)} before probing`, async () => {
    const fixture = releaseFixture('staging')
    try {
      fixture.saveManifest({ ...fixture.manifest, environment })
      await assert.rejects(checkRoutes({ baseUrl: 'http://127.0.0.1:1', artifactDirectory: fixture.output, env: fixture.env }), /manifest environment must be staging or production/)
    } finally { fixture.cleanup() }
  })
}

for (const environment of ['staging', 'production']) {
  test(`protected ${environment} accepts correct BasicAuth on every probe and rejects absent/wrong credentials`, async () => {
    const fixture = releaseFixture(environment)
    const username = 'test-user'
    const password = 'test:password"\\value'
    let authorized = 0
    const server = createServer((request, response) => {
      const valid = request.headers.authorization === `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
      if (!valid) { response.writeHead(401); response.end('Unauthorized'); return }
      authorized++
      response.setHeader('Content-Type', 'text/html')
      if (environment === 'staging' || request.url !== '/webinars') response.setHeader('X-Robots-Tag', 'noindex, nofollow')
      response.end(readFileSync(join(fixture.output, request.url === '/webinars' ? 'webinars/index.html' : '200.html')))
    })
    try {
      await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
      const address = server.address() as { port: number }
      const options = { baseUrl: `http://127.0.0.1:${address.port}`, artifactDirectory: fixture.output, env: fixture.env }
      await assert.rejects(checkRoutes(options), /HTTP 401/)
      await assert.rejects(checkRoutes({ ...options, env: { ...fixture.env, STAGING_BASIC_AUTH_USER: username, STAGING_BASIC_AUTH_PASSWORD: 'wrong' } }), /HTTP 401/)
      await checkRoutes({ ...options, env: { ...fixture.env, STAGING_BASIC_AUTH_USER: username, STAGING_BASIC_AUTH_PASSWORD: password } })
      assert.equal(authorized, 4)
    } finally {
      await new Promise<void>(resolve => server.close(() => resolve()))
      fixture.cleanup()
    }
  })
}
