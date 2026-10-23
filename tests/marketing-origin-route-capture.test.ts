import { afterEach, expect, it, vi } from 'vitest'

vi.mock('../app/services/marketing-origin', () => ({
  installMarketingOriginRuntime: vi.fn(),
  parseBrowserMarketingCapture: () => null
}))

afterEach(() => { vi.unstubAllGlobals(); localStorage.clear() })

it.each([
  '/go/partner-a', '/go/partner-a/embed',
  '/cdfa/go/partner-a', '/cdfa/go/partner-a/embed',
  '/co-branded/partner-a'
])('preserves partner entry %s when navigation outruns an earlier capture request', async (partnerPath) => {
  let release!: () => void
  const initialRequest = new Promise<void>(resolve => { release = resolve })
  let onNavigation!: (_to: unknown, _from: unknown, failure?: unknown) => void
  const router = {
    currentRoute: { value: { path: '/', query: {} } },
    afterEach: (callback: typeof onNavigation) => { onNavigation = callback }
  }
  const observed: Array<{ referralCode: string | null, entrySurface: string }> = []
  vi.stubGlobal('defineNuxtPlugin', (plugin: () => void) => plugin)
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { portalApiBaseUrl: 'http://portal.example.test' } }))
  vi.stubGlobal('useRouter', () => router)
  vi.stubGlobal('useState', () => ({ value: null }))
  vi.stubGlobal('$fetch', async (_url: string, options: { body: typeof observed[number] }) => {
    observed.push({ referralCode: options.body.referralCode, entrySurface: options.body.entrySurface })
    if (observed.length === 1) await initialRequest
    return {
      context: { journeyId: 'c83d057c-1d48-4f59-9129-207df871fbdf', proof: 'a'.repeat(64) },
      expiresAt: '2027-01-01T00:00:00Z'
    }
  })
  const { default: plugin } = await import('../app/plugins/marketing-origin.client')
  plugin()
  await vi.waitFor(() => { expect(observed).toHaveLength(1) })
  router.currentRoute.value = { path: partnerPath, query: {} }
  onNavigation(null, null)
  router.currentRoute.value = { path: '/book-a-solagree-consult', query: {} }
  onNavigation(null, null)
  release()
  await vi.waitFor(() => { expect(observed).toHaveLength(3) })
  expect(observed).toEqual([
    { referralCode: null, entrySurface: 'website' },
    { referralCode: 'partner-a', entrySurface: 'co_branded' },
    { referralCode: null, entrySurface: 'booking' }
  ])
})
