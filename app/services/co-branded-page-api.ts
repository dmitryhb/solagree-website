import { normalizePortalApiBaseUrl } from '~/services/portal-api'
import type { CoBrandedPagePublicConfig, CoBrandedPageTemplateId } from '#shared/types/co-branded-page'

const CO_BRANDED_PAGE_ENDPOINT_PREFIX = '/api/public/co-branded-pages'
const DEFAULT_TEMPLATE_ID: CoBrandedPageTemplateId = 'solagree-basic-v1'
const APPROVED_CO_BRANDED_CTA_PATHS = ['/quiz', '/book-a-solagree-consult']
const APPROVED_CO_BRANDED_CTA_HOSTS = ['solagree.com', 'www.solagree.com']
const APPROVED_CO_BRANDED_URL_PROTOCOLS = ['http:', 'https:']

interface RawCoBrandedPagePublicConfig {
  slug?: unknown
  templateId?: unknown
  companyName?: unknown
  partnerCompany?: unknown
  phoneNumber?: unknown
  phone?: unknown
  logoUrl?: unknown
  logo?: unknown
  ctaUrl?: unknown
}

export interface FetchCoBrandedPageOptions {
  portalApiBaseUrl: string
  slug: string
}

const isRecord = (value: unknown): value is RawCoBrandedPagePublicConfig => {
  return typeof value === 'object' && value !== null
}

const normalizeOptionalString = (value: unknown): string | null => {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

const normalizeTemplateId = (value: unknown): CoBrandedPageTemplateId => {
  return value === DEFAULT_TEMPLATE_ID ? value : DEFAULT_TEMPLATE_ID
}

const getDefaultCtaUrl = (slug: string): string => {
  return `/quiz?ref=${encodeURIComponent(slug)}`
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
export const normalizeCoBrandedCtaUrl = (value: unknown, fallbackSlug: string): string => {
  const ctaUrl = normalizeOptionalString(value)
  const fallbackUrl = getDefaultCtaUrl(fallbackSlug)

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
 * Resolves partner image URLs while rejecting unsafe schemes such as javascript:
 * and data:. Invalid or blocked image URLs safely omit the partner logo.
 */
export const normalizeCoBrandedImageUrl = (
  value: unknown,
  portalApiBaseUrl: string
): string | null => {
  const imageUrl = normalizeOptionalString(value)

  if (!imageUrl) {
    return null
  }

  try {
    const normalizedImageUrl = new URL(imageUrl, portalApiBaseUrl)

    return APPROVED_CO_BRANDED_URL_PROTOCOLS.includes(normalizedImageUrl.protocol)
      ? normalizedImageUrl.toString()
      : null
  } catch {
    return null
  }
}

const normalizeLogoUrl = (
  payload: RawCoBrandedPagePublicConfig,
  portalApiBaseUrl: string
): string | null => {
  const directLogoUrl = normalizeCoBrandedImageUrl(payload.logoUrl, portalApiBaseUrl)

  if (directLogoUrl) {
    return directLogoUrl
  }

  if (
    typeof payload.logo === 'object'
    && payload.logo !== null
    && 'url' in payload.logo
  ) {
    return normalizeCoBrandedImageUrl(payload.logo.url, portalApiBaseUrl)
  }

  return null
}

/**
 * Converts the public portal payload into the website renderer contract.
 */
export const normalizeCoBrandedPageConfig = (
  payload: unknown,
  fallbackSlug: string,
  portalApiBaseUrl: string
): CoBrandedPagePublicConfig => {
  if (!isRecord(payload)) {
    throw new Error('Co-branded page configuration is invalid.')
  }

  const slug = normalizeOptionalString(payload.slug) ?? fallbackSlug
  const companyName = normalizeOptionalString(payload.companyName)
    ?? normalizeOptionalString(payload.partnerCompany)
    ?? 'Solagree partner'

  return {
    slug,
    templateId: normalizeTemplateId(payload.templateId),
    companyName,
    phoneNumber: normalizeOptionalString(payload.phoneNumber) ?? normalizeOptionalString(payload.phone),
    logoUrl: normalizeLogoUrl(payload, portalApiBaseUrl),
    ctaUrl: normalizeCoBrandedCtaUrl(payload.ctaUrl, slug)
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

  if (!slug) {
    return null
  }

  try {
    const payload = await $fetch<unknown>(
      `${portalApiBaseUrl}${CO_BRANDED_PAGE_ENDPOINT_PREFIX}/${encodeURIComponent(slug)}`
    )

    return normalizeCoBrandedPageConfig(payload, slug, portalApiBaseUrl)
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
