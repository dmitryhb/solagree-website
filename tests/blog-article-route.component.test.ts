import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computed } from 'vue'
import BlogArticleRoute from '../app/pages/blog/[slug].vue'

const { draftArticle, publishedArticle, routeState } = vi.hoisted(() => {
  const published = {
    author: 'Amanda Mason',
    body: `## A clearer next step

Divorce decisions can benefit from *structured guidance* and [independent resources](https://example.com/resources).`,
    category: 'Mediation & Arbitration',
    featured: true,
    featuredImage: '/images/about-process-around-people.png',
    kind: 'article' as const,
    linkMode: 'internal' as const,
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
    status: 'published' as const,
    summary: 'A current article summary.',
    title: 'A clearer next step'
  }

  return {
    draftArticle: {
      ...published,
      slug: 'draft-article',
      status: 'draft' as const
    },
    publishedArticle: published,
    routeState: {
      slug: 'clearer-next-step'
    }
  }
})

vi.mock('~/data/resource-content', () => ({
  publishedArticles: [publishedArticle],
  resourceContentEntries: [publishedArticle, draftArticle]
}))

Object.assign(globalThis, {
  computed,
  createError: ({ statusMessage }: { statusMessage: string }) => new Error(statusMessage),
  useRoute: () => ({ params: { slug: routeState.slug } }),
  useRuntimeConfig: () => ({ public: { siteUrl: 'https://www.solagree.com' } }),
  useSolagreeSeo: () => undefined
})

const mountArticleRoute = () => mount(BlogArticleRoute, {
  global: {
    stubs: {
      NuxtLink: {
        props: ['to'],
        template: '<a :href="to"><slot /></a>'
      },
      SiteFooter: {
        template: '<footer />'
      }
    }
  }
})

describe('Blog article route runtime', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    routeState.slug = 'clearer-next-step'
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('renders a published article body and its safe rich-text link without unresolved component warnings', () => {
    const wrapper = mountArticleRoute()

    expect(wrapper.get('.article-rich-text h2').text()).toBe('A clearer next step')
    expect(wrapper.get('.article-rich-text a').attributes('href')).toBe('https://example.com/resources')
    expect(warnSpy.mock.calls.some(args => args.join(' ').includes('Failed to resolve component'))).toBe(false)
  })

  it('returns a 404 error for a draft article direct route', () => {
    routeState.slug = 'draft-article'

    expect(mountArticleRoute).toThrow('Article not found')
  })
})
