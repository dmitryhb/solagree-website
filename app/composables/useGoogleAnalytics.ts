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
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return null
  }

  return window.gtag.bind(window)
}

const filterAnalyticsParams = (params: GoogleAnalyticsEventParams) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  )
}

/** Removes all URL fragments before page URLs enter analytics, preserving the navigable path and query. */
const sanitizeAnalyticsPagePath = (path: string): string => {
  const fragmentIndex = path.indexOf('#')

  return fragmentIndex === -1 ? path : path.slice(0, fragmentIndex)
}

/** Applies URL-fragment removal to explicit page fields supplied with custom analytics events. */
const sanitizeAnalyticsParams = (params: GoogleAnalyticsEventParams): GoogleAnalyticsEventParams => {
  return Object.fromEntries(Object.entries(params).map(([key, value]) => [
    key,
    (key === 'page_location' || key === 'page_path') && typeof value === 'string'
      ? sanitizeAnalyticsPagePath(value)
      : value
  ]))
}

const resolvePageLocation = (path: string) => {
  if (typeof window === 'undefined') {
    return path
  }

  return new URL(path, window.location.origin).toString()
}

/** Returns the browser's current path and query without any fragment capability. */
const getCurrentAnalyticsPath = (): string => {
  if (typeof window === 'undefined') {
    return ''
  }

  return `${window.location.pathname}${window.location.search}`
}

export const useGoogleAnalytics = () => {
  const isEnabled = () => {
    return typeof window !== 'undefined' && Boolean(getGaMeasurementId())
  }

  const trackEvent = (eventName: string, params: GoogleAnalyticsEventParams = {}) => {
    const measurementId = getGaMeasurementId()
    const gtag = getGtag()

    if (!measurementId || !gtag) {
      return
    }

    const analyticsPath = sanitizeAnalyticsPagePath(getCurrentAnalyticsPath())

    gtag('event', eventName, filterAnalyticsParams({
      ...sanitizeAnalyticsParams(params),
      page_location: resolvePageLocation(analyticsPath),
      page_path: analyticsPath
    }))
  }

  const trackPageView = (path: string, title?: string) => {
    const measurementId = getGaMeasurementId()
    const gtag = getGtag()

    if (!measurementId || !gtag) {
      return
    }

    const analyticsPath = sanitizeAnalyticsPagePath(path)

    gtag('event', 'page_view', filterAnalyticsParams({
      page_location: resolvePageLocation(analyticsPath),
      page_path: analyticsPath,
      page_title: title
    }))
  }

  return {
    isEnabled,
    trackEvent,
    trackPageView
  }
}
