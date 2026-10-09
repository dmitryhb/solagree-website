import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'

const docker = (...args) => {
  const result = spawnSync('docker', args, { encoding: 'utf8', timeout: 30000 })
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message || 'Docker failed')
  return result.stdout.trim()
}
const available = spawnSync('docker', ['info'], { timeout: 10000, stdio: 'ignore' }).status === 0

test('nginx Website policy preserves embeds, protects HTML and keeps real 404s', { skip: !available && 'Docker unavailable' }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'hir658-nginx-'))
  const name = `hir658-${process.pid}-${Date.now()}`
  try {
    mkdirSync(join(dir, 'site'), { recursive: true })
    mkdirSync(join(dir, 'snippets'))
    for (const file of ['index.html', '200.html', '404.html']) writeFileSync(join(dir, 'site', file), file)
    mkdirSync(join(dir, 'site', 'quiz', 'embed'), { recursive: true })
    writeFileSync(join(dir, 'site', 'quiz', 'embed', 'index.html'), 'Quiz embed')
    mkdirSync(join(dir, 'site', 'contact'))
    writeFileSync(join(dir, 'site', 'contact', 'index.html'), 'Contact')
    for (const file of ['co-branded-noindex.conf', 'legacy-redirects.conf', 'solagree-static-routes.conf', 'solagree-security-maps.conf']) {
      cpSync(resolve('config/nginx', file), join(dir, 'snippets', file))
    }
    cpSync(resolve('config/nginx/solagree-security-headers.conf'), join(dir, 'snippets/solagree-website-security-headers.conf'))
    writeFileSync(join(dir, 'nginx.conf'), `events {}\nhttp {
      include /etc/nginx/snippets/solagree-security-maps.conf;
      server {
        listen 8080; server_name _; root /site; index index.html;
        include /etc/nginx/snippets/solagree-website-security-headers.conf;
        include /etc/nginx/snippets/co-branded-noindex.conf;
        include /etc/nginx/snippets/legacy-redirects.conf;
        include /etc/nginx/snippets/solagree-static-routes.conf;
      }
    }`)
    docker('run', '--rm', '-d', '--name', name, '-v', `${dir}/nginx.conf:/etc/nginx/nginx.conf:ro`, '-v', `${dir}/snippets:/etc/nginx/snippets:ro`, '-v', `${dir}/site:/site:ro`, 'nginx:1.27-alpine')
    docker('exec', name, 'nginx', '-t')
    const request = (path, host = 'www.solagree.com') => {
      const response = spawnSync('docker', ['exec', '-i', name, 'nc', '-w', '1', '127.0.0.1', '8080'], {
        input: `GET ${path} HTTP/1.0\r\nHost: ${host}\r\n\r\n`, encoding: 'utf8', timeout: 10000
      })
      assert.equal(response.status, 0, response.stderr)
      return response.stdout
    }
    for (const path of ['/', '/go/firm/', '/webinars/event', '/meet/consult']) {
      const response = request(path)
      assert.match(response, /^HTTP\/1.1 200/, path)
      assert.match(response, /X-Content-Type-Options: nosniff/i, path)
      assert.match(response, /Strict-Transport-Security: max-age=31536000; includeSubDomains/i, path)
      assert.match(response, /Content-Security-Policy: frame-ancestors 'self'/i, path)
      assert.match(response, /Cache-Control: no-cache/i, path)
    }
    for (const path of ['/go/firm/embed', '/cdfa/go/firm/embed', '/quiz/embed']) {
      const response = request(path)
      assert.match(response, /^HTTP\/1.1 (200|301)/, path)
      assert.doesNotMatch(response, /Content-Security-Policy: frame-ancestors/i, path)
    }
    assert.match(request('/c/foo?ref=a'), /Location: .*\/meet\/foo\?ref=a\r?$/im)
    assert.match(request('/random-junk'), /^HTTP\/1.1 404/)
    assert.match(request('/', 'solagree.qamachine.com'), /X-Robots-Tag: noindex, nofollow/i)
    assert.match(request('/contact'), /^HTTP\/1.1 301/)
    assert.match(request('/contact/'), /^HTTP\/1.1 200/)
  } finally {
    spawnSync('docker', ['rm', '-f', name], { stdio: 'ignore', timeout: 10000 })
    rmSync(dir, { recursive: true, force: true })
  }
})

test('legacy recording pages opt out of indexing', () => {
  for (const page of ['app/pages/webinar/view.vue', 'app/pages/webinar/cdfa/view.vue']) {
    assert.match(readFileSync(page, 'utf8'), /noIndex: true/)
  }
})
