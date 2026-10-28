import { prepareWebsiteMarketingSubmission } from './marketing-origin'
const DEFAULT_PORTAL_SUBMISSION_ERROR_MESSAGE = 'We could not submit your request. Please try again.'
const PORTAL_API_CONFIG_ERROR_MESSAGE = 'Portal API base URL is not configured. Set NUXT_PUBLIC_PORTAL_API_BASE_URL to an http or https origin, without a path, query, fragment, or credentials.'
export const DEFAULT_PORTAL_REQUEST_TIMEOUT_MS = 15_000
export const MAX_PORTAL_REQUEST_TIMEOUT_MS = 60_000

export class PortalApiConfigurationError extends Error {
  constructor(message = PORTAL_API_CONFIG_ERROR_MESSAGE) {
    super(message)
    this.name = 'PortalApiConfigurationError'
  }
}

/** Caller cancellation and a finite deadline cover the whole transport operation. */
export interface PortalRequestOptions {
  signal?: AbortSignal
  /** Defaults to 15 seconds. Must be positive and no more than 60 seconds. */
  timeoutMs?: number
}

export interface PortalGetFetchOptions {
  signal?: AbortSignal
  /** Portal calls never retry implicitly, including non-idempotent POSTs. */
  retry?: 0
}

export interface PortalFetchOptions<TBody> extends PortalGetFetchOptions {
  method: 'POST'
  body: TBody
}

/** Existing body-specific injected fetchers remain compatible. */
export type PortalFetcher<TBody> = <TResponse>(
  request: string,
  options: PortalFetchOptions<TBody>
) => Promise<TResponse>

/** The optional second argument keeps existing one-argument lookup fetchers valid. */
export type PortalGetFetcher = <TResponse>(request: string, options?: PortalGetFetchOptions) => Promise<TResponse>

export interface PortalSubmitOptions<TBody> extends PortalRequestOptions {
  portalApiBaseUrl: string
  fetcher: PortalFetcher<TBody>
}

export type PortalRequestFailure = 'network' | 'aborted' | 'timeout'

const PORTAL_REQUEST_MESSAGES: Record<PortalRequestFailure, string> = {
  network: 'We could not confirm whether your request was received. Check your connection before submitting again.',
  aborted: 'The request was interrupted. We could not confirm whether it was received. Check before submitting again.',
  timeout: 'The request timed out. We could not confirm whether it was received. Check before submitting again.'
}

/** Cancellation or a deadline stops waiting; it cannot undo an accepted server submission. */
export class PortalRequestError extends Error {
  constructor(public readonly kind: PortalRequestFailure, cause?: unknown) {
    super(PORTAL_REQUEST_MESSAGES[kind], { cause })
    this.name = 'PortalRequestError'
  }
}

const isAbortError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false
  return ('name' in error && error.name === 'AbortError')
    || ('cause' in error && error.cause !== error && isAbortError(error.cause))
}

/**
 * Owns one deadline, one caller listener and one attempt, even if an injected
 * fetcher ignores AbortSignal. The losing promise stays observed after we stop
 * waiting. HTTP errors retain their status/message for existing domain callers.
 */
const runPortalRequest = async <TResponse>(
  perform: (signal: AbortSignal) => Promise<TResponse>,
  options: PortalRequestOptions
): Promise<TResponse> => {
  const timeoutMs = options.timeoutMs ?? DEFAULT_PORTAL_REQUEST_TIMEOUT_MS
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > MAX_PORTAL_REQUEST_TIMEOUT_MS) {
    throw new PortalApiConfigurationError('Portal API timeout must be a positive number no greater than 60000 milliseconds.')
  }
  if (options.signal?.aborted) throw new PortalRequestError('aborted', options.signal.reason)

  const controller = new AbortController()
  let cancellation: PortalRequestError | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let onAbort: (() => void) | undefined
  const interrupted = new Promise<never>((_resolve, reject) => {
    const cancel = (kind: 'aborted' | 'timeout', cause?: unknown) => {
      if (cancellation) return
      cancellation = new PortalRequestError(kind, cause)
      controller.abort(cancellation)
      reject(cancellation)
    }
    onAbort = () => cancel('aborted', options.signal?.reason)
    options.signal?.addEventListener('abort', onAbort, { once: true })
    timer = setTimeout(() => cancel('timeout'), timeoutMs)
  })

  try {
    return await Promise.race([
      Promise.resolve().then(() => {
        if (cancellation) throw cancellation
        return perform(controller.signal)
      }),
      interrupted
    ])
  } catch (error) {
    if (cancellation) throw cancellation
    if (error instanceof PortalRequestError || getPortalErrorStatusCode(error) !== null) throw error
    throw new PortalRequestError(isAbortError(error) ? 'aborted' : 'network', error)
  } finally {
    clearTimeout(timer)
    if (onAbort) options.signal?.removeEventListener('abort', onAbort)
  }
}

/** Shared GET boundary, using the same injectable contract as POST services. */
export const fetchFromPortal = <TResponse>(
  request: string,
  options: PortalRequestOptions & { fetcher: PortalGetFetcher }
): Promise<TResponse> => runPortalRequest(
  signal => options.fetcher<TResponse>(request, { signal, retry: 0 }),
  options
)

/** Nuxt adapter only: services own deadlines and cancellation, including injected fetchers. */
export const websitePortalFetcher = async <TResponse>(
  request: string,
  options?: PortalFetchOptions<unknown> | PortalGetFetchOptions
): Promise<TResponse> => {
  options?.signal?.throwIfAborted()
  if (!options || !('body' in options)) return await $fetch(request, { ...options, retry: 0 }) as TResponse
  const endpoint = new URL(request).pathname
  const prepared = await prepareWebsiteMarketingSubmission(endpoint, options.body)
  // Preparing attribution can be asynchronous. Never start a POST after its deadline/cancellation.
  options.signal?.throwIfAborted()
  const response: unknown = await $fetch(request, { ...options, retry: 0, body: prepared.body as Record<string, unknown> })
  if (response && typeof response === 'object' && 'ok' in response && response.ok === true) prepared.complete()
  return response as TResponse
}

export const isPortalApiConfigurationError = (error: unknown): error is PortalApiConfigurationError => {
  return error instanceof PortalApiConfigurationError
}

/**
 * Reads an HTTP status from Nuxt/fetch failures without assuming an error
 * shape for network or native failures.
 */
export const getPortalErrorStatusCode = (error: unknown): number | null => {
  if (typeof error !== 'object' || error === null || !('statusCode' in error)) {
    return null
  }

  const { statusCode } = error as { statusCode?: unknown }

  return typeof statusCode === 'number' ? statusCode : null
}

export interface PortalRouteErrorOptions {
  fallbackStatusCode: number
  unavailableStatusMessage: string
}

export interface PortalRouteErrorDetails {
  statusCode: number
  statusMessage?: string
}

/**
 * Converts a portal lookup failure into route-safe status details. A 404 is
 * reserved for portal-confirmed missing resources; configuration, network,
 * malformed-payload, and other upstream failures retain their own status or
 * use the caller's gateway fallback and message.
 */
export const getPortalRouteErrorDetails = (
  error: unknown,
  options: PortalRouteErrorOptions
): PortalRouteErrorDetails => {
  if (isPortalApiConfigurationError(error)) {
    return {
      statusCode: 500,
      statusMessage: options.unavailableStatusMessage
    }
  }

  const statusCode = getPortalErrorStatusCode(error)

  if (statusCode === 404) {
    return { statusCode }
  }

  if (statusCode !== null && statusCode >= 400) {
    return {
      statusCode,
      statusMessage: options.unavailableStatusMessage
    }
  }

  return {
    statusCode: options.fallbackStatusCode,
    statusMessage: options.unavailableStatusMessage
  }
}

/** Only an HTTP(S) origin is accepted; endpoint paths are owned by services. */
export const normalizePortalApiBaseUrl = (portalApiBaseUrl: string): string => {
  const value = String(portalApiBaseUrl || '').trim()
  if (!value) throw new PortalApiConfigurationError()

  try {
    const parsedUrl = new URL(value)
    // Inspect the supplied suffix too: URL parsing erases empty ?/#, dot paths,
    // backslashes and empty credentials, which must not conceal invalid config.
    const originOnly = /^https?:\/\/[^/\\?#@]+\/?$/i.test(value)
    if (!originOnly || !['http:', 'https:'].includes(parsedUrl.protocol)
      || parsedUrl.username || parsedUrl.password || parsedUrl.pathname !== '/'
      || parsedUrl.search || parsedUrl.hash) {
      throw new PortalApiConfigurationError(
        'Portal API base URL must be an http or https origin, without a path, query, fragment, or credentials. Set NUXT_PUBLIC_PORTAL_API_BASE_URL to an origin such as https://portal.example.com.'
      )
    }
    return parsedUrl.origin
  } catch (error) {
    if (isPortalApiConfigurationError(error)) throw error
    throw new PortalApiConfigurationError(
      'Portal API base URL is invalid. Set NUXT_PUBLIC_PORTAL_API_BASE_URL to an http or https origin such as https://portal.example.com.'
    )
  }
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
 * Success parser for application endpoints whose response carries an
 * `applicationId`.
 */
export const parsePortalApplicationIdSuccess = <TSuccess extends { applicationId: string }>(
  response: object
): TSuccess | null => {
  return 'applicationId' in response && isNonEmptyString(response.applicationId)
    ? response as TSuccess
    : null
}

/** Shared portal endpoint for contact messages and webinar registrations. */
export const PORTAL_CONTACT_SUBMISSIONS_ENDPOINT = '/api/contact-submissions'

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
 * HTTP and configuration errors retain their contract. Transport failures are
 * classified without claiming the server rejected or canceled a submission.
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

  const response: unknown = await runPortalRequest(
    signal => options.fetcher<unknown>(
      `${portalApiBaseUrl}${options.endpoint}`,
      { method: 'POST', body: options.payload, signal, retry: 0 }
    ),
    options
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
