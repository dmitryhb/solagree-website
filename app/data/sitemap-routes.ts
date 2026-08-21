import { legalNavItems } from '~/data/legal-pages'
import { publishedArticles } from '~/data/resource-content'
import type { SitemapRoute } from '~/types/sitemap'

const publicRoutes: SitemapRoute[] = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: 1
  },
  {
    path: '/quiz',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/webinar',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/webinar/cdfa',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/webinar/view',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    path: '/webinar/cdfa/view',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    path: '/attorneys',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/cdfa',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/attorney-application',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/cdfa-application',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    path: '/about-us',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    path: '/faq',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    path: '/blog',
    changefreq: 'weekly',
    priority: 0.7
  },
  {
    path: '/news',
    changefreq: 'weekly',
    priority: 0.7
  }
]

const legalRoutes: SitemapRoute[] = legalNavItems.map((item) => ({
  path: item.to,
  changefreq: 'yearly',
  priority: 0.4
}))

const articleRoutes: SitemapRoute[] = publishedArticles.map(article => ({
  path: `/blog/${article.slug}`,
  changefreq: 'monthly',
  priority: 0.6
}))

export const sitemapRoutes = [...publicRoutes, ...legalRoutes, ...articleRoutes] as const satisfies readonly SitemapRoute[]
