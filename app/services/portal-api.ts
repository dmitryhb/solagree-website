const DEFAULT_PORTAL_SUBMISSION_ERROR_MESSAGE = 'We could not submit your request. Please try again.'
const PORTAL_API_CONFIG_ERROR_MESSAGE = 'Portal API base URL is not configured. Set NUXT_PUBLIC_PORTAL_API_BASE_URL to an absolute URL before using portal integrations.'

export class PortalApiConfigurationError extends Error {
  constructor(message = PORTAL_API_CONFIG_ERROR_MESSAGE) {
    super(message)
    this.name = 'PortalApiConfigurationError'
  }
}

export const isPortalApiConfigurationError = (error: unknown): error is PortalApiConfigurationError => {
  return error instanceof PortalApiConfigurationError
}

/**
 * Validates and removes trailing slashes so endpoint paths can be appended consistently.
 */
export const normalizePortalApiBaseUrl = (portalApiBaseUrl: string): string => {
  const normalizedPortalApiBaseUrl = String(portalApiBaseUrl || '').trim().replace(/\/+$/, '')

  if (!normalizedPortalApiBaseUrl) {
    throw new PortalApiConfigurationError()
  }

  try {
    const parsedUrl = new URL(normalizedPortalApiBaseUrl)

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new PortalApiConfigurationError(
        'Portal API base URL must use http or https. Set NUXT_PUBLIC_PORTAL_API_BASE_URL to an absolute URL before using portal integrations.'
      )
    }
  } catch (error) {
    if (isPortalApiConfigurationError(error)) {
      throw error
    }

    throw new PortalApiConfigurationError(
      'Portal API base URL is invalid. Set NUXT_PUBLIC_PORTAL_API_BASE_URL to an absolute URL before using portal integrations.'
    )
  }

  return normalizedPortalApiBaseUrl
}

/**
 * Converts Nuxt/fetch/native errors into a user-facing submission message.
 */
export const getPortalSubmissionErrorMessage = (
  error: unknown,
  fallbackMessage = DEFAULT_PORTAL_SUBMISSION_ERROR_MESSAGE
): string => {
  if (isPortalApiConfigurationError(error)) {
    return fallbackMessage
  }

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
