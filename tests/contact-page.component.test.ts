import { mount } from '@vue/test-utils'
import { reactive, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import ContactPage from '../app/components/contact/ContactPage.vue'
import FormResultMessage from '../app/components/FormResultMessage.vue'
import { useApplicationSubmission } from '../app/composables/useApplicationSubmission'
import { useGoogleAnalytics } from '../app/composables/useGoogleAnalytics'

Object.assign(globalThis, {
  reactive,
  ref,
  useApplicationSubmission,
  useGoogleAnalytics,
  useRuntimeConfig: () => ({ public: { portalApiBaseUrl: 'https://portal.solagree.test' } })
})

describe('Contact page direct contact action (HIR-659)', () => {
  it('links Contact us to the focusable form above instead of the placeholder phone number', () => {
    const wrapper = mount(ContactPage, {
      attachTo: document.body,
      global: {
        components: { FormResultMessage },
        directives: { appear: {} },
        stubs: {
          SiteFooter: true,
          FormSmsOptInField: true,
          SiteFormSubmit: true
        }
      }
    })

    try {
      const action = wrapper.get('.direct-contact-card:last-child a')
      const target = wrapper.get<HTMLFormElement>(action.attributes('href')!)

      expect(action.text()).toBe('Contact us →')
      expect(action.attributes('href')).toBe('#contact-form')
      expect(target.element.tagName).toBe('FORM')
      expect(target.attributes('aria-label')).toBe('Contact form')
      expect(target.attributes('tabindex')).toBe('-1')
      expect(wrapper.findAll('#contact-form')).toHaveLength(1)
      expect(target.element.compareDocumentPosition(action.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      target.element.focus()
      expect(document.activeElement).toBe(target.element)
      expect(wrapper.find('a[href^="tel:"]').exists()).toBe(false)
    }
    finally {
      wrapper.unmount()
    }
  })
})
