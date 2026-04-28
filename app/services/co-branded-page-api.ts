import { normalizePortalApiBaseUrl } from '~/services/portal-api'
import type { CoBrandedPagePublicConfig, CoBrandedPageTemplateId } from '~/types/co-branded-page'

const CO_BRANDED_PAGE_ENDPOINT_PREFIX = '/api/public/co-branded-pages'
const DEFAULT_TEMPLATE_ID: CoBrandedPageTemplateId = 'solagree-basic-v1'

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

const normalizeLogoUrl = (
  payload: RawCoBrandedPagePublicConfig,
  portalApiBaseUrl: string
): string | null => {
  const directLogoUrl = normalizeOptionalString(payload.logoUrl)

  if (directLogoUrl) {
    return new URL(directLogoUrl, portalApiBaseUrl).toString()
  }

  if (
    typeof payload.logo === 'object'
    && payload.logo !== null
    && 'url' in payload.logo
  ) {
    const logoUrl = normalizeOptionalString(payload.logo.url)

    return logoUrl ? new URL(logoUrl, portalApiBaseUrl).toString() : null
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
    ctaUrl: normalizeOptionalString(payload.ctaUrl) ?? `/quiz?ref=${encodeURIComponent(slug)}`
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
