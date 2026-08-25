import { flushPromises, mount } from '@vue/test-utils'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ConsultRequestForm from '../app/components/consult/ConsultRequestForm.vue'
import FormResultMessage from '../app/components/FormResultMessage.vue'
import WatchWebinarForm from '../app/components/webinar/WatchWebinarForm.vue'
import { useApplicationSubmission } from '../app/composables/useApplicationSubmission'
import { useSourceUrl } from '../app/composables/useSourceUrl'
import { PortalApiConfigurationError } from '../app/services/portal-api'
import { submitConsultRequest } from '../app/services/consult-request-api'
import { submitWebinarRegistration } from '../app/services/webinar-registration-api'

vi.mock('~/services/consult-request-api', async () => {
  const actual = await vi.importActual<typeof import('../app/services/consult-request-api')>('~/services/consult-request-api')

  return {
    getConsultRequestSubmissionErrorMessage: actual.getConsultRequestSubmissionErrorMessage,
    submitConsultRequest: vi.fn()
  }
})

vi.mock('~/services/webinar-registration-api', async () => {
  const actual = await vi.importActual<typeof import('../app/services/webinar-registration-api')>('~/services/webinar-registration-api')

  return {
    getWebinarRegistrationErrorMessage: actual.getWebinarRegistrationErrorMessage,
    submitWebinarRegistration: vi.fn()
  }
})

const submitConsultMock = vi.mocked(submitConsultRequest)
const navigateToMock = vi.fn(async () => {})
const trackEventMock = vi.fn()

Object.assign(globalThis, {
  computed,
  navigateTo: navigateToMock,
  nextTick,
  reactive,
  ref,
  useApplicationSubmission,
  useGoogleAnalytics: () => ({ trackEvent: trackEventMock }),
  useRoute: () => ({ query: {} }),
  useSourceUrl,
  useRuntimeConfig: () => ({
    public: {
      portalApiBaseUrl: 'https://portal.solagree.test'
    }
  }),
  watch
})

/**
 * Mirrors the client branch of the shared `useSourceUrl` composable for the
 * webinar contract test: vitest does not set Nuxt's `import.meta.client`
 * flag, so the real composable would return null. The form must source its
 * URL through this hook — the old local helper returned window.location.href
 * with the hash intact, which this sentinel detects.
 */
const clientSourceUrl = (): string | null => {
  const sourceUrl = new URL(window.location.href)

  sourceUrl.hash = ''

  return sourceUrl.toString()
}

interface LifecycleForm {
  name: string
}

const createSubmission = (overrides: Partial<Parameters<typeof useApplicationSubmission<LifecycleForm, unknown>>[0]> = {}) => {
  const form: LifecycleForm = { name: 'Avery' }

  return useApplicationSubmission<LifecycleForm, unknown>({
    getFormState: () => form,
    submit: vi.fn(async () => ({})),
    onSuccess: vi.fn(),
    getErrorMessage: () => 'Something went wrong.',
    ...overrides
  })
}

describe('useApplicationSubmission lifecycle (HIR-370)', () => {
  it('ignores a second submission while the first request is in flight', async () => {
    let resolveSubmission: (value: unknown) => void = () => {}
    const submit = vi.fn(() => new Promise<unknown>((resolve) => {
      resolveSubmission = resolve
    }))
    const onSuccess = vi.fn()

    const submission = createSubmission({ submit, onSuccess })

    void submission.handleSubmit()
    await submission.handleSubmit()

    expect(submit).toHaveBeenCalledTimes(1)

    resolveSubmission({})
    await flushPromises()

    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('aborts before the request when validation fails', async () => {
    const submit = vi.fn()
    const validate = vi.fn(() => false)

    const submission = createSubmission({ validate, submit })

    await submission.handleSubmit()

    expect(validate).toHaveBeenCalledTimes(1)
    expect(submit).not.toHaveBeenCalled()
    expect(submission.submitting.value).toBe(false)
    expect(submission.submissionResult.value).toBeNull()
  })

  it('keeps the result empty after a successful submission', async () => {
    const onSuccess = vi.fn()

    const submission = createSubmission({ onSuccess })

    await submission.handleSubmit()

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(submission.submissionResult.value).toBeNull()
    expect(submission.submitting.value).toBe(false)
  })

  it('publishes an error result with the custom title and message', async () => {
    const submit = vi.fn(async () => {
      throw new Error('portal down')
    })

    const submission = createSubmission({
      submit,
      errorTitle: 'Request not sent',
      getErrorMessage: (error) => `Failed because of ${(error as Error).message}.`
    })

    await submission.handleSubmit()

    expect(submission.submissionResult.value).toEqual({
      kind: 'error',
      title: 'Request not sent',
      message: 'Failed because of portal down.'
    })
    expect(submission.submitting.value).toBe(false)
  })

  it('falls back to the default error title', async () => {
    const submit = vi.fn(async () => {
      throw new Error('portal down')
    })

    const submission = createSubmission({ submit })

    await submission.handleSubmit()

    expect(submission.submissionResult.value?.title).toBe('Submission failed')
  })

  it('logs portal configuration errors to the console', async () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {})
    const submit = vi.fn(async () => {
      throw new PortalApiConfigurationError()
    })

    const submission = createSubmission({ submit })

    await submission.handleSubmit()

    expect(consoleErrorMock).toHaveBeenCalledTimes(1)
    expect(consoleErrorMock).toHaveBeenCalledWith(expect.any(PortalApiConfigurationError))

    consoleErrorMock.mockRestore()
  })

  it('clears a previous error result on the next attempt', async () => {
    let shouldFail = true
    const submit = vi.fn(async () => {
      if (shouldFail) {
        shouldFail = false
        throw new Error('portal down')
      }

      return {}
    })

    const submission = createSubmission({ submit })

    await submission.handleSubmit()

    expect(submission.submissionResult.value?.kind).toBe('error')

    await submission.handleSubmit()

    expect(submission.submissionResult.value).toBeNull()
    expect(submit).toHaveBeenCalledTimes(2)
  })

  it('resetSubmissionResult clears the published error', () => {
    const submission = createSubmission()

    submission.submissionResult.value = {
      kind: 'error',
      title: 'Submission failed',
      message: 'We could not submit your application. Please try again.'
    }

    submission.resetSubmissionResult()

    expect(submission.submissionResult.value).toBeNull()
  })
})

describe('FormResultMessage semantics (HIR-369 contract)', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('announces errors assertively and focuses itself once rendered', async () => {
    const wrapper = mount(FormResultMessage, {
      attachTo: document.body,
      props: {
        kind: 'error',
        title: 'Request not sent',
        message: 'We could not submit your consult request. Please try again.'
      }
    })

    await flushPromises()

    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.attributes('aria-live')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBe('-1')
    expect(wrapper.get('.form-result-message__title').text()).toBe('Request not sent')
    expect(wrapper.text()).toContain('We could not submit your consult request.')
    expect(document.activeElement).toBe(wrapper.element)

    wrapper.unmount()
  })

  it('announces success politely and focuses itself once rendered', async () => {
    const wrapper = mount(FormResultMessage, {
      attachTo: document.body,
      props: { kind: 'success' }
    })

    await flushPromises()

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(wrapper.element)

    wrapper.unmount()
  })

  it('omits the heading when only a message is provided and renders slot content otherwise', () => {
    const messageOnly = mount(FormResultMessage, {
      props: { kind: 'error', message: 'Something went wrong.' }
    })

    expect(messageOnly.find('.form-result-message__title').exists()).toBe(false)
    expect(messageOnly.text()).toContain('Something went wrong.')

    const slotted = mount(FormResultMessage, {
      props: { kind: 'success' },
      slots: {
        default: '<p><strong>Thank you.</strong></p>'
      }
    })

    expect(slotted.text()).toContain('Thank you.')
    expect(slotted.find('.form-result-message__title').exists()).toBe(false)
  })
})

describe('ConsultRequestForm submission lifecycle (HIR-370)', () => {
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
      components: {
        FormResultMessage
      },
      stubs: {
        FormSmsOptInField: true,
        SiteFormSubmit: {
          props: ['label', 'submittingLabel', 'submitting', 'icon'],
          template: '<button type="submit">{{ label }}</button>'
        }
      }
    }
  })

  const fillValidForm = async (wrapper: ReturnType<typeof mountForm>) => {
    await wrapper.get('#consult-full-name').setValue('Avery Quinn')
    await wrapper.get('#consult-email').setValue('avery@example.com')
    await wrapper.get('#consult-phone').setValue('415-555-1234')

    const selects = wrapper.findAll('select')

    for (const select of selects) {
      const option = select.findAll('option').find(element => element.element.value !== '' && element.element.disabled === false)

      await select.setValue(option!.element.value)
    }
  }

  beforeEach(() => {
    submitConsultMock.mockReset()
    navigateToMock.mockClear()
    trackEventMock.mockClear()
  })

  afterEach(() => {
    document.getElementById('main-content')?.remove()
  })

  it('sends exactly one request and one analytics event for a rapid double submit', async () => {
    let resolveSubmission: (value: unknown) => void = () => {}
    submitConsultMock.mockReturnValueOnce(new Promise((resolve) => {
      resolveSubmission = resolve
    }) as Awaited<ReturnType<typeof submitConsultRequest>>)

    const wrapper = mountForm()

    await fillValidForm(wrapper)
    void wrapper.get('form').trigger('submit')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(submitConsultMock).toHaveBeenCalledTimes(1)

    resolveSubmission({})
    await flushPromises()

    expect(trackEventMock).toHaveBeenCalledTimes(1)
    expect(trackEventMock).toHaveBeenCalledWith('consultation_booked', {
      consult_type: 'initial',
      referral_code: undefined,
      source: 'consult_request_form'
    })
    expect(navigateToMock).toHaveBeenCalledTimes(1)
    expect(navigateToMock).toHaveBeenCalledWith({
      path: '/book-a-solagree-consult/thank-you',
      query: undefined
    })

    wrapper.unmount()
  })

  it('replaces a failed result with a successful navigation on retry', async () => {
    submitConsultMock
      .mockRejectedValueOnce(new Error('portal down'))
      .mockResolvedValueOnce({} as Awaited<ReturnType<typeof submitConsultRequest>>)

    const destination = document.createElement('div')
    destination.id = 'main-content'
    destination.innerHTML = '<h1>Thank you for scheduling your consultation!</h1>'
    document.body.appendChild(destination)

    const wrapper = mountForm()

    await fillValidForm(wrapper)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').exists()).toBe(true)

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(navigateToMock).toHaveBeenCalledWith({
      path: '/book-a-solagree-consult/thank-you',
      query: undefined
    })

    wrapper.unmount()
  })

  it('skips the request while the form is invalid', async () => {
    const wrapper = mountForm()

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(submitConsultMock).not.toHaveBeenCalled()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)

    wrapper.unmount()
  })
})

describe('WatchWebinarForm source URL contract (HIR-370)', () => {
  it('submits the shared useSourceUrl value with the hash stripped', async () => {
    const submitWebinarMock = vi.mocked(submitWebinarRegistration)

    submitWebinarMock.mockReset()
    submitWebinarMock.mockResolvedValueOnce({} as Awaited<ReturnType<typeof submitWebinarRegistration>>)

    window.location.hash = 'registration'

    Object.assign(globalThis, { useSourceUrl: clientSourceUrl })

    const wrapper = mount(WatchWebinarForm, {
      attachTo: document.body,
      global: {
        components: {
          FormResultMessage
        },
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>'
          },
          SiteFormSubmit: {
            props: ['label', 'submittingLabel', 'submitting', 'icon'],
            template: '<button type="submit" :disabled="submitting">{{ submitting ? submittingLabel : label }}</button>'
          }
        }
      }
    })

    await wrapper.get('#webinar-business-email').setValue('avery@example.com')
    await wrapper.get('#webinar-first-name').setValue('Avery')
    await wrapper.get('#webinar-last-name').setValue('Quinn')

    const stateSelect = wrapper.get('#webinar-state')
    const firstState = stateSelect.findAll('option').find(option => option.element.value !== '')

    await stateSelect.setValue(firstState!.element.value)

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(submitWebinarMock).toHaveBeenCalledTimes(1)
    expect(submitWebinarMock.mock.calls[0]![1]?.sourceUrl).toBe(`${window.location.origin}${window.location.pathname}`)

    window.location.hash = ''
    Object.assign(globalThis, { useSourceUrl })

    wrapper.unmount()
  })
})
