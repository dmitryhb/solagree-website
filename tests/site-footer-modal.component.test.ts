import { flushPromises, mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import SiteFooter from '../app/components/SiteFooter.vue'

Object.assign(globalThis, {
  nextTick,
  ref,
  usePortalLoginHref: () => 'https://portal.example.com'
})

const mountFooter = () => mount(SiteFooter, {
  attachTo: document.body,
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

afterEach(() => {
  document.body.style.overflow = ''
})

describe('SiteFooter network chooser dialog (HIR-369)', () => {
  it('moves focus into the dialog and locks background scroll when opened', async () => {
    const wrapper = mountFooter()
    const trigger = wrapper.get('.site-footer__link-button')

    trigger.element.focus()
    await trigger.trigger('click')
    await flushPromises()

    const dialog = wrapper.get('.network-chooser__dialog')

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.activeElement).toBe(dialog.element)
    expect(dialog.attributes('aria-modal')).toBe('true')

    wrapper.unmount()
  })

  it('traps Tab and Shift+Tab within the dialog', async () => {
    const wrapper = mountFooter()
    const trigger = wrapper.get('.site-footer__link-button')

    await trigger.trigger('click')
    await flushPromises()

    const dialog = wrapper.get('.network-chooser__dialog')
    const closeButton = wrapper.get('.network-chooser__close')
    const options = wrapper.findAll('.network-chooser__option')
    const lastOption = options[options.length - 1]

    expect(options.length).toBeGreaterThanOrEqual(2)

    // Focus starts on the dialog container; the first Tab enters the controls.
    await dialog.trigger('keydown', { key: 'Tab' })

    expect(document.activeElement).toBe(closeButton.element)

    // Tab from the last option wraps around to the first control.
    lastOption.element.focus()
    await lastOption.trigger('keydown', { key: 'Tab' })

    expect(document.activeElement).toBe(closeButton.element)

    // Shift+Tab from the first control wraps around to the last option.
    await closeButton.trigger('keydown', { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(lastOption.element)

    // Focus never escapes the dialog while it is open.
    expect(dialog.element.contains(document.activeElement)).toBe(true)

    wrapper.unmount()
  })

  it('closes on Escape, restores scroll, and returns focus to the opener', async () => {
    const wrapper = mountFooter()
    const trigger = wrapper.get('.site-footer__link-button')

    trigger.element.focus()
    await trigger.trigger('click')
    await flushPromises()

    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.get('.network-chooser').trigger('keydown', { key: 'Escape' })
    await flushPromises()

    expect(wrapper.find('.network-chooser').exists()).toBe(false)
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger.element)

    wrapper.unmount()
  })

  it('restores background scrolling when unmounted while open', async () => {
    const wrapper = mountFooter()

    await wrapper.get('.site-footer__link-button').trigger('click')
    await flushPromises()

    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()

    expect(document.body.style.overflow).toBe('')
  })

  it('returns focus to the trigger even when the opener never held focus', async () => {
    const wrapper = mountFooter()
    const trigger = wrapper.get('.site-footer__link-button')

    // Simulates a Safari mouse click: the opener button never receives focus.
    await trigger.trigger('click')
    await flushPromises()

    expect(document.activeElement).not.toBe(trigger.element)

    await wrapper.get('.network-chooser').trigger('keydown', { key: 'Escape' })
    await flushPromises()

    expect(document.activeElement).toBe(trigger.element)

    wrapper.unmount()
  })
})
