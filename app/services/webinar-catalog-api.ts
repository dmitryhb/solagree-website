import { normalizePortalApiBaseUrl, submitToPortal } from '~/services/portal-api'
import type { PortalGetFetcher, PortalSubmitOptions } from '~/services/portal-api'
import type { WebinarAccessResponse, WebinarCatalogItem } from '~/types/webinar-catalog'
import type { WebinarFormState } from '~/types/webinar'

const failureMessage = 'Webinars are temporarily unavailable. Please try again.'
const publicEndpoint = '/api/public/webinars'

/** Rejects malformed or restricted records instead of rendering an unsafe upstream response. */
const parseWebinar = (value: unknown): WebinarCatalogItem => {
  if (!value || typeof value !== 'object') throw new Error(failureMessage)
  const item = value as Record<string, unknown>
  if (['id', 'title', 'description', 'host'].some(key => typeof item[key] !== 'string' || !item[key])
    || item.audience !== 'public'
    || !['live', 'on_demand'].includes(String(item.format))
    || !['upcoming', 'live', 'recording_coming_soon', 'on_demand'].includes(String(item.state))
    || !(item.startsAt === null || (typeof item.startsAt === 'string' && Number.isFinite(Date.parse(item.startsAt))))
    || !(item.timeZone === null || typeof item.timeZone === 'string')) throw new Error(failureMessage)
  if (item.timeZone) {
    try { new Intl.DateTimeFormat('en-US', { timeZone: String(item.timeZone) }) } catch { throw new Error(failureMessage) }
  }
  return {
    id: String(item.id), title: String(item.title), description: String(item.description), host: String(item.host),
    startsAt: item.startsAt as string | null, timeZone: item.timeZone as string | null,
    format: item.format as WebinarCatalogItem['format'], audience: 'public', state: item.state as WebinarCatalogItem['state']
  }
}

/** Fetches only public metadata and validates the response before rendering. */
export const getPublicWebinars = async (baseUrl: string, fetcher: PortalGetFetcher): Promise<WebinarCatalogItem[]> => {
  const response = await fetcher<{ webinars?: unknown }>(`${normalizePortalApiBaseUrl(baseUrl)}${publicEndpoint}`)
  if (!response || !Array.isArray(response.webinars)) throw new Error(failureMessage)
  return response.webinars.map(parseWebinar)
}

/** Fetches public detail; Portal owns access checks and 404 responses. */
export const getPublicWebinar = async (baseUrl: string, id: string, fetcher: PortalGetFetcher): Promise<WebinarCatalogItem> => {
  const response = await fetcher<{ webinar?: unknown }>(`${normalizePortalApiBaseUrl(baseUrl)}${publicEndpoint}/${encodeURIComponent(id)}`)
  return parseWebinar(response?.webinar)
}

/** Builds the checked Portal redirect route, never an unvalidated provider URL. */
export const getWebinarLiveRegistrationUrl = (baseUrl: string, id: string): string =>
  `${normalizePortalApiBaseUrl(baseUrl)}${publicEndpoint}/${encodeURIComponent(id)}/register`

/** Captures the lead against the event identity and returns a validated, same-Portal access route. */
export const requestWebinarAccess = async (
  id: string,
  form: WebinarFormState,
  options: PortalSubmitOptions<WebinarFormState>
): Promise<WebinarAccessResponse> => submitToPortal({
  ...options,
  endpoint: `${publicEndpoint}/${encodeURIComponent(id)}/access`,
  payload: form,
  fallbackMessage: 'We could not open this recording. Please try again.',
  parseSuccess: (response) => {
    const value = response as Partial<WebinarAccessResponse>
    const expected = `${publicEndpoint}/${encodeURIComponent(id)}/recording?`
    if (value.ok !== true || typeof value.accessPath !== 'string' || !value.accessPath.startsWith(expected)
      || typeof value.expiresAt !== 'string' || !Number.isFinite(Date.parse(value.expiresAt))) return null
    return { ok: true, accessPath: value.accessPath, expiresAt: value.expiresAt }
  }
})

/** Formats event time in its announced timezone so viewers receive an unambiguous date. */
export const formatWebinarDate = (item: WebinarCatalogItem): string => item.startsAt
  ? new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long', timeStyle: 'short', timeZone: item.timeZone || 'UTC'
    }).format(new Date(item.startsAt)) + ` (${item.timeZone || 'UTC'})`
  : 'Watch on demand'
