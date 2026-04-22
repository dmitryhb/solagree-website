export type SeoPageType = 'article' | 'profile' | 'website'

export interface StructuredDataObject {
  '@context': 'https://schema.org'
  '@type': string
  [key: string]: unknown
}

export interface SolagreeSeoInput {
  description: string
  image?: string
  noIndex?: boolean
  path?: string
  structuredData?: StructuredDataObject[]
  title: string
  type?: SeoPageType
}
