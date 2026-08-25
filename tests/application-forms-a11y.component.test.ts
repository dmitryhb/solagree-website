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
import { useAttorneyApplicationForm } from '../app/composables/useAttorneyApplicationForm'
import { useCdfaApplicationForm } from '../app/composables/useCdfaApplicationForm'

interface SubmissionResultValue {
  kind: 'success' | 'error'
  title: string
  message: string
}

interface AttorneyFormHarness {
  submissionResult: { value: SubmissionResultValue | null }
}

interface CdfaFormHarness {
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
    CdfaApplicationSpecializationsFieldset
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

    const stateList = wrapper.get('.attorney-application-form__state-list')

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
