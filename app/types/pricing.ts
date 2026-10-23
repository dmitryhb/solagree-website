export interface PricingPlan {
  name: string
  price: string
  regularPrice?: string
  cadence: string
  description: string
  features: string[]
  note: string
  eyebrow?: string
  badge?: string
  ctaLabel?: string
  ctaTo?: string
  featured?: boolean
}
