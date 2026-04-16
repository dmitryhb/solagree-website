export const homepageNavLinks = [
  { label: 'What you get', to: '#benefits' },
  { label: 'How it works', to: '#how-it-works' },
  { label: 'Pricing', to: '#pricing' },
  { label: 'FAQ', to: '#faq' }
] as const

export const homepageBenefitCards = [
  {
    title: 'Faster Resolution',
    body: 'A structured process keeps couples moving toward a binding outcome without the drag of court.'
  },
  {
    title: 'Flat-Fee Pricing',
    body: 'The pricing model stays clear up front so the conversation can stay on the decision, not the meter.'
  },
  {
    title: 'Binding Commitment',
    body: 'Decisions are designed to be final, with mediation and arbitration as part of the same path.'
  }
] as const

export const homepagePhaseCards = [
  {
    title: 'Phase 1: Assessment',
    body: 'Gather the facts, constraints, and the decisions that need structure before anything escalates.'
  },
  {
    title: 'Phase 2: Mediation',
    body: 'Work through the unresolved parts with a guided process built to reduce friction.'
  },
  {
    title: 'Phase 3: Arbitration',
    body: 'Close the loop with a binding decision so the path does not drift back into conflict.'
  }
] as const

export const homepagePathCards = [
  {
    title: 'Expedited',
    body: 'Best for couples who want a tighter process and fewer moving parts.',
    features: ['Structured mediation sessions', 'Binding arbitration award', 'Clear next steps']
  },
  {
    title: 'Traditional',
    body: 'Best for more complex cases that need broader support and extra review.',
    features: ['Extended mediation and support', 'CDFA® financial expertise', 'Optional attorney representation']
  }
] as const

export const homepageQuizQuestions = [
  {
    question: 'Question 1 of 8: Do you have kids under 18?',
    choices: ['Yes', 'No', 'Shared custody already']
  },
  {
    question: 'Question 2 of 8: Do you own a home together?',
    choices: ['Yes', 'No', 'Not sure yet']
  }
] as const

export const homepagePricingCards = [
  {
    eyebrow: '15-Minute Expert Consult',
    price: '$50',
    cadence: '/ one time',
    body: 'A short consult to understand your situation before you commit to a path.',
    features: [
      '15-minute call with expert',
      'Initial situation assement',
      'Flat-Fee price quote'
    ],
    cta: 'Book a Consultation',
    footnote: 'Get clarity about your options',
    featured: false
  },
  {
    eyebrow: 'Solagree EXPEDITED',
    badge: 'Best value',
    price: '$5,400',
    cadence: '/ PER couple',
    body: 'For couples who want a tighter process and a faster path to resolution.',
    features: [
      'CDFA® financial analysis',
      'Structured mediation sessions',
      'Binding arbitration award'
    ],
    cta: 'Get started with Expedited',
    footnote: 'Best for couples that mostly agree',
    featured: true
  },
  {
    eyebrow: 'Solagree Traditional',
    badge: 'For Complex Cases',
    price: '$11,500',
    cadence: '/ PER Couple',
    body: 'For cases that need deeper support, more review, and broader professional involvement.',
    features: [
      'Extended mediation & support',
      'CDFA® financial expertise',
      'Optional attorney representation'
    ],
    cta: 'Get started with Traditional',
    footnote: 'Best for complex finances, custody or business owners',
    featured: false
  }
] as const

export const homepageFaqItems = [
  {
    question: 'What does binding arbitration mean?',
    answer:
      'It means a neutral third party makes the final decision, and both sides agree to follow it.'
  },
  {
    question: 'Do we need attorneys?',
    answer:
      'Not always. The Traditional path supports attorney involvement, while the expedited path is designed to move with less overhead.'
  },
  {
    question: 'What if we disagree on the kids?',
    answer:
      'The process is designed to surface custody and support decisions early so they can be handled inside the same structure.'
  },
  {
    question: 'How fast does it move?',
    answer:
      'The expedited path is built for speed, while the traditional path allows more room for complex cases and review.'
  },
  {
    question: 'Is the pricing fixed?',
    answer:
      'Yes. The pricing model is shown as flat-fee rather than open-ended hourly billing.'
  }
] as const

export const homepageProfessionalBullets = [
  'Attorneys & Legal Professionals',
  'CDFAs & Financial Advisors',
  'Counselors & Certified Coaches'
] as const

export const homepageFooterGroups = [
  {
    title: 'FOR COUPLES',
    links: [
      { label: 'How It Works', to: '#how-it-works' },
      { label: 'Quiz: Will it Work for us?', to: '#quiz' },
      { label: 'Solagree vs Traditional', to: '#paths' },
      { label: 'Pricing', to: '#pricing' },
      { label: 'FAQs', to: '#faq' }
    ]
  },
  {
    title: 'FOR PROFESSIONALS',
    links: [
      { label: 'Attorneys', to: '#professionals' },
      { label: 'Financial Advisors', to: '#professionals' },
      { label: 'Counselors', to: '#professionals' },
      { label: 'Employers/EAP', to: '#professionals' },
      { label: 'Join the Network', to: '#professionals' }
    ]
  },
  {
    title: 'COMPANY',
    links: [
      { label: 'About Us', to: '#top' },
      { label: 'FAQ', to: '#faq' },
      { label: 'Contact Us', to: 'mailto:hello@solagree.test' },
      { label: 'Learn', to: '#how-it-works' },
      { label: 'Account Login', to: '#top' }
    ]
  }
] as const

export const homepageAssets = {
  hero: '/figma/hero-band.jpg',
  kids: '/figma/kids-band.jpg',
  professionals: '/figma/professionals-band.jpg'
} as const
