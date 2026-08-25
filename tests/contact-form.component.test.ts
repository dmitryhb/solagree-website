import { flushPromises, mount } from '@vue/test-utils'
import { nextTick, reactive, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ContactForm from '../app/components/contact/ContactForm.vue'
import { useGoogleAnalytics } from '../app/composables/useGoogleAnalytics'
import { submitContactSubmission } from '../app/services/contact-submission-api'

vi.mock('~/services/contact-submission-api', async () => {
  const actual = await vi.importActual<typeof import('../app/services/contact-submission-api')>('~/services/contact-submission-api')

  return {
    getContactSubmissionErrorMessage: actual.getContactSubmissionErrorMessage,
    submitContactSubmission: vi.fn()
  }
})

const submitContactMock = vi.mocked(submitContactSubmission)

Object.assign(globalThis, {
  nextTick,
  reactive,
  ref,
  useGoogleAnalytics,
  useRuntimeConfig: () => ({
    public: {
      portalApiBaseUrl: 'https://portal.solagree.test'
    }
  })
})

const mountForm = () => mount(ContactForm, {
  attachTo: document.body,
  global: {
    stubs: {
      FormSmsOptInField: true,
      SiteFormSubmit: {
        props: ['label', 'submitting'],
        template: '<button type="submit">{{ label }}</button>'
      }
    }
  }
})

const fillValidForm = async (wrapper: ReturnType<typeof mountForm>) => {
  await wrapper.get('#contact-name').setValue('Avery Quinn')
  await wrapper.get('#contact-email').setValue('avery@example.com')
  await wrapper.get('#contact-message').setValue('Hello there')
}

beforeEach(() => {
  submitContactMock.mockReset()
})

describe('ContactForm accessibility (HIR-369)', () => {
  it('announces submission failures assertively and focuses the message', async () => {
    submitContactMock.mockRejectedValueOnce(new Error('portal down'))

    const wrapper = mountForm()

    await fillValidForm(wrapper)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    const status = wrapper.get('[role="alert"]')

    expect(status.attributes('tabindex')).toBe('-1')
    expect(status.text()).not.toBe('')
    expect(document.activeElement).toBe(status.element)

    wrapper.unmount()
  })

  it('moves focus to the replacement thank-you content after success', async () => {
    submitContactMock.mockResolvedValueOnce({} as Awaited<ReturnType<typeof submitContactSubmission>>)

    const wrapper = mountForm()

    await fillValidForm(wrapper)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    const thankYou = wrapper.get('.contact-form__thank-you')

    expect(thankYou.attributes('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(thankYou.element)
    expect(thankYou.text()).toContain('Thank you for reaching out.')

    wrapper.unmount()
  })
})
