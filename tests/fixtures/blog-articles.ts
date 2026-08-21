import type { ResourceContentEntry } from '../../shared/types/resource-content'

export const blogArticleFixtures = [
  {
    author: 'Amanda Mason',
    body: `## A clearer next step

Divorce decisions can benefit from *structured guidance* and [independent resources](https://example.com/resources).

- Begin with a shared plan
- Keep the next step manageable

1. Gather the essential information
2. Choose a path forward`,
    category: 'Mediation & Arbitration',
    featured: true,
    featuredImage: '/images/about-process-around-people.png',
    kind: 'article',
    linkMode: 'internal',
    publishedAt: '2026-08-21',
    seo: {
      description: 'A current article description.',
      title: 'A clearer next step'
    },
    slug: 'clearer-next-step',
    social: {
      description: 'A current social description.',
      image: '/images/about-process-around-people.png',
      title: 'A clearer next step'
    },
    status: 'published',
    summary: 'A current article summary.',
    title: 'A clearer next step'
  },
  {
    author: 'Amanda Mason',
    body: 'A previous article body.',
    featuredImage: '',
    kind: 'article',
    linkMode: 'internal',
    publishedAt: '2026-07-10',
    seo: {
      description: 'A previous article description.',
      title: 'A previous article'
    },
    slug: 'previous-article',
    social: {
      description: 'A previous social description.',
      image: '/images/splash-bg.webp',
      title: 'A previous article'
    },
    status: 'published',
    summary: 'A previous article summary.',
    title: 'A previous article'
  },
  {
    author: 'Amanda Mason',
    body: 'A draft body.',
    featuredImage: '/images/splash-bg.webp',
    kind: 'article',
    linkMode: 'internal',
    publishedAt: '2026-09-01',
    seo: {
      description: 'A draft article description.',
      title: 'A draft article'
    },
    slug: 'draft-article',
    social: {
      description: 'A draft social description.',
      image: '/images/splash-bg.webp',
      title: 'A draft article'
    },
    status: 'draft',
    summary: 'A draft article summary.',
    title: 'A draft article'
  }
] as const satisfies readonly ResourceContentEntry[]
