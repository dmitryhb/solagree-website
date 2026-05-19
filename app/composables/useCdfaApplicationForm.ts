import { cdfaApplicationInitialState } from '~/data/cdfa-application'
import {
  getCdfaApplicationSubmissionErrorMessage,
  submitCdfaApplication
} from '~/services/cdfa-application-api'
import { isPortalApiConfigurationError } from '~/services/portal-api'
import type { CdfaApplicationFetcher } from '~/services/cdfa-application-api'
import type {
  CdfaApplicationFormState,
  CdfaApplicationResult
} from '~/types/cdfa-application'

export interface UseCdfaApplicationFormReturn {
  formEl: Ref<HTMLFormElement | null>
  form: CdfaApplicationFormState
  hasAttemptedSubmit: Ref<boolean>
  hasSpecializationError: ComputedRef<boolean>
  submitting: Ref<boolean>
  submissionResult: Ref<CdfaApplicationResult | null>
  handleSubmit: () => Promise<void>
}

export const useCdfaApplicationForm = (): UseCdfaApplicationFormReturn => {
  const runtimeConfig = useRuntimeConfig()
  const formEl = ref<HTMLFormElement | null>(null)
  const hasAttemptedSubmit = ref(false)
  const submitting = ref(false)
  const submissionResult = ref<CdfaApplicationResult | null>(null)

  const form = reactive<CdfaApplicationFormState>({
    ...cdfaApplicationInitialState,
    specializations: [...cdfaApplicationInitialState.specializations]
  })

  const hasSpecializationError = computed(() =>
    hasAttemptedSubmit.value && form.specializations.length === 0
  )

  const focusFirstSpecialization = async () => {
    await nextTick()
    const firstSpecializationInput = formEl.value?.querySelector<HTMLInputElement>(
      'input[name="specializations"]'
    )

    firstSpecializationInput?.focus()
  }

  const handleSubmit = async () => {
    if (submitting.value) {
      return
    }

    hasAttemptedSubmit.value = true
    submissionResult.value = null

    const hasCustomErrors = hasSpecializationError.value

    if (!formEl.value?.checkValidity() || hasCustomErrors) {
      formEl.value?.reportValidity()

      if (hasCustomErrors) {
        await focusFirstSpecialization()
      }

      return
    }

    submitting.value = true

    try {
      await submitCdfaApplication(form, {
        portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
        fetcher: $fetch as unknown as CdfaApplicationFetcher
      })

      await navigateTo('/cdfa-application/sent')
    } catch (error) {
      if (isPortalApiConfigurationError(error)) {
        console.error(error)
      }

      submissionResult.value = {
        kind: 'error',
        title: 'Submission failed',
        message: getCdfaApplicationSubmissionErrorMessage(error)
      }
    } finally {
      submitting.value = false
    }
  }

  return {
    formEl,
    form,
    hasAttemptedSubmit,
    hasSpecializationError,
    submitting,
    submissionResult,
    handleSubmit
  }
}
