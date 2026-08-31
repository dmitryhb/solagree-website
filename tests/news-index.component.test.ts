import { mount } from '@vue/test-utils'
import { computed, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import NewsIndexPage from '../app/components/news/NewsIndexPage.vue'
import { publishedNewsItems } from '../app/data/resource-content'

Object.assign(globalThis, { computed, ref })

const mountNewsIndex = () => mount(NewsIndexPage, {
  props: {
    items: publishedNewsItems
  },
  global: {
    stubs: {
      SiteFooter: {
        template: '<footer />'
      },
      UIcon: {
        template: '<span class="icon" />'
      }
    }
  }
})

describe('News & Press index', () => {
  it('renders the featured release and remaining media from most to least recent', () => {
    const wrapper = mountNewsIndex()
    const cards = wrapper.findAll('.news-card')
    const destinationLinks = wrapper.findAll<HTMLAnchorElement>('.news-card__link')

    expect(wrapper.get('.news-feature__title').text()).toBe('SOLAGREE® Announces Free Partner Network Platform for CDFAs and Family Law Attorneys Seeking Human-Centric Alternatives to Dispute Resolution')
    expect(wrapper.get('.news-feature__link').text()).toContain('Read the Full Release')
    expect(cards).toHaveLength(4)
    expect(cards.map(card => card.get('.news-card__title').text())).toEqual([
      'Family Court Is Broken: Former Divorce Lawyer Amanda Mason on Attorney Red Flags, Divorce Advice & Healing After Divorce',
      'Rethinking Divorce: Inside the Solagree Process with Amanda Mason',
      'Solagree - An Alternative to Litigation with Amanda Mason',
      'The Divorce You Deserve: Peaceful, Private, and Professional'
    ])
    expect(cards.map(card => card.get('.news-card__source').text().split('•')[0]?.trim())).toEqual([
      'Divorcing Strong Podcast',
      'Doing Divorce Right Podcast',
      'The Gray Divorce Podcast',
      'The CDFA Hotline Podcast'
    ])
    expect(destinationLinks).toHaveLength(4)
    expect(destinationLinks.every(link => link.attributes('href')?.startsWith('https://'))).toBe(true)
    expect(destinationLinks.every(link => link.attributes('target') === '_blank')).toBe(true)
    expect(destinationLinks.every(link => link.attributes('rel') === 'noopener noreferrer')).toBe(true)
    expect(destinationLinks.every(link => link.attributes('aria-label')?.includes('opens in a new tab'))).toBe(true)
    expect(wrapper.text()).not.toContain('↗')
    expect(destinationLinks.every(link => link.text().includes('→'))).toBe(true)
  })

  it('renders the approved decorative publisher art without a fallback or redundant announcement', () => {
    const wrapper = mountNewsIndex()
    const images = wrapper.findAll<HTMLImageElement>('.news-card .blog-media img')
    const featureImage = wrapper.get<HTMLImageElement>('.news-feature .blog-media img')

    expect(featureImage.attributes('src')).toBe('/images/news-feature-partner-network.webp')
    expect(featureImage.attributes('alt')).toBe('')
    expect(images).toHaveLength(4)
    expect(images.every(image => image.attributes('alt') === '')).toBe(true)
    expect(wrapper.findAll('.news-card .blog-media--contain')).toHaveLength(4)
    expect(wrapper.findAll('.blog-media__fallback')).toHaveLength(0)
    expect(wrapper.get('.news-press-inquiries a').attributes('href')).toBe('mailto:support@solagree.com')
    expect(wrapper.text()).not.toContain('Load More')
  })
})
