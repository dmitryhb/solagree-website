import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSolagreeSeo } from '../app/composables/useSolagreeSeo'

afterEach(() => vi.unstubAllGlobals())
describe('deployment SEO policy', () => {
  it.each([
    ['production', false, 'index, follow'],
    ['production', true, 'noindex, nofollow'],
    ['staging', false, 'noindex, nofollow'],
    ['development', false, 'noindex, nofollow']
  ])('sets robots for %s and explicit noindex %s', (environment, noIndex, expected) => {
    const meta = vi.fn()
    vi.stubGlobal('useRoute', () => ({ path: '/' }))
    vi.stubGlobal('useRuntimeConfig', () => ({ public: { deploymentEnvironment: environment, siteUrl: 'https://www.solagree.com' } }))
    vi.stubGlobal('useHead', vi.fn())
    vi.stubGlobal('useSeoMeta', meta)
    useSolagreeSeo({ title: 'Home', description: 'Description', noIndex })
    expect(meta.mock.calls[0]?.[0].robots.value).toBe(expected)
  })
})
