import { isPortalApiConfigurationError } from '~/services/portal-api'
import type { ApplicationResult } from '~/types/form-options'

interface UseApplicationSubmissionOptions<TForm, TResponse> {
  /**
   * Runs after the double-submit guard and result reset, before the request
   * starts. Returning false aborts the submission — typically right after
   * reporting native or custom validation failures to the user.
   */
  validate?: () => boolean | Promise<boolean>
  getFormState: () => TForm
  submit: (form: TForm) => Promise<TResponse>
  onSuccess: (response: TResponse) => Promise<void> | void
  /**
   * Heading rendered above the error message. Message-only forms pass an
   * empty string. Defaults to 'Submission failed'.
   */
  errorTitle?: string
  getErrorMessage: (error: unknown) => string
}

export interface UseApplicationSubmissionReturn {
  submitting: Ref<boolean>
  submissionResult: Ref<ApplicationResult | null>
  resetSubmissionResult: () => void
  handleSubmit: () => Promise<void>
}

/**
 * Handles the common submission lifecycle shared by every form that submits
 * to the Solagree portal: double-submit guard, result reset, pre-submit
 * validation, configuration-error logging, and the inline error result.
 *
 * Per-form behavior (analytics, navigation, inline success, extra validation)
 * is supplied through the typed hooks above; successful submissions never
 * produce an inline result — `onSuccess` either navigates or swaps in the
 * form's own success view.
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

    // The flag is raised before the (possibly async) validation hook so a
    // second submission attempt during validation cannot slip past the guard.
    submitting.value = true

    try {
      if (options.validate && !(await options.validate())) {
        return
      }

      const response = await options.submit(options.getFormState())

      await options.onSuccess(response)
    } catch (error) {
      if (isPortalApiConfigurationError(error)) {
        console.error(error)
      }

      submissionResult.value = {
        kind: 'error',
        title: options.errorTitle ?? 'Submission failed',
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
