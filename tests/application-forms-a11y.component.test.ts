import { flushPromises, mount } from '@vue/test-utils'
import { nextTick, reactive, ref, watch } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ApplicationSelectField from '../app/components/application/ApplicationSelectField.vue'
import ApplicationTextField from '../app/components/application/ApplicationTextField.vue'
import AttorneyApplicationBarStatesFieldset from '../app/components/attorney/AttorneyApplicationBarStatesFieldset.vue'
import AttorneyApplicationForm from '../app/components/attorney/AttorneyApplicationForm.vue'
import AttorneyApplicationLicenseFieldset from '../app/components/attorney/AttorneyApplicationLicenseFieldset.vue'
import CdfaApplicationForm from '../app/components/cdfa/CdfaApplicationForm.vue'
import CdfaApplicationSpecializationsFieldset from '../app/components/cdfa/CdfaApplicationSpecializationsFieldset.vue'
import FormResultMessage from '../app/components/FormResultMessage.vue'
import { useAttorneyApplicationForm } from '../app/composables/useAttorneyApplicationForm'
import { useCdfaApplicationForm } from '../app/composables/useCdfaApplicationForm'

interface SubmissionResultValue {
  kind: 'success' | 'error'
  title: string
  message: string
}

interface AttorneyFormHarness {
  submitting: { value: boolean }
  submissionResult: { value: SubmissionResultValue | null }
}

interface CdfaFormHarness {
  submitting: { value: boolean }
  submissionResult: { value: SubmissionResultValue | null }
}

const attorneyHarness = vi.hoisted(() => ({ current: null as AttorneyFormHarness | null }))
const cdfaHarness = vi.hoisted(() => ({ current: null as CdfaFormHarness | null }))

vi.mock('~/composables/useAttorneyApplicationForm', async () => {
  const { reactive, ref } = await import('vue')

  const createHarness = () => {
    const harness = {
      currentYear: 2026,
      formEl: ref(null),
      form: reactive({
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        barStates: [] as string[],
        licenseNumbers: [{ id: 'license-1', value: '' }],
        initialLicensureYear: '',
        goodStanding: '',
        disciplinaryFinding: '',
        disciplinaryExplanation: '',
        mediationExperience: '',
        neutralInterest: '',
        adrNetworks: '',
        consultationInterest: '',
        smsOptIn: false,
        termsAccepted: false
      }),
      hasAttemptedSubmit: ref(false),
      hasBarStateError: ref(false),
      hasLicenseNumberError: ref(false),
      submitting: ref(false),
      submissionResult: ref<SubmissionResultValue | null>(null),
      addLicenseNumber: () => {},
      removeLicenseNumber: () => {},
      updateLicenseNumber: () => {},
      handleSubmit: async () => {}
    }

    attorneyHarness.current = harness

    return harness
  }

  return { useAttorneyApplicationForm: createHarness }
})

vi.mock('~/composables/useCdfaApplicationForm', async () => {
  const { reactive, ref } = await import('vue')

  const createHarness = () => {
    const harness = {
      formEl: ref(null),
      form: reactive({
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        certificationStatus: '',
        certificationNumber: '',
        clientExperience: '',
        serviceArea: '',
        specializations: [] as string[],
        adrNetworks: '',
        clientSource: '',
        consultationInterest: '',
        smsOptIn: false,
        termsAccepted: false
      }),
      hasAttemptedSubmit: ref(false),
      hasSpecializationError: ref(false),
      submitting: ref(false),
      submissionResult: ref<SubmissionResultValue | null>(null),
      handleSubmit: async () => {}
    }

    cdfaHarness.current = harness

    return harness
  }

  return { useCdfaApplicationForm: createHarness }
})

Object.assign(globalThis, {
  nextTick,
  reactive,
  ref,
  useAttorneyApplicationForm,
  useCdfaApplicationForm,
  watch
})

const applicationFormGlobals = {
  components: {
    ApplicationSelectField,
    ApplicationTextField,
    AttorneyApplicationBarStatesFieldset,
    AttorneyApplicationLicenseFieldset,
    CdfaApplicationSpecializationsFieldset,
    FormResultMessage
  },
  stubs: {
    FormSmsOptInField: true,
    NuxtLink: {
      props: ['to'],
      template: '<a :href="to"><slot /></a>'
    },
    SiteFormSubmit: {
      props: ['label', 'submitting'],
      template: '<button type="submit">{{ label }}</button>'
    }
  }
}

const mountAttorneyForm = () => mount(AttorneyApplicationForm, {
  attachTo: document.body,
  global: applicationFormGlobals
})

const mountCdfaForm = () => mount(CdfaApplicationForm, {
  attachTo: document.body,
  global: applicationFormGlobals
})

beforeEach(() => {
  attorneyHarness.current = null
  cdfaHarness.current = null
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('ApplicationTextField described text (HIR-369)', () => {
  it('connects extra help text to the native control via aria-describedby', () => {
    const wrapper = mount(ApplicationTextField, {
      props: {
        id: 'field-with-hint',
        modelValue: '',
        label: 'Service area',
        name: 'serviceArea',
        describedBy: 'service-area-hint'
      }
    })

    expect(wrapper.get('input').attributes('aria-describedby')).toBe('service-area-hint')
  })

  it('omits aria-describedby when no help text is provided', () => {
    const wrapper = mount(ApplicationTextField, {
      props: {
        id: 'plain-field',
        modelValue: '',
        label: 'Name',
        name: 'name'
      }
    })

    expect(wrapper.get('input').attributes('aria-describedby')).toBeUndefined()
  })

  it('connects multiline controls as well', () => {
    const wrapper = mount(ApplicationTextField, {
      props: {
        id: 'multiline-with-hint',
        modelValue: '',
        label: 'Details',
        name: 'details',
        multiline: true,
        describedBy: 'details-hint'
      }
    })

    expect(wrapper.get('textarea').attributes('aria-describedby')).toBe('details-hint')
  })
})

describe('neutral shared field contract (HIR-600)', () => {
  it('forwards native text constraints without an attorney-specific class dependency', () => {
    const wrapper = mount(ApplicationTextField, {
      props: {
        id: 'neutral-phone',
        modelValue: '',
        label: 'Phone',
        name: 'phone',
        type: 'tel',
        autocomplete: 'tel-national',
        inputmode: 'tel',
        maxlength: 40,
        pattern: '\\d{10}',
        title: 'Enter ten digits.',
        variant: 'co-branded'
      }
    })

    const input = wrapper.get('input')

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['form-field', 'form-field--co-branded']))
    expect(wrapper.html()).not.toContain('attorney-application-form__')
    expect(input.attributes()).toMatchObject({
      autocomplete: 'tel-national',
      inputmode: 'tel',
      maxlength: '40',
      name: 'phone',
      pattern: '\\d{10}',
      title: 'Enter ten digits.',
      type: 'tel'
    })
    expect(input.attributes('placeholder')).toBeUndefined()
  })

  it('supports an enabled placeholder and disabled domain options in selects', () => {
    const wrapper = mount(ApplicationSelectField, {
      props: {
        id: 'contact-method',
        modelValue: '',
        label: 'Preferred contact method',
        name: 'preferredContactMethod',
        options: [
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone', disabled: true }
        ],
        placeholder: 'No preference',
        placeholderDisabled: false
      }
    })

    const options = wrapper.findAll('option')

    expect(options[0]!.attributes('disabled')).toBeUndefined()
    expect(options[0]!.text()).toBe('No preference')
    expect(options[2]!.attributes('disabled')).toBeDefined()
  })

  it('keeps visually hidden labels free of visual required markers', () => {
    const wrapper = mount(ApplicationTextField, {
      props: {
        id: 'contact-email',
        modelValue: '',
        label: 'Email',
        name: 'email',
        labelVisuallyHidden: true,
        required: true
      }
    })

    expect(wrapper.get('label').text()).toBe('Email')
    expect(wrapper.get('input').attributes('required')).toBeDefined()
  })
})

describe('Attorney and CDFA phone parity (HIR-369)', () => {
  it('presents consistent US phone instructions and validation', () => {
    const attorneyWrapper = mountAttorneyForm()
    const cdfaWrapper = mountCdfaForm()
    const attorneyPhone = attorneyWrapper.get('#attorney-phone')
    const cdfaPhone = cdfaWrapper.get('#cdfa-phone')

    for (const phone of [attorneyPhone, cdfaPhone]) {
      expect(phone.attributes('type')).toBe('tel')
      expect(phone.attributes('inputmode')).toBe('tel')
      expect(phone.attributes('autocomplete')).toMatch(/^tel(-national)?$/)
      expect(phone.attributes('title')).toContain('10-digit US phone number')
      expect(phone.attributes('pattern')).toBeTruthy()
    }

    // The attorney placeholder advertises an optional leading country code.
    const attorneyPattern = new RegExp(`^(?:${attorneyPhone.attributes('pattern')})$`)

    expect(attorneyPattern.test('1-415-555-1234')).toBe(true)
    expect(attorneyPattern.test('415-555-1234')).toBe(true)
    expect(attorneyPattern.test('(415) 555-1234')).toBe(true)
    expect(attorneyPattern.test('not-a-phone')).toBe(false)

    // The CDFA behavior stays unchanged and accepts the displayed format.
    const cdfaPattern = new RegExp(`^(?:${cdfaPhone.attributes('pattern')})$`)

    expect(cdfaPattern.test('415-555-1234')).toBe(true)
    expect(cdfaPattern.test('(415) 555-1234')).toBe(true)
    expect(cdfaPattern.test('not-a-phone')).toBe(false)

    attorneyWrapper.unmount()
    cdfaWrapper.unmount()
  })
})

describe('CDFA service area help text (HIR-369)', () => {
  it('associates the help text with the service area input', () => {
    const wrapper = mountCdfaForm()
    const input = wrapper.get('#cdfa-service-area')
    const hint = wrapper.get('#cdfa-service-area-hint')

    expect(input.attributes('aria-describedby')).toBe('cdfa-service-area-hint')
    expect(hint.text()).toContain('CDFAs can work remotely nationwide')

    wrapper.unmount()
  })
})

describe('Application submission errors (HIR-369)', () => {
  it.each([
    ['attorney', mountAttorneyForm, attorneyHarness],
    ['CDFA', mountCdfaForm, cdfaHarness]
  ])('exposes %s form busy state while submitting', async (_name, mountForm, harness) => {
    const wrapper = mountForm()

    expect(wrapper.get('form').attributes('aria-busy')).toBe('false')

    harness.current!.submitting.value = true
    await nextTick()

    expect(wrapper.get('form').attributes('aria-busy')).toBe('true')

    harness.current!.submitting.value = false
    await nextTick()

    expect(wrapper.get('form').attributes('aria-busy')).toBe('false')

    wrapper.unmount()
  })

  it('announces attorney errors assertively and focuses the message', async () => {
    const wrapper = mountAttorneyForm()

    attorneyHarness.current!.submissionResult.value = {
      kind: 'error',
      title: 'Submission failed',
      message: 'We could not submit your application. Please try again.'
    }

    await flushPromises()

    const result = wrapper.get('[role="alert"]')

    expect(result.attributes('tabindex')).toBe('-1')
    expect(result.text()).toContain('Submission failed')
    expect(document.activeElement).toBe(result.element)

    wrapper.unmount()
  })

  it('announces CDFA errors assertively and focuses the message', async () => {
    const wrapper = mountCdfaForm()

    cdfaHarness.current!.submissionResult.value = {
      kind: 'error',
      title: 'Submission failed',
      message: 'We could not submit your application. Please try again.'
    }

    await flushPromises()

    const result = wrapper.get('[role="alert"]')

    expect(result.attributes('tabindex')).toBe('-1')
    expect(result.text()).toContain('Submission failed')
    expect(document.activeElement).toBe(result.element)

    wrapper.unmount()
  })
})

describe('aria-invalid placement in fieldsets (HIR-369)', () => {
  it('marks the native bar state checkboxes, not the list container', () => {
    const wrapper = mount(AttorneyApplicationBarStatesFieldset, {
      props: {
        modelValue: [],
        hasError: true
      }
    })

    const stateList = wrapper.get('.form-checkbox-group__options')

    expect(stateList.attributes('aria-invalid')).toBeUndefined()
    expect(stateList.attributes('aria-describedby')).toBeUndefined()

    const checkboxes = wrapper.findAll('input[name="barStates"]')

    expect(checkboxes.length).toBeGreaterThan(0)

    for (const checkbox of checkboxes) {
      expect(checkbox.attributes('aria-invalid')).toBe('true')
      expect(checkbox.attributes('aria-describedby')).toBe('attorney-bar-states-hint attorney-bar-states-error')
    }

    expect(wrapper.get('#attorney-bar-states-error').attributes('role')).toBe('alert')
  })

  it('clears aria-invalid from the bar state checkboxes once resolved', () => {
    const wrapper = mount(AttorneyApplicationBarStatesFieldset, {
      props: {
        modelValue: ['CA'],
        hasError: false
      }
    })

    for (const checkbox of wrapper.findAll('input[name="barStates"]')) {
      expect(checkbox.attributes('aria-invalid')).toBeUndefined()
      expect(checkbox.attributes('aria-describedby')).toBe('attorney-bar-states-hint')
    }
  })

  it('marks the native specialization checkboxes, not the fieldset', () => {
    const wrapper = mount(CdfaApplicationSpecializationsFieldset, {
      props: {
        modelValue: [],
        hasError: true
      }
    })

    expect(wrapper.get('fieldset').attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.get('fieldset').attributes('aria-describedby')).toBeUndefined()

    const checkboxes = wrapper.findAll('input[name="specializations"]')

    expect(checkboxes.length).toBeGreaterThan(0)

    for (const checkbox of checkboxes) {
      expect(checkbox.attributes('aria-invalid')).toBe('true')
      expect(checkbox.attributes('aria-describedby')).toBe('cdfa-specializations-error')
    }

    expect(wrapper.get('#cdfa-specializations-error').attributes('role')).toBe('alert')
  })
})
