import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { checkRoutes } from '../scripts/lib/route-http-contract.mjs'

test('HTTP verification refuses missing or unknown contexts before making requests', async () => {
  for (const httpContext of [undefined, 'staging', 'skip-catalogue', false]) {
    await assert.rejects(checkRoutes({ httpContext }), /trusted explicit HTTP verification context/)
  }
})

test('release host can be imported normally without executing its stdin CLI', () => {
  const helper = fileURLToPath(new URL('../scripts/lib/release-host.py', import.meta.url))
  assert.equal(execFileSync('python3', ['-c', 'import importlib.util,sys; spec=importlib.util.spec_from_file_location("host",sys.argv[1]); module=importlib.util.module_from_spec(spec); spec.loader.exec_module(module); assert callable(module.Host.candidate_http); assert callable(module.verify_bundle); print("imported")', helper], { encoding: 'utf8', input: 'invalid JSON' }).trim(), 'imported')
})
