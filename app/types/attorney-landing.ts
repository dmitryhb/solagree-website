/**
 * Content model for a value card in the attorney landing page benefits section.
 */
export interface AttorneyValueCard {
  iconSrc: string
  title: string
  description: string
}

/**
 * Content model for a partnership path card on the attorney landing page.
 */
export interface AttorneyPartnerPath {
  title: string
  description: string
  details: string[]
}
