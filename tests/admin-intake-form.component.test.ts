import { flushPromises, mount } from '@vue/test-utils'
import { computed, nextTick, reactive, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AdminIntakeForm from '../app/components/admin-intake/AdminIntakeForm.vue'
import { submitAdminIntake } from '../app/services/admin-intake-api'

vi.mock('~/services/admin-intake-api', async () => {
  const { getAdminIntakeSubmissionErrorMessage } = await vi.importActual<typeof import('../app/services/admin-intake-api')>('~/services/admin-intake-api')

  return {
    getAdminIntakeSubmissionErrorMessage,
    submitAdminIntake: vi.fn()
  }
})

const submitIntakeMock = vi.mocked(submitAdminIntake)
const navigateToMock = vi.fn(async () => {})

Object.assign(globalThis, {
  computed,
  navigateTo: navigateToMock,
  nextTick,
  reactive,
  ref,
  useRuntimeConfig: () => ({
    public: {
      portalApiBaseUrl: 'https://portal.solagree.test'
    }
  })
})

const mountForm = () => mount(AdminIntakeForm, {
  attachTo: document.body,
  props: { slug: 'alpha-link' },
  global: {
    stubs: {
      SiteFormSubmit: {
        props: ['label', 'submitting'],
        template: '<button type="submit">{{ label }}</button>'
      }
    }
  }
})

const fillValidForm = async (wrapper: ReturnType<typeof mountForm>) => {
  await wrapper.get('#intake-primary-first-name').setValue('Avery')
  await wrapper.get('#intake-primary-last-name').setValue('Quinn')
  await wrapper.get('#intake-primary-email').setValue('avery@example.com')
  await wrapper.get('#intake-spouse-first-name').setValue('Rowan')
  await wrapper.get('#intake-spouse-last-name').setValue('Quinn')
}

beforeEach(() => {
  submitIntakeMock.mockReset()
  navigateToMock.mockClear()
})

afterEach(() => {
  document.body.style.overflow = ''
  document.getElementById('main-content')?.remove()
})

describe('AdminIntakeForm accessibility (HIR-369)', () => {
  it('gives the privacy radiogroup a resolvable accessible name', () => {
    const wrapper = mountForm()
    const radiogroup = wrapper.get('[role="radiogroup"]')

    expect(radiogroup.attributes('aria-labelledby')).toBe('privacy-preference-label')
    expect(wrapper.get('#privacy-preference-label').text()).toContain('Privacy preference')

    wrapper.unmount()
  })

  it('announces submission failures assertively and focuses the message', async () => {
    submitIntakeMock.mockRejectedValueOnce(new Error('portal down'))

    const wrapper = mountForm()

    await fillValidForm(wrapper)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    const result = wrapper.get('[role="alert"]')

    expect(result.attributes('tabindex')).toBe('-1')
    expect(result.text()).toContain('Request not sent')
    expect(result.text()).not.toBe('')
    expect(document.activeElement).toBe(result.element)

    wrapper.unmount()
  })

  it('moves focus to the destination heading after successful navigation', async () => {
    submitIntakeMock.mockResolvedValueOnce({ submissionId: 'intake-1' })

    const destination = document.createElement('div')
    destination.id = 'main-content'
    destination.innerHTML = '<h1>Thank you — your intake has been submitted!</h1>'
    document.body.appendChild(destination)

    const wrapper = mountForm()

    await fillValidForm(wrapper)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(navigateToMock).toHaveBeenCalledWith('/meet/alpha-link/thank-you')

    const destinationHeading = destination.querySelector('h1')

    expect(destinationHeading?.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(destinationHeading)

    wrapper.unmount()
  })
})
