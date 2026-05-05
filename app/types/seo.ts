import type { MaybeRefOrGetter } from 'vue'

export type SeoPageType = 'article' | 'profile' | 'website'

export interface StructuredDataObject {
  '@context': 'https://schema.org'
  '@type': string
  [key: string]: unknown
}

export interface SolagreeSeoInput {
  description: MaybeRefOrGetter<string>
  image?: MaybeRefOrGetter<string>
  noIndex?: MaybeRefOrGetter<boolean>
  path?: MaybeRefOrGetter<string>
  structuredData?: StructuredDataObject[]
  title: MaybeRefOrGetter<string>
  type?: SeoPageType
}
