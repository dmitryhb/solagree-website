import { mount } from '@vue/test-utils'
import { computed, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import BlogIndexPage from '../app/components/blog/BlogIndexPage.vue'
import { publishedArticles } from '../app/data/resource-content'

Object.assign(globalThis, { computed, ref })

const mountBlogIndex = () => mount(BlogIndexPage, {
  props: {
    articles: publishedArticles
  },
  global: {
    stubs: {
      NuxtLink: {
        props: ['to'],
        template: '<a :href="to"><slot /></a>'
      },
      SiteButton: {
        props: ['to'],
        template: '<a :href="to"><slot /></a>'
      },
      SiteFooter: {
        template: '<footer />'
      }
    }
  }
})

const renderedArticles = [
  publishedArticles.find(article => article.featured) ?? publishedArticles[0],
  ...publishedArticles.filter(article => !article.featured)
]

describe('Blog index media', () => {
  it('renders a Figma image rather than the fallback for every published entry', () => {
    const wrapper = mountBlogIndex()
    const images = wrapper.findAll<HTMLImageElement>('.blog-media img')

    expect(images).toHaveLength(publishedArticles.length)
    expect(images.map(image => image.attributes('src'))).toEqual(renderedArticles.map(article => article?.featuredImage))
    expect(images.map(image => image.attributes('alt'))).toEqual(renderedArticles.map(article => article?.title))
    expect(wrapper.find('.blog-media__fallback').exists()).toBe(false)
  })

  it('keeps the long editorial title in a keyboard-focusable article link', () => {
    const wrapper = mountBlogIndex()
    const longTitleLink = wrapper.findAll('.blog-card__title a').find(link => link.text().includes('Naked'))

    expect(longTitleLink?.attributes('href')).toBe('/blog/hidden-risks-naked-mediation')
    expect(longTitleLink?.attributes('tabindex')).toBeUndefined()
  })
})
