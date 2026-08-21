import { mount } from '@vue/test-utils'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import AppHeader from '../app/components/AppHeader.vue'

const currentRoute = ref({
  fullPath: '/about-us',
  path: '/about-us'
})

Object.assign(globalThis, {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  usePortalLoginHref: () => '/login',
  useRouter: () => ({ currentRoute }),
  watch
})

const mountHeader = () => mount(AppHeader, {
  global: {
    stubs: {
      NuxtLink: {
        props: ['to'],
        template: '<a :href="to"><slot /></a>'
      },
      SiteButton: {
        template: '<a><slot /></a>'
      }
    }
  }
})

describe('AppHeader Resources navigation', () => {
  beforeEach(() => {
    Object.assign(window, {
      requestAnimationFrame: (callback: FrameRequestCallback) => window.setTimeout(callback, 0),
      scrollTo: () => undefined
    })
  })

  it('keeps Resources open when a pointer clicks after hover, then toggles it on the next click', async () => {
    const wrapper = mountHeader()
    const resources = wrapper.get('.site-header__resources')
    const toggle = wrapper.get('.site-header__resources-toggle')

    await resources.trigger('mouseenter')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await resources.trigger('mouseleave')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })
})
