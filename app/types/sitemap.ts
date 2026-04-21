export type SitemapChangeFrequency = 'weekly' | 'monthly' | 'yearly'

export interface SitemapRoute {
  path: string
  changefreq: SitemapChangeFrequency
  priority: number
}
