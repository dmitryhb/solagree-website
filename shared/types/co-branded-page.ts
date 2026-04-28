export type CoBrandedPageTemplateId = 'solagree-basic-v1'

/**
 * Public configuration returned by the portal for rendering a published co-branded page.
 */
export interface CoBrandedPagePublicConfig {
  slug: string
  templateId: CoBrandedPageTemplateId
  companyName: string
  phoneNumber: string | null
  logoUrl: string | null
  ctaUrl: string
}
