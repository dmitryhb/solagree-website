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
    note: 'Best for couples with children or ongoing parenting responsibilities.'
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
    note: 'Best for couples with property, assets, or financial support to resolve.',
    badge: 'Popular'
  },
  {
    name: 'Parenting + Financial',
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
    note: 'Best for couples who need both tracks, with significant savings.',
    badge: 'Save $1,000 Each',
    featured: true
  }
]
