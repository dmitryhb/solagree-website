import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computed } from 'vue'
import { useSolagreeSeo } from '../app/composables/useSolagreeSeo'
import BlogArticleRoute from '../app/pages/blog/[slug].vue'

const { draftArticle, publishedArticle, routeState } = vi.hoisted(() => {
  const published = {
    author: 'Amanda Mason',
    body: `## A clearer next step

Divorce decisions can benefit from *structured guidance* and [independent resources](https://example.com/resources).

*This content originally appeared at [Source](https://example.com/source).*\n\n*Unsafe [source](javascript:alert(1)).*`,
    category: 'Mediation & Arbitration',
    featured: true,
    featuredImage: '/images/about-process-around-people.png',
    kind: 'article' as const,
    linkMode: 'internal' as const,
    publishedAt: '2026-08-21',
    seo: {
      description: 'A current article description. </script><script>unsafe()</script>',
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

const renderedHeadScripts: HTMLScriptElement[] = []

Object.assign(globalThis, {
  computed,
  createError: ({ statusMessage }: { statusMessage: string }) => new Error(statusMessage),
  useHead: (entry: () => { script?: Array<{ textContent?: string, type?: string }> }) => {
    entry().script?.forEach((scriptConfig) => {
      const script = document.createElement('script')

      script.type = scriptConfig.type ?? ''
      script.textContent = scriptConfig.textContent ?? ''
      document.head.append(script)
      renderedHeadScripts.push(script)
    })
  },
  useRoute: () => ({ params: { slug: routeState.slug } }),
  useRuntimeConfig: () => ({ public: { siteUrl: 'https://www.solagree.com' } }),
  useSeoMeta: () => undefined,
  useSolagreeSeo
})

const mountArticleRoute = () => mount(BlogArticleRoute, {
  global: {
    stubs: {
      NuxtLink: {
        props: ['to'],
        template: '<a :href="to"><slot /></a>'
      },
      UIcon: {
        props: ['name'],
        template: '<span :data-icon="name" />'
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
    renderedHeadScripts.splice(0).forEach(script => script.remove())
    warnSpy.mockRestore()
  })

  it('renders a published article body and its safe rich-text link without unresolved component warnings', () => {
    const wrapper = mountArticleRoute()
    const sourceLink = wrapper.get<HTMLAnchorElement>('.article-rich-text strong a[href="https://example.com/source"]')

    expect(wrapper.get('.article-rich-text h2').text()).toBe('A clearer next step')
    expect(wrapper.get('.article-rich-text a').attributes('href')).toBe('https://example.com/resources')
    expect(sourceLink.text()).toBe('Source')
    expect(sourceLink.attributes('target')).toBe('_blank')
    expect(sourceLink.attributes('rel')).toBe('noopener noreferrer')
    expect(sourceLink.element.parentElement?.tagName).toBe('STRONG')
    expect(wrapper.find('a[href^="javascript:"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Unsafe [source](javascript:alert(1)).')
    expect(wrapper.get('.blog-article__back-link--top').text()).toContain('Back to all articles')
    expect(wrapper.get('.blog-article__meta').text()).toContain('Last Updated: August 21, 2026')
    expect(wrapper.get('.blog-article__author-card').text()).toContain('Amanda Mason')
    expect(wrapper.find('.blog-article__aside').exists()).toBe(false)
    expect(warnSpy.mock.calls.some(args => args.join(' ').includes('Failed to resolve component'))).toBe(false)
  })

  it('injects parseable Article JSON-LD with the canonical article URL', () => {
    mountArticleRoute()

    const script = document.head.querySelector<HTMLScriptElement>('script[type="application/ld+json"]')

    expect(script?.textContent).not.toBe('')
    expect(script?.textContent).toBeTruthy()
    expect(script?.textContent).not.toContain('</script>')

    const structuredData = JSON.parse(script?.textContent ?? '') as Record<string, string>

    expect(structuredData).toMatchObject({
      '@type': 'Article',
      description: 'A current article description. </script><script>unsafe()</script>',
      headline: 'A clearer next step',
      mainEntityOfPage: 'https://www.solagree.com/blog/clearer-next-step'
    })
  })

  it('returns a 404 error for a draft article direct route', () => {
    routeState.slug = 'draft-article'

    expect(mountArticleRoute).toThrow('Article not found')
  })
})
