import { flushPromises, mount } from '@vue/test-utils'
import { nextTick, reactive, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import FormResultMessage from '../app/components/FormResultMessage.vue'
import SiteFormSubmit from '../app/components/SiteFormSubmit.vue'
import WatchWebinarForm from '../app/components/webinar/WatchWebinarForm.vue'
import { useApplicationSubmission } from '../app/composables/useApplicationSubmission'
import { useSourceUrl } from '../app/composables/useSourceUrl'
import { submitWebinarRegistration } from '../app/services/webinar-registration-api'

vi.mock('~/services/webinar-registration-api', async () => {
  const actual = await vi.importActual<typeof import('../app/services/webinar-registration-api')>('~/services/webinar-registration-api')

  return {
    getWebinarRegistrationErrorMessage: actual.getWebinarRegistrationErrorMessage,
    submitWebinarRegistration: vi.fn()
  }
})

const submitWebinarMock = vi.mocked(submitWebinarRegistration)
const navigateToMock = vi.fn(async () => {})

Object.assign(globalThis, {
  navigateTo: navigateToMock,
  nextTick,
  reactive,
  ref,
  useApplicationSubmission,
  useRuntimeConfig: () => ({
    public: {
      portalApiBaseUrl: 'https://portal.solagree.test'
    }
  }),
  useSourceUrl
})

const mountForm = () => mount(WatchWebinarForm, {
  attachTo: document.body,
  global: {
    components: {
      FormResultMessage,
      SiteFormSubmit
    },
    stubs: {
      NuxtLink: {
        props: ['to'],
        template: '<a :href="to"><slot /></a>'
      }
    }
  }
})

const fillValidForm = async (wrapper: ReturnType<typeof mountForm>) => {
  await wrapper.get('#webinar-business-email').setValue('avery@example.com')
  await wrapper.get('#webinar-first-name').setValue('Avery')
  await wrapper.get('#webinar-last-name').setValue('Quinn')

  const stateSelect = wrapper.get('#webinar-state')
  const firstState = stateSelect.findAll('option').find(option => option.element.value !== '')

  await stateSelect.setValue(firstState!.element.value)
}

beforeEach(() => {
  submitWebinarMock.mockReset()
  navigateToMock.mockClear()
})

afterEach(() => {
  document.getElementById('main-content')?.remove()
})

describe('WatchWebinarForm accessibility (HIR-369)', () => {
  it('announces submission failures assertively and focuses the message', async () => {
    submitWebinarMock.mockRejectedValueOnce(new Error('portal down'))

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

  it('moves focus to the destination content after redirect', async () => {
    submitWebinarMock.mockResolvedValueOnce({} as Awaited<ReturnType<typeof submitWebinarRegistration>>)

    const destination = document.createElement('div')
    destination.id = 'main-content'
    destination.innerHTML = '<h1>Ready to join the Solagree network?</h1>'
    document.body.appendChild(destination)

    const wrapper = mountForm()

    await fillValidForm(wrapper)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(navigateToMock).toHaveBeenCalledWith('/webinar/view')

    const destinationHeading = destination.querySelector('h1')

    expect(destinationHeading?.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(destinationHeading)

    wrapper.unmount()
  })
})
