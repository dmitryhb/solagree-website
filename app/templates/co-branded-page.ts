import type { CoBrandedPageType } from '#shared/co-branded-page-variant'
import { attorneyCoBrandedPageContent } from '~/templates/co-branded-page/attorney'
import { cdfaCoBrandedPageContent } from '~/templates/co-branded-page/cdfa'
import type {
  CoBrandedPageContent,
  CoBrandedPageVariantContent
} from '~/types/co-branded-page'

const sharedContent = {
  ctaLabel: 'Request a Consultation',
  benefits: ['Resolve Faster', 'Predictable Pricing', 'Entirely Virtual', 'Binding Process'],
  whatIs: {
    title: 'What is Solagree?',
    audienceTitle: 'Who It’s For:',
    audience: [
      'Couples who want to avoid lengthy and costly court battles',
      'Cases from moderate to complex (financial and/or parenting issues)',
      'Both parties willing to participate in good faith even if they don’t agree'
    ]
  },
  howItWorks: {
    title: 'How It Works',
    steps: [
      {
        key: 'organized',
        iconSrc: '/images/co-branded-icon-get-organized.webp',
        number: '01',
        title: 'Get Organized',
        description: 'Experts help organize your financial and parenting information.'
      },
      {
        key: 'agreement',
        iconSrc: '/images/co-branded-icon-reach-agreement.webp',
        number: '02',
        title: 'Reach Agreement',
        description: 'Virtual mediation to resolve parenting and financial issues.'
      },
      {
        key: 'resolution',
        iconSrc: '/images/co-branded-icon-binding-resolution.webp',
        number: '03',
        title: 'Binding Resolution',
        description: 'Secure a binding decision on any remaining unresolved matters.'
      },
      {
        key: 'finalize',
        iconSrc: '/images/co-branded-icon-finalize-file.webp',
        number: '04',
        title: 'Finalize & File',
        description: 'Documents prepared and filed (typically no court appearance needed.)'
      }
    ]
  },
  guideTitle: 'How We Guide You',
  pricing: {
    title: 'Find Your Track',
    note: 'For higher-conflict or complex cases requiring extended support, the Solagree-COMPASS program is available.'
  },
  questionsTitle: 'Common Questions',
  nextSteps: {
    title: 'Your Next Steps',
    intro: 'The first step is a conversation. We\'ll discuss your situation and help you understand the right path forward.',
    cardTitle: 'Let\'s Talk About Your Situation',
    cardDescription: 'Request a consultation to learn more about Solagree and discuss whether it\'s the right approach for your case.'
  }
} as const

const createPageContent = (variant: CoBrandedPageVariantContent): CoBrandedPageContent => ({
  ctaLabel: sharedContent.ctaLabel,
  hero: variant.hero,
  benefits: sharedContent.benefits,
  whatIs: {
    ...sharedContent.whatIs,
    description: variant.whatIsDescription
  },
  howItWorks: sharedContent.howItWorks,
  guide: {
    title: sharedContent.guideTitle,
    lede: variant.guideLede,
    items: variant.guideItems
  },
  pricing: sharedContent.pricing,
  questions: {
    title: sharedContent.questionsTitle,
    intro: variant.questionsIntro,
    items: variant.faqs
  },
  nextSteps: sharedContent.nextSteps
})

const contentRegistry = {
  standard: createPageContent(attorneyCoBrandedPageContent),
  cdfa: createPageContent(cdfaCoBrandedPageContent)
} as const satisfies Record<CoBrandedPageType, CoBrandedPageContent>

/** Returns content from the authoritative public route discriminator. */
export const resolveCoBrandedPageContent = (pageType: CoBrandedPageType): CoBrandedPageContent => {
  return contentRegistry[pageType]
}
