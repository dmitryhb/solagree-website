import { fileURLToPath } from 'node:url'
import { checkRoutes } from './lib/route-http-contract.mjs'

try {
  const args = process.argv.slice(2)
  const value = name => args[args.indexOf(name) + 1]
  if (!args.includes('--site-url')) throw new Error('--site-url is required')
  const siteUrl = new URL(value('--site-url'))
  if (!['http:', 'https:'].includes(siteUrl.protocol) || siteUrl.username || siteUrl.password || siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash) {
    throw new Error('--site-url must be an HTTP(S) origin without credentials')
  }
  await checkRoutes({
    baseUrl: siteUrl.origin,
    artifactDirectory: fileURLToPath(new URL('../.output/public', import.meta.url)),
    resolve: args.includes('--resolve') ? value('--resolve') : undefined,
    insecure: args.includes('--insecure'),
    env: { ...process.env, ...(!args.includes('--staging-auth') ? { STAGING_BASIC_AUTH_USER: '', STAGING_BASIC_AUTH_PASSWORD: '' } : {}) }
  })
} catch (error) {
  console.error(`Route verification failed: ${error.message}`)
  process.exitCode = 1
}
