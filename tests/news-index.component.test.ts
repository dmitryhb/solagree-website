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
      }
    }
  }
})

describe('News & Press index', () => {
  it('renders the approved external media in Figma order with safe, accessible destinations', () => {
    const wrapper = mountNewsIndex()
    const cards = wrapper.findAll('.news-card')
    const destinationLinks = wrapper.findAll<HTMLAnchorElement>('.news-card__link')

    expect(cards).toHaveLength(4)
    expect(cards.map(card => card.get('.news-card__title').text())).toEqual([
      'Rethinking Divorce: Inside the Solagree Process with Amanda Mason ↗',
      'Solagree - An Alternative to Litigation with Amanda Mason ↗',
      'The Divorce You Deserve: Peaceful, Private, and Professional ↗',
      'Family Court Is Broken: Former Divorce Lawyer Amanda Mason on Attorney Red Flags, Divorce Advice & Healing After Divorce ↗'
    ])
    expect(cards.map(card => card.get('.news-card__source').text().split('•')[0]?.trim())).toEqual([
      'Doing Divorce Right Podcast',
      'The Gray Divorce Podcast',
      'The CDFA Hotline Podcast',
      'Divorcing Strong Podcast'
    ])
    expect(destinationLinks).toHaveLength(4)
    expect(destinationLinks.every(link => link.attributes('href')?.startsWith('https://'))).toBe(true)
    expect(destinationLinks.every(link => link.attributes('target') === '_blank')).toBe(true)
    expect(destinationLinks.every(link => link.attributes('rel') === 'noopener noreferrer')).toBe(true)
    expect(destinationLinks.every(link => link.attributes('aria-label')?.includes('opens in a new tab'))).toBe(true)
  })

  it('uses the missing-image fallback and approved press email without a Load More control', () => {
    const wrapper = mountNewsIndex()

    expect(wrapper.findAll('.blog-media__fallback')).toHaveLength(4)
    expect(wrapper.get('.news-press-inquiries a').attributes('href')).toBe('mailto:pr@solagree.com')
    expect(wrapper.text()).not.toContain('Load More')
  })
})
