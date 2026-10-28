// Linux permission boundary for the existing cross-platform release fixture.
// Account/group provisioning is confined to an ephemeral container. Production
// source never provisions users, changes groups or adjusts ancestor permissions.
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

export function protectedNginx(fixture) {
  const evidence = join(fixture.directory, 'target-worker-evidence.json')
  fixture.executable('nginx', `#!${process.execPath}
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
const args = process.argv.slice(2), prefix = args[args.indexOf('-p') + 1], path = args[args.indexOf('-c') + 1]
const name = 'solagree-protected-' + createHash('sha256').update(prefix).digest('hex').slice(0, 16)
const run = argv => execFileSync('docker', argv, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
const cleanup = () => spawnSync('docker', ['rm', '-f', name], { stdio: 'ignore' })
if (args.includes('-s')) { cleanup(); process.exit(0) }
const original = readFileSync(path, 'utf8'), port = original.match(/listen 127\\.0\\.0\\.1:(\\d+)/)[1]
const source = ${JSON.stringify(fixture.directory)}
const config = original.replaceAll(source, '/home/qa_solagree').replace('listen 127.0.0.1:', 'listen 0.0.0.0:')
const translated = path.replace(source, '/home/qa_solagree')
try {
  if (args.includes('-t')) {
    run(['run', '--pull=never', '--rm', '-d', '--name', name, '--entrypoint', '/bin/sh', '-v', source + ':/source:ro', '-p', '127.0.0.1:' + port + ':' + port, 'nginx:1.29-alpine', '-c', 'sleep 120'])
    // Mimic a pre-existing www-data account with the protected app's group.
    run(['exec', name, 'adduser', '-S', '-D', '-H', '-u', '33', '-G', 'www-data', 'www-data'])
    run(['exec', name, 'addgroup', '-g', '1005', 'qa_fixture'])
    run(['exec', name, 'addgroup', 'www-data', 'qa_fixture'])
    run(['exec', name, 'adduser', '-S', '-D', '-H', '-u', '1005', '-G', 'qa_fixture', 'qa_app'])
    run(['exec', name, 'mkdir', '-p', '/home/qa_solagree'])
    run(['exec', name, 'cp', '-a', '/source/.', '/home/qa_solagree/'])
    run(['exec', name, 'chown', '-R', 'root:root', '/home/qa_solagree'])
    run(['exec', name, 'chown', 'root:qa_fixture', '/home/qa_solagree'])
    run(['exec', name, 'chmod', '750', '/home/qa_solagree'])
    execFileSync('docker', ['exec', '-i', name, 'sh', '-c', 'cat > "$1"', 'fixture', translated], { input: config })
  }
  run(['exec', name, 'nginx', '-p', prefix.replace(source, '/home/qa_solagree') + '/', '-c', translated, ...(args.includes('-t') ? ['-t'] : [])])
  if (!args.includes('-t')) {
    const artifact = original.match(/root ([^;]+);/)[1].replace(source, '/home/qa_solagree')
    const probe = (user, flag, path) => {
      if (!/^[A-Za-z0-9_./-]+$/.test(path)) throw new Error('unsafe fixture path')
      return spawnSync('docker', ['exec', name, 'su', '-s', '/bin/sh', '-c', 'test ' + flag + ' ' + path, user], { encoding: 'utf8' }).status === 0
    }
    const status = run(['exec', name, 'sh', '-c', 'for p in /proc/[0-9]*; do if [ "$(cat "$p/comm" 2>/dev/null)" = nginx ]; then cat "$p/status"; fi; done'])
    writeFileSync(${JSON.stringify(evidence)}, JSON.stringify({ directive: /^user www-data;$/m.test(original), home: run(['exec', name, 'stat', '-c', '%u:%g:%a', '/home/qa_solagree']).trim(), wwwDataId: run(['exec', name, 'id', 'www-data']).trim(), nobodyCanRead: probe('nobody', '-r', artifact + '/200.html'), defaultCanRead: probe('nginx', '-r', artifact + '/200.html'), workerCanRead: probe('www-data', '-r', artifact + '/200.html'), workerCanWrite: probe('www-data', '-w', artifact + '/200.html'), workerCanWriteHome: probe('www-data', '-w', '/home/qa_solagree'), appCanWrite: probe('qa_app', '-w', artifact + '/200.html'), appCanWriteHome: probe('qa_app', '-w', '/home/qa_solagree'), status }))
  }
} catch (error) { cleanup(); if (error.stderr) process.stderr.write(error.stderr); throw error }
`)
  return { evidence }
}

export function candidateAs(fixture, release, environment, effectiveUid) {
  // The cross-platform Python caller models the publisher UID; the actual nginx
  // master/worker, protected inode ownership, groups and HTTP are all Linux.
  const code = `import importlib.util,json,os,sys
spec=importlib.util.spec_from_file_location('host',sys.argv[1]);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
h.os.geteuid=lambda:int(sys.argv[3])
request=json.loads(sys.stdin.read());h.Host(request).candidate_http(sys.argv[2])
`
  return spawnSync('python3', ['-B', '-c', code, join(fixture.directory, 'scripts/lib/release-host.py'), release, String(effectiveUid)], { input: JSON.stringify({ root: fixture.target, store: fixture.store, policy: { environment } }), cwd: fixture.directory, env: fixture.env, encoding: 'utf8' })
}
