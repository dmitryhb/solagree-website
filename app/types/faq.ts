import type { AccordionItem } from '~/types/accordion'

export type FaqSectionSlug =
  | 'divorcing-couples'
  | 'professional-partners'
  | 'attorneys'
  | 'cdfa-financial-advisors'
  | 'client-partner-support'

export interface FaqSection {
  label: string
  slug: FaqSectionSlug
  items: AccordionItem[]
}

/**
 * Content contract for the standalone FAQ page that shares the legal page shell
 * while rendering question content through the reusable accordion primitive.
 */
export interface FaqPageContent {
  title: string
  intro: string
  metaTitle: string
  metaDescription: string
  sections: FaqSection[]
}
