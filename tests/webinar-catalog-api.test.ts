import { describe, expect, it } from 'vitest'
import { formatWebinarDate, getPublicWebinar, getPublicWebinars, requestWebinarAccess } from '../app/services/webinar-catalog-api'
import type { PortalGetFetcher, PortalFetcher } from '../app/services/portal-api'
import type { WebinarFormState } from '../app/types/webinar'

const webinar = {
  id: 'event-1', title: 'Getting started', description: 'A practical introduction', host: 'Anne',
  startsAt: '2026-11-01T18:00:00Z', timeZone: 'America/New_York', format: 'live' as const,
  audience: 'public' as const, state: 'upcoming' as const
}
const get = (response: unknown): PortalGetFetcher => async <T>() => response as T
const post = (response: unknown): PortalFetcher<WebinarFormState> => async <T>() => response as T
const form = { firstName: 'Avery', lastName: 'Quinn', businessEmail: 'avery@example.com', companyName: '', state: 'NY' }

describe('public webinar catalogue boundary', () => {
  it('keeps provider URLs out of its public UI model', async () => {
    const result = await getPublicWebinars('https://portal.example.com', get({ webinars: [{ ...webinar, recordingUrl: 'private' }] }))
    expect(result).toEqual([webinar])
    expect(result[0]).not.toHaveProperty('recordingUrl')
  })

  it.each([
    { ...webinar, audience: 'partner_only' },
    { ...webinar, startsAt: 'invalid' },
    { ...webinar, timeZone: 'invalid' },
    { ...webinar, state: 'other' }
  ])('rejects private and malformed records', async value => {
    await expect(getPublicWebinar('https://portal.example.com', 'event-1', get({ webinar: value }))).rejects.toThrow()
  })

  it('formats the actual announced timezone across daylight saving changes', () => {
    expect(formatWebinarDate(webinar)).toContain('1:00 PM')
    expect(formatWebinarDate(webinar)).toContain('America/New_York')
  })

  it('allows only the requested event Portal access route', async () => {
    const response = { ok: true, accessPath: '/api/public/webinars/event-1/recording?token=opaque', expiresAt: '2026-11-01T18:15:00Z' }
    await expect(requestWebinarAccess('event-1', form, { portalApiBaseUrl: 'https://portal.example.com', fetcher: post(response) })).resolves.toEqual(response)
    for (const accessPath of ['https://evil.example/recording', '//evil.example/recording', '/api/public/webinars/other/recording?token=x']) {
      await expect(requestWebinarAccess('event-1', form, { portalApiBaseUrl: 'https://portal.example.com', fetcher: post({ ...response, accessPath }) })).rejects.toThrow()
    }
  })
})
