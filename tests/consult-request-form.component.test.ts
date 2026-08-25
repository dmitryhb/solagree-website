import { flushPromises, mount } from '@vue/test-utils'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ConsultRequestForm from '../app/components/consult/ConsultRequestForm.vue'
import { useGoogleAnalytics } from '../app/composables/useGoogleAnalytics'
import { useSourceUrl } from '../app/composables/useSourceUrl'
import { submitConsultRequest } from '../app/services/consult-request-api'

vi.mock('~/services/consult-request-api', async () => {
  const actual = await vi.importActual<typeof import('../app/services/consult-request-api')>('~/services/consult-request-api')

  return {
    getConsultRequestSubmissionErrorMessage: actual.getConsultRequestSubmissionErrorMessage,
    submitConsultRequest: vi.fn()
  }
})

const submitConsultMock = vi.mocked(submitConsultRequest)
const navigateToMock = vi.fn(async () => {})

Object.assign(globalThis, {
  computed,
  navigateTo: navigateToMock,
  nextTick,
  reactive,
  ref,
  useGoogleAnalytics,
  useRoute: () => ({ query: {} }),
  useSourceUrl,
  useRuntimeConfig: () => ({
    public: {
      portalApiBaseUrl: 'https://portal.solagree.test'
    }
  }),
  watch
})

const pageContent = {
  consultType: 'initial' as const,
  eyebrow: '30-45 minutes. • $60',
  title: 'Book a Solagree Initial Consult',
  description: 'Talk with our team.',
  thankYouPath: '/book-a-solagree-consult/thank-you'
}

const mountForm = () => mount(ConsultRequestForm, {
  attachTo: document.body,
  props: { content: pageContent },
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

const selectFirstEnabledOption = async (select: ReturnType<ReturnType<typeof mountForm>['findAll']>[number]) => {
  const option = select.findAll('option').find(element => element.element.value !== '' && element.element.disabled === false)

  await select.setValue(option!.element.value)
}

const fillValidForm = async (wrapper: ReturnType<typeof mountForm>) => {
  await wrapper.get('#consult-full-name').setValue('Avery Quinn')
  await wrapper.get('#consult-email').setValue('avery@example.com')
  await wrapper.get('#consult-phone').setValue('415-555-1234')

  const selects = wrapper.findAll('select')

  await selectFirstEnabledOption(selects[0]!)
  await selectFirstEnabledOption(selects[1]!)
  await selectFirstEnabledOption(selects[2]!)
}

beforeEach(() => {
  submitConsultMock.mockReset()
  navigateToMock.mockClear()
})

afterEach(() => {
  document.getElementById('main-content')?.remove()
})

describe('ConsultRequestForm accessibility (HIR-369)', () => {
  it('announces submission failures assertively and focuses the message', async () => {
    submitConsultMock.mockRejectedValueOnce(new Error('portal down'))

    const wrapper = mountForm()

    await fillValidForm(wrapper)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    const result = wrapper.get('[role="alert"]')

    expect(result.attributes('tabindex')).toBe('-1')
    expect(result.text()).toContain('Request not sent')
    expect(document.activeElement).toBe(result.element)

    wrapper.unmount()
  })

  it('moves focus to the destination heading after successful navigation', async () => {
    submitConsultMock.mockResolvedValueOnce({} as Awaited<ReturnType<typeof submitConsultRequest>>)

    const destination = document.createElement('div')
    destination.id = 'main-content'
    destination.innerHTML = '<h1>Thank you for scheduling your consultation!</h1>'
    document.body.appendChild(destination)

    const wrapper = mountForm()

    await fillValidForm(wrapper)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(navigateToMock).toHaveBeenCalledWith({
      path: '/book-a-solagree-consult/thank-you',
      query: undefined
    })

    const destinationHeading = destination.querySelector('h1')

    expect(destinationHeading?.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(destinationHeading)

    wrapper.unmount()
  })
})
