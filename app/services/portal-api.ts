const DEFAULT_PORTAL_SUBMISSION_ERROR_MESSAGE = 'We could not submit your request. Please try again.'

/**
 * Removes trailing slashes so endpoint paths can be appended consistently.
 */
export const normalizePortalApiBaseUrl = (portalApiBaseUrl: string): string => {
  return String(portalApiBaseUrl || '').replace(/\/+$/, '')
}

/**
 * Converts Nuxt/fetch/native errors into a user-facing submission message.
 */
export const getPortalSubmissionErrorMessage = (
  error: unknown,
  fallbackMessage = DEFAULT_PORTAL_SUBMISSION_ERROR_MESSAGE
): string => {
  if (
    typeof error === 'object'
    && error !== null
    && 'data' in error
    && typeof error.data === 'object'
    && error.data !== null
    && 'message' in error.data
    && typeof error.data.message === 'string'
  ) {
    return error.data.message
  }

  if (
    typeof error === 'object'
    && error !== null
    && 'statusMessage' in error
    && typeof error.statusMessage === 'string'
  ) {
    return error.statusMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}
