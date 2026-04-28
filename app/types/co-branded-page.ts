export type CoBrandedPageTemplateId = 'solagree-basic-v1'

export interface CoBrandedPagePublicConfig {
  slug: string
  templateId: CoBrandedPageTemplateId
  companyName: string
  phoneNumber: string | null
  logoUrl: string | null
  ctaUrl: string
}

export type CoBrandedPageRenderMode = 'page' | 'embed'
