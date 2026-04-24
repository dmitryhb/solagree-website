import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ignoredWarningPatterns = [
  '[plugin nuxt:module-preload-polyfill] Sourcemap is likely to be incorrect',
  '[plugin @tailwindcss/vite:generate:build] Sourcemap is likely to be incorrect'
]

/**
 * Removes ANSI escape codes so warning matching remains stable across terminals.
 *
 * @param {string} value Raw terminal output.
 * @returns {string} Plain-text output without ANSI codes.
 */
const stripAnsi = (value) => value.replace(/\u001B\[[0-9;]*m/g, '')

/**
 * Returns true when a build log line is one of the known false-positive sourcemap warnings.
 *
 * @param {string} line A single output line from the Nuxt build process.
 * @returns {boolean} Whether the line should be suppressed.
 */
const shouldSuppressLine = (line) => {
  const normalizedLine = stripAnsi(line)

  return ignoredWarningPatterns.some((pattern) => normalizedLine.includes(pattern))
}

/**
 * Writes a child-process stream to a target stream while filtering specific warning lines.
 *
 * @param {import('node:stream').Readable} input Child-process stream to read from.
 * @param {NodeJS.WriteStream} output Destination stream.
 * @returns {void}
 */
const pipeFilteredOutput = (input, output) => {
  let bufferedText = ''

  input.setEncoding('utf8')
  input.on('data', (chunk) => {
    bufferedText += chunk

    const lines = bufferedText.split(/\r?\n/)
    bufferedText = lines.pop() ?? ''

    lines.forEach((line) => {
      if (shouldSuppressLine(line)) {
        return
      }

      output.write(`${line}\n`)
    })
  })

  input.on('end', () => {
    if (!bufferedText || shouldSuppressLine(bufferedText)) {
      return
    }

    output.write(bufferedText)
  })
}

const nuxtCliPath = fileURLToPath(new URL('../node_modules/nuxt/bin/nuxt.mjs', import.meta.url))
const buildProcess = spawn(process.execPath, [nuxtCliPath, 'build'], {
  env: process.env,
  stdio: ['inherit', 'pipe', 'pipe']
})

pipeFilteredOutput(buildProcess.stdout, process.stdout)
pipeFilteredOutput(buildProcess.stderr, process.stderr)

buildProcess.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
