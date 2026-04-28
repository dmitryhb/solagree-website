import {
  attorneyApplicationInitialState
} from '~/data/attorney-application'
import {
  getAttorneyApplicationSubmissionErrorMessage,
  submitAttorneyApplication
} from '~/services/attorney-application-api'
import type { AttorneyApplicationFetcher } from '~/services/attorney-application-api'
import type {
  AttorneyApplicationFormState,
  AttorneyApplicationResult
} from '~/types/attorney-application'

export interface AttorneyLicenseNumberRow {
  id: string
  value: string
}

type AttorneyApplicationFormModel = Omit<AttorneyApplicationFormState, 'licenseNumbers'> & {
  licenseNumbers: AttorneyLicenseNumberRow[]
}

export interface UseAttorneyApplicationFormReturn {
  currentYear: number
  formEl: Ref<HTMLFormElement | null>
  form: AttorneyApplicationFormModel
  hasAttemptedSubmit: Ref<boolean>
  hasBarStateError: ComputedRef<boolean>
  hasLicenseNumberError: ComputedRef<boolean>
  submitting: Ref<boolean>
  submissionResult: Ref<AttorneyApplicationResult | null>
  addLicenseNumber: () => void
  removeLicenseNumber: (id: string) => void
  updateLicenseNumber: (id: string, value: string) => void
  handleSubmit: () => Promise<void>
}

export const useAttorneyApplicationForm = (): UseAttorneyApplicationFormReturn => {
  const currentYear = new Date().getFullYear()
  const runtimeConfig = useRuntimeConfig()
  const formEl = ref<HTMLFormElement | null>(null)
  const hasAttemptedSubmit = ref(false)
  const submitting = ref(false)
  const submissionResult = ref<AttorneyApplicationResult | null>(null)
  let nextLicenseRowId = 0

  const createLicenseNumberRow = (value = ''): AttorneyLicenseNumberRow => {
    nextLicenseRowId += 1

    return {
      id: `license-${nextLicenseRowId}`,
      value
    }
  }

  const form = reactive<AttorneyApplicationFormModel>({
    ...attorneyApplicationInitialState,
    barStates: [...attorneyApplicationInitialState.barStates],
    licenseNumbers: attorneyApplicationInitialState.licenseNumbers.map((licenseNumber) =>
      createLicenseNumberRow(licenseNumber)
    )
  })

  const hasBarStateError = computed(() => hasAttemptedSubmit.value && form.barStates.length === 0)
  const hasLicenseNumberError = computed(() =>
    hasAttemptedSubmit.value && form.licenseNumbers.some((licenseNumber) => !licenseNumber.value.trim())
  )

  const createSubmissionState = (): AttorneyApplicationFormState => {
    return {
      ...form,
      licenseNumbers: form.licenseNumbers.map((licenseNumber) => licenseNumber.value)
    }
  }

  watch(
    () => form.disciplinaryFinding,
    (value) => {
      if (value !== 'yes') {
        form.disciplinaryExplanation = ''
      }
    }
  )

  const addLicenseNumber = () => {
    form.licenseNumbers.push(createLicenseNumberRow())
  }

  const removeLicenseNumber = (id: string) => {
    if (form.licenseNumbers.length === 1) {
      const licenseNumber = form.licenseNumbers[0]

      if (licenseNumber) {
        licenseNumber.value = ''
      }

      return
    }

    const index = form.licenseNumbers.findIndex((licenseNumber) => licenseNumber.id === id)

    if (index !== -1) {
      form.licenseNumbers.splice(index, 1)
    }
  }

  const updateLicenseNumber = (id: string, value: string) => {
    const licenseNumber = form.licenseNumbers.find((row) => row.id === id)

    if (licenseNumber) {
      licenseNumber.value = value
    }
  }

  const handleSubmit = async () => {
    if (submitting.value) {
      return
    }

    hasAttemptedSubmit.value = true
    submissionResult.value = null

    const hasCustomErrors = hasBarStateError.value || hasLicenseNumberError.value

    if (!formEl.value?.checkValidity() || hasCustomErrors) {
      formEl.value?.reportValidity()
      return
    }

    submitting.value = true

    try {
      await submitAttorneyApplication(createSubmissionState(), {
        portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
        fetcher: $fetch as unknown as AttorneyApplicationFetcher
      })

      await navigateTo('/attorney-application/sent')
    } catch (error) {
      submissionResult.value = {
        kind: 'error',
        title: 'Submission failed',
        message: getAttorneyApplicationSubmissionErrorMessage(error)
      }
    } finally {
      submitting.value = false
    }
  }

  return {
    currentYear,
    formEl,
    form,
    hasAttemptedSubmit,
    hasBarStateError,
    hasLicenseNumberError,
    submitting,
    submissionResult,
    addLicenseNumber,
    removeLicenseNumber,
    updateLicenseNumber,
    handleSubmit
  }
}
