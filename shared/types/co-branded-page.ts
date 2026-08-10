import type { CoBrandedPageTemplateId, CoBrandedPageType } from '../co-branded-page-variant'

export type { CoBrandedPageTemplateId, CoBrandedPageType } from '../co-branded-page-variant'

/**
 * Public configuration returned by the portal for rendering a published co-branded page.
 */
export interface CoBrandedPagePublicConfig {
  pageType: CoBrandedPageType
  slug: string
  templateId: CoBrandedPageTemplateId
  companyName: string
  attorneyName: string | null
  firmName: string | null
  phoneNumber: string | null
  emailAddress: string | null
  logoUrl: string | null
  ctaUrl: string
}
