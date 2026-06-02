export type CoBrandedPageTemplateId = 'solagree-basic-v1' | 'cdfa-basic-v1'

/**
 * Public configuration returned by the portal for rendering a published co-branded page.
 */
export interface CoBrandedPagePublicConfig {
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
