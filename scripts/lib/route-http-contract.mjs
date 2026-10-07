import { spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export function verifyResponse({ status, headers, body, expectedBody, noindex, route }) {
  if (status !== '200') throw new Error(`${route} returned HTTP ${status}; expected an authorized HTTP 200 response`)
  // curl can include proxy CONNECT or informational headers: use only the final response block.
  const finalHeaders = headers.trim().split(/\r?\n\r?\n/).at(-1) ?? ''
  const values = name => [...finalHeaders.matchAll(new RegExp(`^${name}:([^\\r\\n]*)`, 'gim'))].map(match => match[1].trim()).join(',')
  if (!/^text\/html(?:\s*;|$)/i.test(values('content-type'))) throw new Error(`${route} did not return HTML`)
  const robots = values('x-robots-tag').toLowerCase().split(/[\s,]+/)
  if (noindex && (!robots.includes('noindex') || !robots.includes('nofollow'))) {
    throw new Error(`${route} responded without an X-Robots-Tag: noindex, nofollow header`)
  }
  if (!noindex && (robots.includes('noindex') || robots.includes('none'))) throw new Error('webinar catalogue check failed: /webinars must remain indexable')
  if (!body.equals(expectedBody)) throw new Error(`${route} body does not match the generated ${noindex ? 'HTML fallback' : 'webinar catalogue'}`)
}

export async function checkRoutes({ baseUrl, artifactDirectory, resolve, insecure = false, env = process.env }) {
  const username = env.STAGING_BASIC_AUTH_USER ?? ''
  const password = env.STAGING_BASIC_AUTH_PASSWORD ?? ''
  if (Boolean(username) !== Boolean(password)) throw new Error('STAGING_BASIC_AUTH_USER and STAGING_BASIC_AUTH_PASSWORD must be set together')
  if (/[:\r\n]/.test(username) || /[\r\n]/.test(password)) throw new Error('Staging BasicAuth credentials contain unsupported characters')
  const credentials = `${username}:${password}`.replaceAll('\\', '\\\\').replaceAll('"', '\\"')
  const authConfig = username ? `user = "${credentials}"\n` : ''
  const directory = mkdtempSync(join(tmpdir(), 'solagree-route-check-'))
  try {
    for (const [route, file, noindex] of [
      ['/go/__co-branded-route-check__', '200.html', true],
      ['/cdfa/go/__co-branded-route-check__', '200.html', true],
      ['/webinars/__webinar-route-check__', '200.html', true],
      ['/webinars', 'webinars/index.html', false]
    ]) {
      const headerPath = join(directory, 'headers')
      const bodyPath = join(directory, 'body')
      const args = ['-sS', '--connect-timeout', '10', '--max-time', '30', '--compressed', '-D', headerPath, '-o', bodyPath, '-w', '%{http_code}']
      if (resolve) args.push('--resolve', resolve)
      if (insecure) args.push('--insecure')
      if (authConfig) args.push('--config', '-')
      args.push(`${baseUrl.replace(/\/$/, '')}${route}`)
      const result = await new Promise((resolveResult, reject) => {
        const child = spawn('curl', args, { env, stdio: ['pipe', 'pipe', 'pipe'] })
        let status = ''
        child.stdout.on('data', chunk => { status += chunk })
        // Do not echo curl stderr or credentials. The route and error class are enough.
        child.stderr.resume()
        child.stdin.on('error', () => {})
        child.on('error', () => reject(new Error(`${route} connection error: curl could not start`)))
        child.on('close', code => resolveResult({ code, status: status.trim() }))
        child.stdin.end(authConfig)
      })
      if (result.code !== 0) throw new Error(`${route} connection error; route verification failed`)
      verifyResponse({ status: result.status, headers: readFileSync(headerPath, 'utf8'), body: readFileSync(bodyPath), expectedBody: readFileSync(join(artifactDirectory, file)), noindex, route })
      console.log(`Route check passed: ${route} returned HTTP 200 with the generated HTML${noindex ? ' and noindex' : ' and is indexable'}`)
    }
  } finally { rmSync(directory, { recursive: true, force: true }) }
}
