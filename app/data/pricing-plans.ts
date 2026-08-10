import type { PricingPlan } from '~/types/pricing'

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Parenting Track',
    price: '$2,995',
    cadence: '/ per person',
    description:
      'Guided by parenting specialists and neutral mediators who help you create a sustainable parenting plan.',
    features: [
      'Custody and parenting time schedules',
      'Decision-making and co-parenting plans',
      'Holiday and vacation planning',
      'Child support calculations'
    ],
    note: "Couples with children or ongoing parenting responsibilities. If you also have property or assets to divide, you'll need the combined track."
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
    note: "Couples with property, assets, or spousal support to resolve. If you also have children needing a parenting support plan, you'll need the combined track.",
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
      'Spousal and child support calculations'
    ],
    note: 'Couples who have both assets to divide and children needing support arrangements – includes both tracks with significant savings.',
    badge: 'Save $1,000 Each',
    featured: true
  }
]
