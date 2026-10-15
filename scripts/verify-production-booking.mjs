import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { verifyMeetingModes } from './lib/meeting-mode.mjs'

try {
  const environment = 'production'
  const expectedMode = process.env.NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_MEETING_METHOD_MODE
  const approved = process.env.PRODUCTION_NATIVE_ACTIVATION_APPROVED === 'true'
  if (!['mixed', 'separate'].includes(expectedMode)) throw new Error('production Initial Consult meetingMethodMode must be mixed or separate')
  if (expectedMode === 'separate' && !approved) throw new Error('production separate mode requires explicit native activation approval (PRODUCTION_NATIVE_ACTIVATION_APPROVED=true)')
  const phonePaths = {}
  for (const [field, variable] of Object.entries({ firstAvailable: 'FIRST_AVAILABLE', taj: 'TAJ', stacie: 'STACIE', jessica: 'JESSICA', james: 'JAMES' })) {
    const path = (process.env[`NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_${variable}_PHONE_EVENT_PATH`] ?? '').trim()
    // Match the embed path contract in shared/initial-consult-booking.ts.
    if (path && !/^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)+$/i.test(path)) throw new Error(`production ${field} Phone event path must be a Cal.com team/event path`)
    phonePaths[`${field}PhoneEventPath`] = path
  }
  if (!process.argv.includes('--policy-only')) {
    const artifact = fileURLToPath(new URL('../.output/public', import.meta.url))
    const manifest = JSON.parse(readFileSync(join(artifact, 'release-manifest.json'), 'utf8'))
    verifyMeetingModes(manifest, artifact, { environment, approved, expectedMode, phonePaths })
    console.log('Production Initial Consult artifact policy verified')
  }
} catch (error) {
  console.error(`Production booking verification failed: ${error.message}`)
  process.exitCode = 1
}
