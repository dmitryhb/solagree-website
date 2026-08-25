import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  fetchCoBrandedPageConfig,
  normalizeCoBrandedCtaUrl,
  normalizeCoBrandedImageUrl,
  normalizeCoBrandedPageConfig
} from '../app/services/co-branded-page-api'

const PORTAL_BASE_URL = 'https://portal.solagree.test'

const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  Object.assign(globalThis, { $fetch: fetchMock })
})

afterEach(() => {
  delete (globalThis as { $fetch?: unknown }).$fetch
})

describe('normalizeCoBrandedImageUrl', () => {
  it('allows HTTPS partner logos served from the configured portal origin', () => {
    expect(normalizeCoBrandedImageUrl('https://portal.solagree.test/uploads/logo.png', PORTAL_BASE_URL, 'https:'))
      .toBe('https://portal.solagree.test/uploads/logo.png')
  })

  it('resolves portal-relative upload paths against the portal origin', () => {
    expect(normalizeCoBrandedImageUrl('/uploads/logo.png', PORTAL_BASE_URL, 'https:'))
      .toBe('https://portal.solagree.test/uploads/logo.png')
  })

  it('rejects plain http logos on HTTPS pages', () => {
    expect(normalizeCoBrandedImageUrl('http://portal.solagree.test/uploads/logo.png', PORTAL_BASE_URL, 'https:'))
      .toBeNull()
    expect(normalizeCoBrandedImageUrl('/uploads/logo.png', 'http://portal.solagree.test', 'https:'))
      .toBeNull()
  })

  it('allows plain http logos on local http development pages', () => {
    expect(normalizeCoBrandedImageUrl('http://portal.solagree.test/uploads/logo.png', 'http://portal.solagree.test', 'http:'))
      .toBe('http://portal.solagree.test/uploads/logo.png')
  })

  it('rejects unapproved external logo origins', () => {
    expect(normalizeCoBrandedImageUrl('https://evil.example/logo.png', PORTAL_BASE_URL, 'https:'))
      .toBeNull()
    expect(normalizeCoBrandedImageUrl('//evil.example/logo.png', PORTAL_BASE_URL, 'https:'))
      .toBeNull()
    expect(normalizeCoBrandedImageUrl('https://portal.solagree.test.evil.example/logo.png', PORTAL_BASE_URL, 'https:'))
      .toBeNull()
  })

  it('rejects unsafe schemes and malformed values with a safe null fallback', () => {
    expect(normalizeCoBrandedImageUrl('javascript:alert(1)', PORTAL_BASE_URL, 'https:')).toBeNull()
    expect(normalizeCoBrandedImageUrl('data:image/png;base64,AAAA', PORTAL_BASE_URL, 'https:')).toBeNull()
    expect(normalizeCoBrandedImageUrl('   ', PORTAL_BASE_URL, 'https:')).toBeNull()
    expect(normalizeCoBrandedImageUrl(undefined, PORTAL_BASE_URL, 'https:')).toBeNull()
  })

  it('derives the page protocol from the browser location by default', () => {
    // jsdom serves the test page over http, so the dev-style http portal logo
    // stays allowed while the https-only rule is exercised through the
    // explicit pageProtocol parameter above.
    expect(normalizeCoBrandedImageUrl('/uploads/logo.png', PORTAL_BASE_URL))
      .toBe(`${PORTAL_BASE_URL}/uploads/logo.png`)
  })
})

describe('normalizeCoBrandedPageConfig', () => {
  it('keeps a portal-hosted HTTPS logo from either payload field', () => {
    const direct = normalizeCoBrandedPageConfig(
      { logoUrl: 'https://portal.solagree.test/uploads/a.png' },
      'partner',
      PORTAL_BASE_URL
    )
    const nested = normalizeCoBrandedPageConfig(
      { logo: { url: '/uploads/b.png' } },
      'partner',
      PORTAL_BASE_URL
    )

    expect(direct.logoUrl).toBe('https://portal.solagree.test/uploads/a.png')
    expect(nested.logoUrl).toBe('https://portal.solagree.test/uploads/b.png')
  })

  it('omits the partner logo safely when the URL is rejected', () => {
    const config = normalizeCoBrandedPageConfig(
      {
        logoUrl: 'http://portal.solagree.test/uploads/mixed-content.png',
        logo: { url: 'https://evil.example/tracking-pixel.png' }
      },
      'partner',
      PORTAL_BASE_URL,
      'standard',
      'https:'
    )

    expect(config.logoUrl).toBeNull()
  })

  it('falls back to the default CTA URL when the partner CTA targets a foreign host', () => {
    const config = normalizeCoBrandedPageConfig(
      { ctaUrl: 'https://evil.example/book' },
      'partner',
      PORTAL_BASE_URL
    )

    expect(config.ctaUrl).toBe('/book-an-attorney-consult?ref=partner')
  })

  it('keeps approved site CTA URLs', () => {
    expect(normalizeCoBrandedCtaUrl('https://www.solagree.com/book-a-solagree-consult?x=1', 'partner', 'cdfa'))
      .toBe('https://www.solagree.com/book-a-solagree-consult?x=1')
    expect(normalizeCoBrandedCtaUrl('/book-an-attorney-consult', 'partner', 'standard'))
      .toBe('/book-an-attorney-consult')
  })
})

describe('fetchCoBrandedPageConfig', () => {
  it('returns null only for portal-confirmed missing slugs', async () => {
    fetchMock.mockImplementation(async () => {
      throw Object.assign(new Error('404 Not Found'), { statusCode: 404 })
    })

    expect(await fetchCoBrandedPageConfig({
      portalApiBaseUrl: PORTAL_BASE_URL,
      slug: 'missing-partner'
    })).toBeNull()

    expect(fetchMock).toHaveBeenCalledWith(`${PORTAL_BASE_URL}/api/public/co-branded-pages/missing-partner`)
  })

  it('propagates upstream failures so the route can preserve their status', async () => {
    const upstreamError = Object.assign(new Error('503 Service Unavailable'), { statusCode: 503 })

    fetchMock.mockImplementation(async () => {
      throw upstreamError
    })

    await expect(fetchCoBrandedPageConfig({
      portalApiBaseUrl: PORTAL_BASE_URL,
      slug: 'partner'
    })).rejects.toBe(upstreamError)
  })

  it('returns null for a blank slug without calling the portal', async () => {
    expect(await fetchCoBrandedPageConfig({
      portalApiBaseUrl: PORTAL_BASE_URL,
      slug: '   '
    })).toBeNull()

    expect(fetchMock).not.toHaveBeenCalled()
  })
})
