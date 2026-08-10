/** Supported public co-branded page variants. */
export const CO_BRANDED_PAGE_TYPES = ['standard', 'cdfa'] as const

/** Public page route discriminator that selects the variant's content and consult flow. */
export type CoBrandedPageType = (typeof CO_BRANDED_PAGE_TYPES)[number]

/** Supported public co-branded template identifiers. */
export const CO_BRANDED_PAGE_TEMPLATE_IDS = ['solagree-basic-v1', 'cdfa-basic-v1'] as const

/** Template identifier supported by the public co-branded page renderer. */
export type CoBrandedPageTemplateId = (typeof CO_BRANDED_PAGE_TEMPLATE_IDS)[number]

/** The only valid template for each page route variant. */
export const CO_BRANDED_PAGE_TEMPLATE_ID_BY_TYPE = {
  standard: 'solagree-basic-v1',
  cdfa: 'cdfa-basic-v1'
} as const satisfies Record<CoBrandedPageType, CoBrandedPageTemplateId>

/**
 * Resolves an untrusted or stale template identifier for the requested route.
 * The route page type is authoritative so one variant can never render the
 * other variant's template.
 */
export const resolveCoBrandedPageTemplateId = (
  templateId: unknown,
  pageType: CoBrandedPageType
): CoBrandedPageTemplateId => {
  const defaultTemplateId = CO_BRANDED_PAGE_TEMPLATE_ID_BY_TYPE[pageType]

  if (templateId === defaultTemplateId) {
    return defaultTemplateId
  }

  return defaultTemplateId
}
