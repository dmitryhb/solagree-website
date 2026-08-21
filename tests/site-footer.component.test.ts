import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import SiteFooter from '../app/components/SiteFooter.vue'
import { resourceNavigationLinks } from '../app/data/resource-navigation'

Object.assign(globalThis, {
  nextTick,
  ref,
  usePortalLoginHref: () => 'https://portal.example.com'
})

const mountFooter = () => mount(SiteFooter, {
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
      Teleport: true,
      Transition: false
    }
  }
})

describe('SiteFooter navigation', () => {
  it('exposes the shared Resources destinations as working links', () => {
    const wrapper = mountFooter()
    const resourcesColumn = wrapper.findAll('.site-footer__column')
      .find(column => column.get('.site-footer__column-title').text() === 'Resources')

    expect(resourcesColumn).toBeDefined()
    expect(resourcesColumn?.findAll<HTMLAnchorElement>('a').map(link => ({
      href: link.attributes('href'),
      label: link.text().trim()
    }))).toEqual(resourceNavigationLinks.map(link => ({
      href: link.to,
      label: link.label
    })))
  })
})
