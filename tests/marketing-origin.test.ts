import { beforeEach, describe, expect, it, vi } from 'vitest'
import { installMarketingOriginRuntime, parseBrowserMarketingCapture, prepareWebsiteMarketingSubmission } from '../app/services/marketing-origin'

const context = { journeyId: 'c83d057c-1d48-4f59-9129-207df871fbdf', proof: 'a'.repeat(64) }
const storage = new Map<string, string>()
const capture = vi.fn(async () => context)
const clear = vi.fn()
beforeEach(() => {
  storage.clear(); capture.mockClear(); clear.mockClear()
  installMarketingOriginRuntime({ capture, clear, storage: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => { storage.set(key, value) },
    removeItem: key => { storage.delete(key) }
  } as Storage })
})
describe('origin submission lifecycle', () => {
  it('failed exact retry keeps identity and proof; success permits distinct inquiry even for identical email/payload', async () => {
    const payload = { email: 'same@example.test', message: 'A separate inquiry' }
    const first = await prepareWebsiteMarketingSubmission('/api/contact-submissions', payload)
    const retry = await prepareWebsiteMarketingSubmission('/api/contact-submissions', payload)
    expect(first.body).toEqual(retry.body)
    expect(capture).toHaveBeenCalledTimes(1)
    expect([...storage.values()].join()).not.toContain(payload.email)
    expect([...storage.keys()].join()).not.toContain(payload.email)
    first.complete()
    expect(clear).toHaveBeenCalledTimes(1)
    const separate = await prepareWebsiteMarketingSubmission('/api/contact-submissions', payload)
    expect(separate.body).not.toEqual(first.body)
  })
  it('does not attach context to unsupported application/provider requests', async () => {
    const payload = { email: 'person@example.test' }
    expect((await prepareWebsiteMarketingSubmission('/api/attorney-applications', payload)).body).toBe(payload)
    expect(capture).not.toHaveBeenCalled()
  })
  it('rejects damaged persisted context before server validation', () => {
    expect(parseBrowserMarketingCapture(JSON.stringify({ context, expiresAt: '2026-12-01T00:00:00Z' }))?.context).toEqual(context)
    expect(parseBrowserMarketingCapture('bad-json')).toBeNull()
    expect(parseBrowserMarketingCapture(JSON.stringify({ context: { ...context, proof: 'bad' }, expiresAt: '2026-12-01' }))).toBeNull()
  })
})
