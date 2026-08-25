import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CoBrandedConsultModal from '../app/components/co-branded/CoBrandedConsultModal.vue'
import { useGoogleAnalytics } from '../app/composables/useGoogleAnalytics'
import { useSourceUrl } from '../app/composables/useSourceUrl'
import { submitCoBrandedConsultRequest } from '../app/services/consult-request-api'

vi.mock('~/services/consult-request-api', async () => {
  const actual = await vi.importActual<typeof import('../app/services/consult-request-api')>('~/services/consult-request-api')

  return {
    getConsultRequestSubmissionErrorMessage: actual.getConsultRequestSubmissionErrorMessage,
    submitCoBrandedConsultRequest: vi.fn()
  }
})

const submitConsultMock = vi.mocked(submitCoBrandedConsultRequest)

Object.assign(globalThis, {
  computed,
  nextTick,
  reactive,
  ref,
  useGoogleAnalytics,
  useRuntimeConfig: () => ({
    public: {
      portalApiBaseUrl: 'https://portal.solagree.test'
    }
  }),
  useSourceUrl,
  watch
})

/**
 * The modal renders through a real Teleport to document.body, so queries and
 * triggers go through the live document instead of the wrapper root.
 */
const query = <T extends HTMLElement>(selector: string): DOMWrapper<T> => {
  const element = document.querySelector<T>(selector)

  if (!element) {
    throw new Error(`Unable to find ${selector} in document`)
  }

  return new DOMWrapper(element)
}

const setValue = async (selector: string, value: string) => {
  await query<HTMLInputElement>(selector).setValue(value)
}

const createOpener = () => {
  const opener = document.createElement('button')
  opener.type = 'button'
  opener.textContent = 'Open consult modal'
  document.body.appendChild(opener)
  opener.focus()

  return opener
}

const mountModal = () => mount(CoBrandedConsultModal, {
  attachTo: document.body,
  props: {
    open: false,
    companyName: 'Rivera Mediation',
    partnerSlug: 'rivera-mediation',
    pageType: 'standard' as const
  },
  global: {
    stubs: {
      FormSmsOptInField: true
    }
  }
})

const openModal = async (wrapper: ReturnType<typeof mountModal>) => {
  await wrapper.setProps({ open: true })
  await flushPromises()
}

const fillValidForm = async () => {
  await setValue('#co-branded-first-name', 'Avery')
  await setValue('#co-branded-last-name', 'Quinn')
  await setValue('#co-branded-email', 'avery@example.com')
  await setValue('#co-branded-spouse-first-name', 'Rowan')
  await setValue('#co-branded-spouse-last-name', 'Quinn')
}

beforeEach(() => {
  submitConsultMock.mockReset()
})

afterEach(() => {
  document.body.style.overflow = ''
  document.body.innerHTML = ''
})

describe('CoBrandedConsultModal focus behavior (HIR-369 regression)', () => {
  it('locks scroll and focuses the first field when opened', async () => {
    const opener = createOpener()
    const wrapper = mountModal()

    await openModal(wrapper)

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.activeElement).toBe(query('#co-branded-first-name').element)

    wrapper.unmount()
    opener.remove()
  })

  it('traps Tab and Shift+Tab within the panel', async () => {
    const wrapper = mountModal()

    await openModal(wrapper)

    const modal = query('.co-branded-consult-modal')
    const closeButton = query('.co-branded-consult-modal__close')
    const submitButton = query('.co-branded-consult-modal__submit')

    // Tab from the last control wraps to the first control.
    submitButton.element.focus()
    await submitButton.trigger('keydown', { key: 'Tab' })

    expect(document.activeElement).toBe(closeButton.element)

    // Shift+Tab from the first control wraps back to the last control.
    await closeButton.trigger('keydown', { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(submitButton.element)
    expect(modal.element.contains(document.activeElement)).toBe(true)

    wrapper.unmount()
  })

  it('closes on Escape, restores scroll, and returns focus to the opener', async () => {
    const opener = createOpener()
    const wrapper = mountModal()

    await openModal(wrapper)

    await query('.co-branded-consult-modal').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('close')).toHaveLength(1)

    await wrapper.setProps({ open: false })
    await flushPromises()

    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(opener)

    wrapper.unmount()
    opener.remove()
  })

  it('keeps Escape suppressed while submitting', async () => {
    let resolveSubmission: (value: unknown) => void = () => {}
    const submissionGate = new Promise((resolve) => {
      resolveSubmission = resolve
    })

    submitConsultMock.mockReturnValueOnce(submissionGate as ReturnType<typeof submitCoBrandedConsultRequest>)

    const wrapper = mountModal()

    await openModal(wrapper)
    await fillValidForm()
    await query('form').trigger('submit')
    await flushPromises()

    expect(query('.co-branded-consult-modal__submit').attributes('disabled')).toBeDefined()

    await query('.co-branded-consult-modal').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('close')).toBeUndefined()

    resolveSubmission({})
    await flushPromises()

    wrapper.unmount()
  })

  it('focuses the error message after a failed submission', async () => {
    submitConsultMock.mockRejectedValueOnce(new Error('portal down'))

    const wrapper = mountModal()

    await openModal(wrapper)
    await fillValidForm()
    await query('form').trigger('submit')
    await flushPromises()

    const error = query('[role="alert"]')

    expect(error.attributes('tabindex')).toBe('-1')
    expect(error.text()).not.toBe('')
    expect(document.activeElement).toBe(error.element)

    wrapper.unmount()
  })

  it('focuses the success heading after a successful submission', async () => {
    submitConsultMock.mockResolvedValueOnce({} as Awaited<ReturnType<typeof submitCoBrandedConsultRequest>>)

    const wrapper = mountModal()

    await openModal(wrapper)
    await fillValidForm()
    await query('form').trigger('submit')
    await flushPromises()

    const successHeading = query('#co-branded-consult-modal-title')

    expect(successHeading.text()).toContain('Thank you. We received your request.')
    expect(document.activeElement).toBe(successHeading.element)

    wrapper.unmount()
  })
})
