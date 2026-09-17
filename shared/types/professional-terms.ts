/** Published document identity supplied by the portal; never generated on the website. */
export interface CurrentProfessionalTerms {
  documentId: 'solagree-terms-of-service'
  version: string
  url: string
}

export type ProfessionalTermsAvailability =
  | { available: true, current: CurrentProfessionalTerms }
  | { available: false, current: null }
