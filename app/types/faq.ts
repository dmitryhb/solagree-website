import type { AccordionItem } from '~/types/accordion'

/**
 * Content contract for the standalone FAQ page that shares the legal page shell
 * while rendering question content through the reusable accordion primitive.
 */
export interface FaqPageContent {
  title: string
  intro: string
  documentTitle: string
  sourceLabel: string
  metaTitle: string
  metaDescription: string
  items: AccordionItem[]
}
