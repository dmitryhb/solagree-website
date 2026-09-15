export type CoBrandedPageRenderMode = 'page' | 'embed'

export interface CoBrandedPageHeroContent {
  eyebrow: string
  titleLines: readonly [string, string]
  description: string
}

export interface CoBrandedPageGuideItem {
  title: string
  description: string
}

export interface CoBrandedPageTrackContent {
  title: string
  description: string
  features: readonly string[]
  note?: string
}

export interface CoBrandedPageFaqContent {
  question: string
  paragraphs: readonly string[]
  bullets?: readonly string[]
  grouped?: boolean
}

export interface CoBrandedPageVariantContent {
  hero: CoBrandedPageHeroContent
  whatIsDescription: string
  guideLede: string
  guideItems: readonly CoBrandedPageGuideItem[]
  trackFeatures: readonly [
    Pick<CoBrandedPageTrackContent, 'features' | 'note'>,
    Pick<CoBrandedPageTrackContent, 'features' | 'note'>
  ]
  tracksClosing: string
  questionsIntro: readonly string[]
  faqs: readonly CoBrandedPageFaqContent[]
}

export interface CoBrandedPageContent {
  ctaLabel: string
  hero: CoBrandedPageHeroContent
  benefits: readonly string[]
  whatIs: {
    title: string
    description: string
    audienceTitle: string
    audience: readonly string[]
  }
  howItWorks: {
    title: string
    steps: ReadonlyArray<{
      key: string
      iconSrc: string
      number: string
      title: string
      description: string
    }>
  }
  guide: {
    title: string
    lede: string
    items: readonly CoBrandedPageGuideItem[]
  }
  tracks: {
    title: string
    intro: readonly string[]
    items: readonly [CoBrandedPageTrackContent, CoBrandedPageTrackContent]
    closingLead: string
    closing: string
  }
  questions: {
    title: string
    intro: readonly string[]
    items: readonly CoBrandedPageFaqContent[]
  }
  nextSteps: {
    title: string
    intro: string
    cardTitle: string
    cardDescription: string
  }
}
