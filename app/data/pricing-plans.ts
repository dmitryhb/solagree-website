import type { PricingPlan } from '~/types/pricing'

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Parenting Track',
    price: '$2,250',
    cadence: '/ per person',
    description:
      'Guided by parenting specialists and neutral mediators who help you create a sustainable parenting plan.',
    features: [
      'Custody and parenting time schedules',
      'Decision-making responsibilities',
      'Holiday and vacation planning',
      'Co-parenting communication plans'
    ],
    note: 'Best for couples focused on children under 18'
  },
  {
    name: 'Financial Track',
    price: '$4,800',
    cadence: '/ per person',
    description:
      'Guided by CDFA® financial experts and neutral mediators who help you navigate complex financial decisions.',
    features: [
      'Property division and asset distribution',
      'Business ownership and valuation',
      'Retirement accounts and pensions',
      'Spousal support calculations'
    ],
    note: 'Best for couples with assets to divide',
    badge: 'Popular'
  },
  {
    name: 'Parenting + Financial',
    eyebrow: 'Save over $1,000 each',
    price: '$5,990',
    cadence: '/ per person',
    description:
      'Combines expert parenting and CDFA® financial guidance—with neutral mediation and arbitration.',
    features: [
      'Child custody, schedules, and co-parenting',
      'Property division and asset distribution',
      'Businesses, pensions, retirement accounts',
      'Spousal support calculations'
    ],
    note: 'For couples with both parenting and financial concerns',
    featured: true
  }
]
