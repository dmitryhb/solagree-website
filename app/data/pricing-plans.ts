import type { PricingPlan } from '~/types/pricing'

export const pricingPlans: PricingPlan[] = [
  {
    name: '15-Minute Expert Consult',
    price: '$50',
    cadence: '/ one time',
    description:
      'A focused consultation to understand your situation, answer initial questions, and determine if Solagree is the right fit for your divorce.',
    features: [
      '15-minute call with expert',
      'Initial situation assessment',
      'Flat-fee price quote'
    ],
    ctaLabel: 'Book a Consultation',
    ctaTo: '/quiz',
    note: 'Get clarity about your options'
  },
  {
    name: 'Solagree Expedited',
    price: '$5,400',
    cadence: '/ per couple',
    description:
      'Navigate the process with expert support at each phase. For lower-conflict couples who want to move efficiently without attorneys.',
    features: [
      'CDFA® financial analysis',
      'Structured mediation sessions',
      'Binding arbitration award'
    ],
    ctaLabel: 'Get started with Expedited',
    ctaTo: '/quiz',
    note: 'Best for couples that mostly agree',
    badge: 'Best value'
  },
  {
    name: 'Solagree Traditional',
    eyebrow: 'Starting at',
    price: '$11,500',
    cadence: '/ per couple',
    description:
      'For complex or high-conflict cases. Includes extended mediation, professional support, and optional attorney representation.',
    features: [
      'Extended mediation & support',
      'CDFA® financial expertise',
      'Optional attorney representation'
    ],
    ctaLabel: 'Get started with Traditional',
    ctaTo: '/quiz',
    note: 'Best for complex finances, custody or business owners',
    badge: 'For complex cases',
    featured: true
  }
]
