/** Published document identity supplied by the portal; never generated on the website. */
export interface CurrentProfessionalTerms {
  documentId: 'solagree-partner-terms'
  version: string
  url: string
}

export type ProfessionalTermsAvailability =
  | { available: true, current: CurrentProfessionalTerms }
  | { available: false, current: null }
