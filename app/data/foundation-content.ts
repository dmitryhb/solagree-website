export const navigationLinks = [
  { label: 'How it works', to: '#how-it-works' },
  { label: 'Pricing', to: '#pricing' },
  { label: 'FAQ', to: '#faq' }
]

export const valueBlocks = [
  {
    icon: '01',
    title: 'Shared tokens',
    description:
      'Color, spacing, type, and surface decisions live in one global layer instead of leaking into page-specific markup.'
  },
  {
    icon: '02',
    title: 'Reusable sections',
    description:
      'Buttons, cards, rows, and footer structure are established as portable pieces for the quiz and later marketing pages.'
  },
  {
    icon: '03',
    title: 'Static-site ready',
    description:
      'The implementation stays lightweight and composable, with no dependency on a CMS or feature-specific state.'
  }
] as const

export const workflowSteps = [
  {
    label: 'Step one',
    title: 'Choose the right path',
    body:
      'Section wrappers and CTA treatments now define the top-level page rhythm, so future routes can align without rethinking layout each time.'
  },
  {
    label: 'Step two',
    title: 'Recompose patterns',
    body:
      'Value blocks, review rows, plan cards, and FAQs can be remixed into landing, quiz, or comparison pages without carrying one-off styling.'
  }
] as const

export const testimonialRows = [
  {
    label: 'Client feedback',
    title: 'Clear structure, calmer decisions',
    body:
      'The foundation layer makes the experience feel measured instead of reactive. That steadiness is exactly what the Solagree brand needs.',
    meta: 'Preview copy for the review surface'
  },
  {
    label: 'Team note',
    title: 'Designed to scale past one page',
    body:
      'Cards, buttons, and sections now share the same visual grammar, so the quiz flow can inherit the foundation instead of starting from scratch.',
    meta: 'Internal implementation rationale'
  },
  {
    label: 'Build signal',
    title: 'Fast to extend, hard to drift',
    body:
      'Token-driven styles and named primitives keep later work aligned even when new static routes are added under deadline.',
    meta: 'Future expansion focus'
  }
] as const

export const pricingCards = [
  {
    plan: 'Essential',
    price: '$0',
    cadence: 'foundation baseline',
    description: 'Core typography, buttons, containers, and light surfaces.',
    features: [
      'Central token palette',
      'Reusable section shell',
      'Primary and secondary CTA styles'
    ],
    ctaLabel: 'Explore tokens',
    ctaTo: '#foundation'
  },
  {
    plan: 'Guided',
    price: '$400',
    cadence: 'per content block',
    description: 'Reusable review rows, value blocks, and FAQ entries for structured content.',
    features: [
      'Dark and light card surfaces',
      'Content row patterns',
      'Foundation suited for review page assembly'
    ],
    featured: true,
    ctaLabel: 'Use primitives',
    ctaTo: '#pricing'
  },
  {
    plan: 'Signature',
    price: '$1,250',
    cadence: 'per full route',
    description: 'A page can now be composed from the system rather than designed from zero each time.',
    features: [
      'Scalable page composition',
      'Footer structure ready for reuse',
      'Supports future quiz and marketing routes'
    ],
    ctaLabel: 'Plan next route',
    ctaTo: '#faq'
  }
] as const

export const faqItems = [
  {
    question: 'Why build the foundation before the review page?',
    answer:
      'Because the review page should reflect real shared primitives. Establishing the system first avoids a showcase page full of duplicated, one-off styles.'
  },
  {
    question: 'Are these primitives tied to the homepage only?',
    answer:
      'No. The naming and composition are intentionally generic so the same components can be reused on quiz, pricing, and informational routes.'
  },
  {
    question: 'What is still provisional at this stage?',
    answer:
      'The yellow CTA accent remains easy to change, and image-heavy modules can be refined later once stakeholder review confirms the foundation direction.'
  },
  {
    question: 'How does this help HIR-30?',
    answer:
      'HIR-30 can focus on assembling and exposing the approved styles instead of defining them. That keeps the review route honest and much faster to build.'
  }
] as const

export const footerGroups = [
  {
    title: 'Foundation',
    links: [
      { label: 'Tokens', to: '#foundation' },
      { label: 'Patterns', to: '#how-it-works' },
      { label: 'Pricing cards', to: '#pricing' }
    ]
  },
  {
    title: 'Next steps',
    links: [
      { label: 'Review page', to: '#faq' },
      { label: 'Quiz route', to: '#pricing' },
      { label: 'Static page expansion', to: '#foundation' }
    ]
  },
  {
    title: 'Contact',
    links: [
      { label: 'hello@solagree.test', to: 'mailto:hello@solagree.test' },
      { label: '+31 (0)20 000 0000', to: 'tel:+31200000000' },
      { label: 'Amsterdam, NL', to: '/' }
    ]
  }
] as const

export const footerCallout = {
  brand: 'Solagree',
  title: 'Foundation-ready for the next page builds.',
  description:
    'The footer is established as a reusable structure so future static pages inherit the same brand rhythm, hierarchy, and action area.',
  ctaLabel: 'Start your plan',
  ctaTo: '/'
} as const
