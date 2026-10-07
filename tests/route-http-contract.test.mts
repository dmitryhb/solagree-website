import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { checkRoutes } from '../scripts/lib/route-http-contract.mjs'
import { releaseFixture } from './fixtures/release-deploy.mjs'

for (const mode of ['valid', '301', '401', '404', '500', '503', 'connection-error', 'missing-noindex', 'wrong-body', 'auth-page', 'wrong-content-type', 'catalogue-noindex']) {
  test(`HTTP contract: ${mode}`, async () => {
    const fixture = releaseFixture('staging')
    const server = createServer((request, response) => {
      if (mode === 'connection-error') { request.socket.destroy(); return }
      const catalogue = request.url === '/webinars'
      response.statusCode = /^\d+$/.test(mode) ? Number(mode) : 200
      response.setHeader('Content-Type', mode === 'wrong-content-type' ? 'application/json' : 'text/html; charset=utf-8')
      if ((!catalogue && mode !== 'missing-noindex') || mode === 'catalogue-noindex') response.setHeader('X-Robots-Tag', 'noindex, nofollow')
      if (mode === '301') response.setHeader('Location', '/other')
      response.end(mode === 'wrong-body' ? '<html>proxy error</html>' : mode === 'auth-page' ? '<html>Login required</html>' : readFileSync(join(fixture.output, catalogue ? 'webinars/index.html' : '200.html')))
    })
    try {
      await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
      const address = server.address() as { port: number }
      const promise = checkRoutes({ baseUrl: `http://127.0.0.1:${address.port}`, artifactDirectory: fixture.output, env: fixture.env })
      if (mode === 'valid') await promise
      else await assert.rejects(promise, /^Error:/)
    } finally {
      await new Promise<void>(resolve => server.close(() => resolve()))
      fixture.cleanup()
    }
  })
}

test('protected staging accepts correct BasicAuth on every probe and rejects absent/wrong credentials', async () => {
  const fixture = releaseFixture('staging')
  const username = 'test-user'
  const password = 'test:password"\\value'
  let authorized = 0
  const server = createServer((request, response) => {
    const valid = request.headers.authorization === `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    if (!valid) { response.writeHead(401); response.end('Unauthorized'); return }
    authorized++
    response.setHeader('Content-Type', 'text/html')
    if (request.url !== '/webinars') response.setHeader('X-Robots-Tag', 'noindex, nofollow')
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
