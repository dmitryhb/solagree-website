export interface PricingPlan {
  name: string
  price: string
  cadence: string
  description: string
  features: string[]
  ctaLabel: string
  ctaTo: string
  note: string
  eyebrow?: string
  badge?: string
  featured?: boolean
}
