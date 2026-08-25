import { normalizePortalApiBaseUrl } from '~/services/portal-api'
import type { CoBrandedPagePublicConfig } from '#shared/types/co-branded-page'
import {
  resolveCoBrandedPageTemplateId,
  type CoBrandedPageType
} from '#shared/co-branded-page-variant'

const CO_BRANDED_PAGE_ENDPOINT_PREFIX_BY_TYPE = {
  standard: '/api/public/co-branded-pages',
  cdfa: '/api/public/cdfa-co-branded-pages'
} as const satisfies Record<CoBrandedPageType, string>
const APPROVED_CO_BRANDED_CTA_PATHS = ['/book-a-solagree-consult', '/book-an-attorney-consult']
const APPROVED_CO_BRANDED_CTA_HOSTS = ['solagree.com', 'www.solagree.com']
const APPROVED_CO_BRANDED_URL_PROTOCOLS = ['http:', 'https:']

interface RawCoBrandedPagePublicConfig {
  slug?: unknown
  templateId?: unknown
  companyName?: unknown
  partnerCompany?: unknown
  attorneyName?: unknown
  contactName?: unknown
  name?: unknown
  firmName?: unknown
  emailAddress?: unknown
  email?: unknown
  phoneNumber?: unknown
  phone?: unknown
  logoUrl?: unknown
  logo?: unknown
  ctaUrl?: unknown
}

export interface FetchCoBrandedPageOptions {
  portalApiBaseUrl: string
  slug: string
  pageType?: CoBrandedPageType
}

const isRecord = (value: unknown): value is RawCoBrandedPagePublicConfig => {
  return typeof value === 'object' && value !== null
}

const normalizeOptionalString = (value: unknown): string | null => {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

const getDefaultCtaUrl = (slug: string, pageType: CoBrandedPageType): string => {
  const ctaPath = pageType === 'standard' ? '/book-an-attorney-consult' : '/book-a-solagree-consult'

  return `${ctaPath}?ref=${encodeURIComponent(slug)}`
}

const isApprovedCtaPath = (pathname: string): boolean => {
  return APPROVED_CO_BRANDED_CTA_PATHS.some((approvedPath) => {
    return pathname === approvedPath || pathname.startsWith(`${approvedPath}/`)
  })
}

const isApprovedCtaHost = (hostname: string): boolean => {
  const normalizedHostname = hostname.toLowerCase()

  return APPROVED_CO_BRANDED_CTA_HOSTS.includes(normalizedHostname)
}

/**
 * Allows only approved site-relative paths and approved Solagree http(s) hosts
 * before a partner-provided CTA URL reaches the HTML template.
 */
export const normalizeCoBrandedCtaUrl = (
  value: unknown,
  fallbackSlug: string,
  pageType: CoBrandedPageType
): string => {
  const ctaUrl = normalizeOptionalString(value)
  const fallbackUrl = getDefaultCtaUrl(fallbackSlug, pageType)

  if (!ctaUrl) {
    return fallbackUrl
  }

  try {
    if (ctaUrl.startsWith('/')) {
      const parsedRelativeUrl = new URL(ctaUrl, 'https://www.solagree.com')

      return isApprovedCtaPath(parsedRelativeUrl.pathname)
        ? `${parsedRelativeUrl.pathname}${parsedRelativeUrl.search}${parsedRelativeUrl.hash}`
        : fallbackUrl
    }

    const parsedAbsoluteUrl = new URL(ctaUrl)

    return APPROVED_CO_BRANDED_URL_PROTOCOLS.includes(parsedAbsoluteUrl.protocol)
      && isApprovedCtaHost(parsedAbsoluteUrl.hostname)
      && isApprovedCtaPath(parsedAbsoluteUrl.pathname)
      ? parsedAbsoluteUrl.toString()
      : fallbackUrl
  } catch {
    return fallbackUrl
  }
}

/**
 * Protocol of the page rendering the partner logo. Co-branded configuration
 * only loads on the client, so production normalization reads the browser
 * location; non-browser callers safely assume HTTPS.
 */
const getCoBrandedPageProtocol = (pageProtocol?: string): string => {
  if (pageProtocol) {
    return pageProtocol
  }

  if (typeof window !== 'undefined' && window.location?.protocol) {
    return window.location.protocol
  }

  return 'https:'
}

/**
 * Resolves partner image URLs against the approved Portal/CDN origin while
 * rejecting unsafe schemes such as javascript: and data:, plain http: sources
 * on HTTPS pages (mixed content and tracking pixels), and any other external
 * origin. Website repository assets referenced by the templates themselves
 * (for example `/solagree-logo.svg`) never pass through this normalizer.
 * Invalid or blocked image URLs safely omit the partner logo.
 */
export const normalizeCoBrandedImageUrl = (
  value: unknown,
  portalApiBaseUrl: string,
  pageProtocol?: string
): string | null => {
  const imageUrl = normalizeOptionalString(value)

  if (!imageUrl) {
    return null
  }

  try {
    const approvedOrigin = new URL(portalApiBaseUrl).origin
    const normalizedImageUrl = new URL(imageUrl, portalApiBaseUrl)
    const renderingPageProtocol = getCoBrandedPageProtocol(pageProtocol)
    const isHttpsPage = renderingPageProtocol === 'https:'

    if (!APPROVED_CO_BRANDED_URL_PROTOCOLS.includes(normalizedImageUrl.protocol)) {
      return null
    }

    if (isHttpsPage && normalizedImageUrl.protocol !== 'https:') {
      return null
    }

    return normalizedImageUrl.origin === approvedOrigin
      ? normalizedImageUrl.toString()
      : null
  } catch {
    return null
  }
}

const normalizeLogoUrl = (
  payload: RawCoBrandedPagePublicConfig,
  portalApiBaseUrl: string,
  pageProtocol?: string
): string | null => {
  const directLogoUrl = normalizeCoBrandedImageUrl(payload.logoUrl, portalApiBaseUrl, pageProtocol)

  if (directLogoUrl) {
    return directLogoUrl
  }

  if (
    typeof payload.logo === 'object'
    && payload.logo !== null
    && 'url' in payload.logo
  ) {
    return normalizeCoBrandedImageUrl(payload.logo.url, portalApiBaseUrl, pageProtocol)
  }

  return null
}

/**
 * Converts the public portal payload into the website renderer contract.
 */
export const normalizeCoBrandedPageConfig = (
  payload: unknown,
  fallbackSlug: string,
  portalApiBaseUrl: string,
  pageType: CoBrandedPageType = 'standard',
  pageProtocol?: string
): CoBrandedPagePublicConfig => {
  if (!isRecord(payload)) {
    throw new Error('Co-branded page configuration is invalid.')
  }

  const slug = normalizeOptionalString(payload.slug) ?? fallbackSlug
  const companyName = normalizeOptionalString(payload.companyName)
    ?? normalizeOptionalString(payload.partnerCompany)
    ?? 'Solagree partner'

  return {
    pageType,
    slug,
    templateId: resolveCoBrandedPageTemplateId(payload.templateId, pageType),
    companyName,
    attorneyName: normalizeOptionalString(payload.attorneyName)
      ?? normalizeOptionalString(payload.contactName)
      ?? normalizeOptionalString(payload.name),
    firmName: normalizeOptionalString(payload.firmName),
    phoneNumber: normalizeOptionalString(payload.phoneNumber) ?? normalizeOptionalString(payload.phone),
    emailAddress: normalizeOptionalString(payload.emailAddress) ?? normalizeOptionalString(payload.email),
    logoUrl: normalizeLogoUrl(payload, portalApiBaseUrl, pageProtocol),
    ctaUrl: normalizeCoBrandedCtaUrl(payload.ctaUrl, slug, pageType)
  }
}

/**
 * Loads one published co-branded page from the portal public API.
 *
 * Returns `null` for safe not-found responses so the route can render the
 * website's not-found state without exposing partner lookup details.
 */
export const fetchCoBrandedPageConfig = async (
  options: FetchCoBrandedPageOptions
): Promise<CoBrandedPagePublicConfig | null> => {
  const portalApiBaseUrl = normalizePortalApiBaseUrl(options.portalApiBaseUrl)
  const slug = options.slug.trim()
  const endpointPrefix = CO_BRANDED_PAGE_ENDPOINT_PREFIX_BY_TYPE[options.pageType ?? 'standard']

  if (!slug) {
    return null
  }

  try {
    const payload = await $fetch<unknown>(
      `${portalApiBaseUrl}${endpointPrefix}/${encodeURIComponent(slug)}`
    )

    return normalizeCoBrandedPageConfig(payload, slug, portalApiBaseUrl, options.pageType ?? 'standard')
  } catch (error) {
    if (
      typeof error === 'object'
      && error !== null
      && 'statusCode' in error
      && error.statusCode === 404
    ) {
      return null
    }

    throw error
  }
}
