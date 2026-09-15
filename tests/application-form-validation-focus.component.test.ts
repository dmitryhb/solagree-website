import { computed, nextTick, reactive, ref, watch } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useApplicationSubmission } from '../app/composables/useApplicationSubmission'
import { useAttorneyApplicationForm } from '../app/composables/useAttorneyApplicationForm'
import { useCdfaApplicationForm } from '../app/composables/useCdfaApplicationForm'

Object.assign(globalThis, {
  computed,
  navigateTo: vi.fn(async () => {}),
  nextTick,
  reactive,
  ref,
  useApplicationSubmission,
  useGoogleAnalytics: () => ({ trackEvent: vi.fn() }),
  useRuntimeConfig: () => ({
    public: {
      portalApiBaseUrl: 'https://portal.solagree.test'
    }
  }),
  watch
})

const createForm = (): HTMLFormElement => {
  const form = document.createElement('form')

  document.body.appendChild(form)

  return form
}

const appendRequiredInput = (form: HTMLFormElement, name: string): HTMLInputElement => {
  const input = document.createElement('input')

  input.name = name
  input.required = true
  form.appendChild(input)

  return input
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('application form validation focus (HIR-599)', () => {
  it('focuses the first bar-state control after the custom error is rendered', async () => {
    const submission = useAttorneyApplicationForm()
    const form = createForm()
    const barState = document.createElement('input')

    barState.name = 'barStates'
    barState.type = 'checkbox'
    form.appendChild(barState)
    submission.formEl.value = form
    submission.form.licenseNumbers[0]!.value = 'CA-123'

    await submission.handleSubmit()

    expect(submission.hasBarStateError.value).toBe(true)
    expect(document.activeElement).toBe(barState)
  })

  it('keeps the first native-invalid control as the focus target', async () => {
    const submission = useAttorneyApplicationForm()
    const form = createForm()
    const nativeInvalid = appendRequiredInput(form, 'name')

    submission.formEl.value = form
    submission.form.barStates.push('CA')
    submission.form.licenseNumbers[0]!.value = 'CA-123'

    await submission.handleSubmit()

    expect(document.activeElement).toBe(nativeInvalid)
  })

  it('focuses an empty required license row', async () => {
    const submission = useAttorneyApplicationForm()
    const form = createForm()
    const licenseNumber = appendRequiredInput(form, 'licenseNumber-0')

    submission.formEl.value = form
    submission.form.barStates.push('CA')

    await submission.handleSubmit()

    expect(submission.hasLicenseNumberError.value).toBe(true)
    expect(document.activeElement).toBe(licenseNumber)
  })

  it('retains CDFA specialization focus for its custom validation error', async () => {
    const submission = useCdfaApplicationForm()
    const form = createForm()
    const specialization = document.createElement('input')

    specialization.name = 'specializations'
    specialization.type = 'checkbox'
    form.appendChild(specialization)
    submission.formEl.value = form

    await submission.handleSubmit()

    expect(submission.hasSpecializationError.value).toBe(true)
    expect(document.activeElement).toBe(specialization)
  })
})
