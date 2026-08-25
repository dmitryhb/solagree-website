import { cdfaApplicationInitialState } from '~/data/cdfa-application'
import {
  getCdfaApplicationSubmissionErrorMessage,
  submitCdfaApplication
} from '~/services/cdfa-application-api'
import { websitePortalFetcher } from '~/services/portal-api'
import type { CdfaApplicationFormState } from '~/types/cdfa-application'
import type { ApplicationResult } from '~/types/form-options'

export interface UseCdfaApplicationFormReturn {
  formEl: Ref<HTMLFormElement | null>
  form: CdfaApplicationFormState
  hasAttemptedSubmit: Ref<boolean>
  hasSpecializationError: ComputedRef<boolean>
  submitting: Ref<boolean>
  submissionResult: Ref<ApplicationResult | null>
  handleSubmit: () => Promise<void>
}

export const useCdfaApplicationForm = (): UseCdfaApplicationFormReturn => {
  const runtimeConfig = useRuntimeConfig()
  const { trackEvent } = useGoogleAnalytics()
  const formEl = ref<HTMLFormElement | null>(null)
  const hasAttemptedSubmit = ref(false)

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

  const submission = useApplicationSubmission<CdfaApplicationFormState, unknown>({
    getFormState: () => form,
    submit: (formState) => submitCdfaApplication(formState, {
      portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
      fetcher: websitePortalFetcher
    }),
    onSuccess: async () => {
      trackEvent('partner_application_submitted', {
        partner_type: 'cdfa',
        source: 'cdfa_application_form'
      })

      await navigateTo('/cdfa-application/sent')
    },
    getErrorMessage: getCdfaApplicationSubmissionErrorMessage
  })

  const handleSubmit = async () => {
    hasAttemptedSubmit.value = true
    submission.resetSubmissionResult()

    const hasCustomErrors = hasSpecializationError.value

    if (!formEl.value?.checkValidity() || hasCustomErrors) {
      formEl.value?.reportValidity()

      if (hasCustomErrors) {
        await focusFirstSpecialization()
      }

      return
    }

    await submission.handleSubmit()
  }

  return {
    formEl,
    form,
    hasAttemptedSubmit,
    hasSpecializationError,
    submitting: submission.submitting,
    submissionResult: submission.submissionResult,
    handleSubmit
  }
}
