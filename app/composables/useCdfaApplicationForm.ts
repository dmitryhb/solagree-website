import { cdfaApplicationInitialState } from '~/data/cdfa-application'
import {
  getCdfaApplicationSubmissionErrorMessage,
  submitCdfaApplication
} from '~/services/cdfa-application-api'
import { usePortalFormSubmissionOptions } from '~/composables/usePortalFormSubmissionOptions'
import { focusPageDestination } from '~/utils/focus-destination'
import { validateNativeForm } from '~/utils/native-form-validation'
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
  const portalSubmissionOptions = usePortalFormSubmissionOptions()
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

  const submission = useApplicationSubmission<CdfaApplicationFormState, Awaited<ReturnType<typeof submitCdfaApplication>>>({
    validate: async () => {
      hasAttemptedSubmit.value = true

      const hasCustomErrors = hasSpecializationError.value

      if (!validateNativeForm(formEl.value) || hasCustomErrors) {
        if (hasCustomErrors) {
          await focusFirstSpecialization()
        }

        return false
      }

      return true
    },
    getFormState: () => form,
    submit: (formState) => submitCdfaApplication(formState, {
      ...portalSubmissionOptions
    }),
    onSuccess: async () => {
      trackEvent('partner_application_submitted', {
        partner_type: 'cdfa',
        source: 'cdfa_application_form'
      })

      await navigateTo('/cdfa-application/sent')
      await focusPageDestination()
    },
    getErrorMessage: getCdfaApplicationSubmissionErrorMessage
  })

  return {
    formEl,
    form,
    hasAttemptedSubmit,
    hasSpecializationError,
    submitting: submission.submitting,
    submissionResult: submission.submissionResult,
    handleSubmit: submission.handleSubmit
  }
}
