import { isPortalApiConfigurationError } from '~/services/portal-api'
import type { ApplicationResult } from '~/types/form-options'

interface UseApplicationSubmissionOptions<TForm, TResponse> {
  getFormState: () => TForm
  submit: (form: TForm) => Promise<TResponse>
  onSuccess: (response: TResponse) => Promise<void> | void
  getErrorMessage: (error: unknown) => string
}

export interface UseApplicationSubmissionReturn {
  submitting: Ref<boolean>
  submissionResult: Ref<ApplicationResult | null>
  resetSubmissionResult: () => void
  handleSubmit: () => Promise<void>
}

/**
 * Handles the common submission lifecycle for application forms.
 */
export const useApplicationSubmission = <TForm, TResponse>(
  options: UseApplicationSubmissionOptions<TForm, TResponse>
): UseApplicationSubmissionReturn => {
  const submitting = ref(false)
  const submissionResult = ref<ApplicationResult | null>(null)

  const resetSubmissionResult = () => {
    submissionResult.value = null
  }

  const handleSubmit = async () => {
    if (submitting.value) {
      return
    }

    resetSubmissionResult()
    submitting.value = true

    try {
      const response = await options.submit(options.getFormState())

      await options.onSuccess(response)
    } catch (error) {
      if (isPortalApiConfigurationError(error)) {
        console.error(error)
      }

      submissionResult.value = {
        kind: 'error',
        title: 'Submission failed',
        message: options.getErrorMessage(error)
      }
    } finally {
      submitting.value = false
    }
  }

  return {
    submitting,
    submissionResult,
    resetSubmissionResult,
    handleSubmit
  }
}
