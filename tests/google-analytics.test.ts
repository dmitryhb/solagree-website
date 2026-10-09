import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGoogleAnalytics } from '../app/composables/useGoogleAnalytics'

const gtag = vi.fn()

describe('Google Analytics page context', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('useRuntimeConfig', () => ({ public: { gaMeasurementId: 'G-HIR259' } }))
    window.gtag = gtag
    window.history.replaceState(null, '', '/faq?section=professional-partners#access_token=opaque-capability')
  })

  it('uses the current fragment-free path for custom events instead of persisted or caller-provided context', () => {
    useGoogleAnalytics().trackEvent('quiz_started', {
      page_location: 'https://example.test/old#access_token=caller-token',
      page_path: '/old#access_token=caller-token'
    })

    expect(gtag).toHaveBeenCalledWith('event', 'quiz_started', {
      page_location: `${window.location.origin}/faq?section=professional-partners`,
      page_path: '/faq?section=professional-partners'
    })
    expect(JSON.stringify(gtag.mock.calls)).not.toContain('opaque-capability')
    expect(JSON.stringify(gtag.mock.calls)).not.toContain('caller-token')
  })

  it('strips emailed capabilities from explicit page views while preserving the query', () => {
    useGoogleAnalytics().trackPageView('/webinars/event-1?source=email#access_token=opaque-capability', 'Webinar')

    expect(gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_location: `${window.location.origin}/webinars/event-1?source=email`,
      page_path: '/webinars/event-1?source=email',
      page_title: 'Webinar'
    })
    expect(JSON.stringify(gtag.mock.calls)).not.toContain('opaque-capability')
  })
})
