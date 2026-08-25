const DEFAULT_PORTAL_SUBMISSION_ERROR_MESSAGE = 'We could not submit your request. Please try again.'
const PORTAL_API_CONFIG_ERROR_MESSAGE = 'Portal API base URL is not configured. Set NUXT_PUBLIC_PORTAL_API_BASE_URL to an absolute URL before using portal integrations.'

export class PortalApiConfigurationError extends Error {
  constructor(message = PORTAL_API_CONFIG_ERROR_MESSAGE) {
    super(message)
    this.name = 'PortalApiConfigurationError'
  }
}

export interface PortalFetchOptions<TBody> {
  method: 'POST'
  body: TBody
}

/**
 * Fetch implementation used by portal submission services.
 */
export type PortalFetcher<TBody> = <TResponse>(
  request: string,
  options: PortalFetchOptions<TBody>
) => Promise<TResponse>

/**
 * Shared dependencies required by portal submission services.
 */
export interface PortalSubmitOptions<TBody> {
  portalApiBaseUrl: string
  fetcher: PortalFetcher<TBody>
}

/**
 * Default website fetcher for portal submissions.
 *
 * Wraps Nuxt's global `$fetch` in the injectable `PortalFetcher` shape so
 * components pass one typed fetcher instead of repeating the double cast at
 * every call site. Dependency injection is unchanged: services still accept
 * any `PortalFetcher`-compatible implementation.
 */
export const websitePortalFetcher = async <TResponse>(
  request: string,
  options: PortalFetchOptions<unknown>
): Promise<TResponse> => {
  const response: unknown = await $fetch(
    request,
    options as PortalFetchOptions<Record<string, unknown>>
  )

  return response as TResponse
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

/**
 * Guard for required string fields on portal responses.
 */
export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.length > 0
}

/**
 * Parses a non-error 2xx portal response into the endpoint's success value.
 *
 * Return the parsed success value, or `null` when the response does not
 * satisfy the endpoint's documented success shape.
 */
export type PortalSuccessParser<TSuccess> = (response: object) => TSuccess | null

/**
 * Success parser for endpoints whose response carries a `submissionId`.
 *
 * Requires a non-empty string `submissionId`, mirroring the shared
 * `ContactSubmissionApiResponse` contract.
 */
export const parsePortalSubmissionIdSuccess = <TSuccess extends { submissionId: string }>(
  response: object
): TSuccess | null => {
  return 'submissionId' in response && isNonEmptyString(response.submissionId)
    ? response as TSuccess
    : null
}

/**
 * Success parser for endpoints whose response carries a `requestId`.
 *
 * Requires a non-empty string `requestId`, mirroring the shared
 * `ConsultRequestApiResponse` contract.
 */
export const parsePortalRequestIdSuccess = <TSuccess extends { requestId: string }>(
  response: object
): TSuccess | null => {
  return 'requestId' in response && isNonEmptyString(response.requestId)
    ? response as TSuccess
    : null
}

/**
 * Shared POST submission helper used by all portal submission services.
 *
 * Runtime contract:
 * - the raw response is guarded as a non-null object before any property access;
 * - an explicit portal error response throws its safe message or the fallback;
 * - malformed 2xx responses throw the user-safe fallback instead of leaking
 *   native errors such as `Cannot use 'in' operator` through the UI.
 *
 * Fetch, network, and configuration errors propagate to the caller unchanged.
 */
export const submitToPortal = async <TPayload, TSuccess>(
  options: PortalSubmitOptions<TPayload> & {
    /** Endpoint path appended to the normalized portal base URL. */
    endpoint: string
    /** Request body submitted with the POST. */
    payload: TPayload
    /**
     * Validates the 2xx response shape and returns the endpoint's success
     * value, or `null` when the response is malformed.
     */
    parseSuccess: PortalSuccessParser<TSuccess>
    /**
     * User-safe message thrown when the portal reports an error without a
     * message, or when the success response is malformed. Defaults to the
     * shared portal submission failure message.
     */
    fallbackMessage?: string
  }
): Promise<TSuccess> => {
  const fallbackMessage = options.fallbackMessage ?? DEFAULT_PORTAL_SUBMISSION_ERROR_MESSAGE
  const portalApiBaseUrl = normalizePortalApiBaseUrl(options.portalApiBaseUrl)

  const response: unknown = await options.fetcher<unknown>(
    `${portalApiBaseUrl}${options.endpoint}`,
    { method: 'POST', body: options.payload }
  )

  if (typeof response !== 'object' || response === null) {
    throw new Error(fallbackMessage)
  }

  const responseObject = response as Record<string, unknown>

  if (responseObject.error) {
    throw new Error(isNonEmptyString(responseObject.message) ? responseObject.message : fallbackMessage)
  }

  const success = options.parseSuccess(responseObject)

  if (success === null || success === undefined) {
    throw new Error(fallbackMessage)
  }

  return success
}
