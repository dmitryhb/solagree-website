import type { AccordionItem } from '~/types/accordion'

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

export interface AttorneyLandingImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface AttorneyHeroContent {
  eyebrow: string
  titleLines: string[]
  intro: string
  primaryCtaLabel: string
  primaryCtaTo: string
  secondaryCtaLabel: string
  secondaryCtaTo: string
  image: AttorneyLandingImage
}

export interface AttorneyPartnerPathsContent {
  title: string
  intro: string
  ctaLabel: string
  ctaTo: string
  paths: AttorneyPartnerPath[]
}

export interface AttorneyHowItWorksContent {
  title: string
  intro: string
  videoImageSrc?: string
  videoImageAlt?: string
  ctaLabel: string
  ctaTo: string
  quote: string
}

export interface AttorneyValueContent {
  title: string
  intro: string
  cards: AttorneyValueCard[]
}

export interface AttorneyOnePlaceBenefit {
  title: string
  description: string
}

export interface AttorneyOnePlaceContent {
  title: string
  intro: string
  benefitsTitle: string
  benefits: AttorneyOnePlaceBenefit[]
  ctaLabel: string
  ctaTo: string
  image: AttorneyLandingImage
}

export interface AttorneyMoreCasesContent {
  title: string
  body: string
  linkPrefix: string
  linkLabel: string
  linkSuffix: string
  linkTo: string
  image: AttorneyLandingImage
}

export interface AttorneyFaqContent {
  title: string
  intro?: string
  items: AccordionItem[]
  defaultValue: string
}

export interface AttorneyFitsPracticeContent {
  title: string
  body: string
  ctaLabel: string
  ctaTo: string
  image: AttorneyLandingImage
}
