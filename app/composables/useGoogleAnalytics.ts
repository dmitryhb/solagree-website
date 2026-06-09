type GoogleAnalyticsEventParams = Record<string, boolean | number | string | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const getGaMeasurementId = (): string => {
  const runtimeConfig = useRuntimeConfig()

  return String(runtimeConfig.public.gaMeasurementId ?? '').trim()
}

const getGtag = () => {
  if (!import.meta.client || typeof window.gtag !== 'function') {
    return null
  }

  return window.gtag.bind(window)
}

const filterAnalyticsParams = (params: GoogleAnalyticsEventParams) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  )
}

const resolvePageLocation = (path: string) => {
  if (!import.meta.client) {
    return path
  }

  return new URL(path, window.location.origin).toString()
}

export const useGoogleAnalytics = () => {
  const isEnabled = () => {
    return import.meta.client && Boolean(getGaMeasurementId())
  }

  const trackEvent = (eventName: string, params: GoogleAnalyticsEventParams = {}) => {
    const measurementId = getGaMeasurementId()
    const gtag = getGtag()

    if (!measurementId || !gtag) {
      return
    }

    gtag('event', eventName, filterAnalyticsParams(params))
  }

  const trackPageView = (path: string, title?: string) => {
    const measurementId = getGaMeasurementId()
    const gtag = getGtag()

    if (!measurementId || !gtag) {
      return
    }

    gtag('event', 'page_view', filterAnalyticsParams({
      page_location: resolvePageLocation(path),
      page_path: path,
      page_title: title
    }))
  }

  return {
    isEnabled,
    trackEvent,
    trackPageView
  }
}
