import { mount } from '@vue/test-utils'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
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
  attachTo: document.body,
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

let headerWrapper: ReturnType<typeof mountHeader> | undefined

describe('AppHeader Resources navigation', () => {
  beforeEach(() => {
    currentRoute.value = {
      fullPath: '/about-us',
      path: '/about-us'
    }
    Object.assign(window, {
      requestAnimationFrame: (callback: FrameRequestCallback) => window.setTimeout(callback, 0),
      scrollTo: () => undefined
    })
  })

  afterEach(() => {
    headerWrapper?.unmount()
    headerWrapper = undefined
  })

  it('keeps Resources open when a pointer clicks after hover, then toggles it on the next click', async () => {
    const wrapper = headerWrapper = mountHeader()
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

  it('closes a click-pinned menu when a pointer starts outside the header controls', async () => {
    const wrapper = headerWrapper = mountHeader()
    const toggle = wrapper.get('.site-header__resources-toggle')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await nextTick()

    expect(toggle.attributes('aria-expanded')).toBe('false')
  })

  it('supports menu keyboard navigation and returns focus to Resources on Escape', async () => {
    const wrapper = headerWrapper = mountHeader()
    const toggle = wrapper.get('.site-header__resources-toggle')
    const toggleElement = toggle.element as HTMLButtonElement

    toggleElement.focus()
    await toggle.trigger('keydown', { key: 'ArrowDown' })

    const menuItems = wrapper.findAll<HTMLAnchorElement>('[role="menuitem"]')
    expect(menuItems).toHaveLength(3)
    expect(document.activeElement).toBe(menuItems[0]?.element)

    await menuItems[0]?.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(menuItems[1]?.element)

    await menuItems[1]?.trigger('keydown', { key: 'Escape' })
    await nextTick()

    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggleElement)
  })

  it('closes a click-pinned menu after route navigation', async () => {
    const wrapper = headerWrapper = mountHeader()
    const toggle = wrapper.get('.site-header__resources-toggle')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    currentRoute.value = {
      fullPath: '/contact',
      path: '/contact'
    }
    await nextTick()
    await nextTick()

    expect(toggle.attributes('aria-expanded')).toBe('false')
  })
})
