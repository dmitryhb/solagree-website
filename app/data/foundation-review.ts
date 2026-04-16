export const reviewNavigation = [
  { label: 'Signoff', to: '#signoff' },
  { label: 'Typography', to: '#typography' },
  { label: 'Colors', to: '#colors' },
  { label: 'Buttons', to: '#buttons' },
  { label: 'Primitives', to: '#primitives' }
] as const

export const reviewChecklist = [
  {
    label: 'Gate 01',
    title: 'Typography hierarchy is visible without design tools',
    body:
      'Display serif, section titles, eyebrow labels, and interface copy are rendered here with the same classes used by the homepage shell.',
    meta: 'Confirms the voice and hierarchy before quiz copy starts.'
  },
  {
    label: 'Gate 02',
    title: 'Color tokens are shown through the live CSS variables',
    body:
      'Swatches are painted from the shared variables on :root, so reviewers are seeing the real palette instead of a copied hex sheet.',
    meta: 'Keeps the approved CTA accent and surface palette centralized.'
  },
  {
    label: 'Gate 03',
    title: 'CTA and surface primitives are ready for signoff',
    body:
      'Buttons, cards, rows, FAQ treatment, and footer structure are demonstrated together so stakeholders can approve the foundation before feature-specific work begins.',
    meta: 'Matches the HIR-30 checkpoint purpose.'
  }
] as const

export const reviewTypeSamples = [
  {
    token: '--font-display',
    label: 'Lora / display',
    kind: 'display',
    preview: 'Calm structure. Clear next steps.'
  },
  {
    token: '--font-display',
    label: 'Lora / section title',
    kind: 'title',
    preview: 'Shared sections carry the core narrative.'
  },
  {
    token: '--font-body',
    label: 'Open Sans / body',
    kind: 'copy',
    preview:
      'Readable interface copy keeps the internal review practical and gives the quiz flow a solid default for guidance text, helper notes, and confirmations.'
  },
  {
    token: '--font-nav',
    label: 'Poppins / eyebrow',
    kind: 'eyebrow',
    preview: 'Foundation checkpoint'
  }
] as const

export const reviewColorTokens = [
  {
    name: 'Page',
    variable: '--color-page',
    usage: 'Main page background shown behind the full foundation shell.'
  },
  {
    name: 'Hero base',
    variable: '--color-surface-hero',
    usage: 'Warm header surface used in the hero shell.'
  },
  {
    name: 'Warm surface',
    variable: '--color-surface-warm',
    usage: 'Secondary warm panel surface used for lighter sections.'
  },
  {
    name: 'Footer warm',
    variable: '--color-surface-footer',
    usage: 'Warm footer band that wraps the lower page section.'
  },
  {
    name: 'Footer inner',
    variable: '--color-surface-light',
    usage: 'Light inner footer surface used inside the warm footer band.'
  },
  {
    name: 'Text',
    variable: '--color-text',
    usage: 'Body and supporting text color across light surfaces.'
  },
  {
    name: 'Ink',
    variable: '--color-ink',
    usage: 'Navigation, CTA foreground support, and dark-surface text.'
  },
  {
    name: 'White',
    variable: '--color-white',
    usage: 'High-contrast content area and dark-surface text.'
  },
  {
    name: 'Accent',
    variable: '--color-accent',
    usage: 'Primary CTA fill resolved directly from the Figma extraction.'
  },
  {
    name: 'Accent text',
    variable: '--color-accent-text',
    usage: 'Primary CTA foreground color.'
  },
  {
    name: 'Accent soft',
    variable: '--color-accent-soft',
    usage: 'Low-contrast highlight used behind badges and expanded FAQ state.'
  }
] as const

export const reviewButtonPanels = [
  {
    title: 'Primary and secondary CTA',
    tone: 'light',
    body:
      'The primary action uses the exact Figma CTA treatment, while the secondary button stays anchored to the same shared primitive.',
    samples: [
      {
        label: 'Primary / medium',
        text: 'Start the guided path',
        variant: 'primary',
        size: 'md'
      },
      {
        label: 'Secondary / medium',
        text: 'Review the options',
        variant: 'secondary',
        size: 'md'
      },
      {
        label: 'Disabled state',
        text: 'Pending signoff',
        variant: 'secondary',
        size: 'md',
        disabled: true
      }
    ]
  },
  {
    title: 'Compact and block layouts',
    tone: 'muted',
    body:
      'The same primitive can compress for inline utility actions or expand to full width when the layout needs a clear next step.',
    samples: [
      {
        label: 'Primary / small',
        text: 'Save checkpoint',
        variant: 'primary',
        size: 'sm'
      },
      {
        label: 'Secondary / small',
        text: 'View notes',
        variant: 'secondary',
        size: 'sm'
      },
      {
        label: 'Primary / block',
        text: 'Approve the foundation layer',
        variant: 'primary',
        size: 'md',
        block: true
      }
    ]
  },
  {
    title: 'Ghost on dark surfaces',
    tone: 'dark',
    body:
      'The ghost treatment is reserved for darker contexts where the action should stay visible without becoming the loudest element.',
    samples: [
      {
        label: 'Ghost / medium',
        text: 'Open implementation notes',
        variant: 'ghost',
        size: 'md'
      },
      {
        label: 'Ghost / small',
        text: 'Jump to footer preview',
        variant: 'ghost',
        size: 'sm'
      }
    ]
  }
] as const

export const reviewValuePreview = {
  icon: 'DS',
  title: 'Design signoff first',
  description:
    'This page exists to make approval practical: tokens, hierarchy, and core UI primitives are gathered in one place before the quiz starts to shape user journeys.'
} as const

export const reviewRowPreview = {
  label: 'Internal note',
  title: 'Review rows can carry approval criteria or stakeholder quotes',
  body:
    'The same row primitive used for testimonials can also hold implementation evidence, signoff guidance, or reviewer notes without requiring a bespoke layout.',
  meta: 'Rendered on the dark surface variant for contrast review.'
} as const

export const reviewPricingPreview = {
  plan: 'Foundation pack',
  price: 'Ready',
  cadence: 'before quiz build',
  description:
    'One shared card can summarize what has already been approved and what the next route will inherit from the foundation layer.',
  features: [
    'Reusable section shell',
    'Shared CTA hierarchy',
    'Surface and FAQ primitives',
    'Footer structure ready for reuse'
  ],
  featured: true,
  ctaLabel: 'Return to CTA review',
  ctaTo: '#buttons'
} as const

export const reviewFaqPreview = [
  {
    question: 'Why is this route internal instead of public-facing?',
    answer:
      'It is a signoff checkpoint. The goal is to review the real foundation layer in context before feature work adds quiz-specific complexity.'
  },
  {
    question: 'Does the palette here reflect the actual tokens?',
    answer:
      'Yes. The swatches are rendered from the shared CSS variables, and the same tokens already power the homepage shell and button primitives.'
  }
] as const

export const reviewFooterGroups = [
  {
    title: 'Review areas',
    links: [
      { label: 'Typography', to: '#typography' },
      { label: 'Colors', to: '#colors' },
      { label: 'Buttons', to: '#buttons' }
    ]
  },
  {
    title: 'Foundation',
    links: [
      { label: 'Shared primitives', to: '#primitives' },
      { label: 'Signoff gates', to: '#signoff' },
      { label: 'Homepage shell', to: '/' }
    ]
  },
  {
    title: 'Project',
    links: [
      { label: 'HIR-30 checkpoint', to: '#signoff' },
      { label: 'Stakeholder review route', to: '#footer-preview' },
      { label: 'Amsterdam, NL', to: '/' }
    ]
  }
] as const

export const reviewFooterCallout = {
  brand: 'Solagree review',
  title: 'Foundation approved, quiz implementation can start next.',
  description:
    'This footer preview closes the route with the same shared structure used elsewhere, proving the signoff surface is built from reusable pieces rather than one-off review markup.',
  ctaLabel: 'Back to top',
  ctaTo: '#top'
} as const
