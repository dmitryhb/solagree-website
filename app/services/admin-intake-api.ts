import {
  getPortalSubmissionErrorMessage,
  isNonEmptyString,
  normalizePortalApiBaseUrl,
  submitToPortal
} from '~/services/portal-api'
import type { PortalFetcher, PortalSubmitOptions } from '~/services/portal-api'
import type {
  AdminIntakeFormState,
  AdminIntakeSubmissionPayload
} from '~/types/admin-intake'

const ADMIN_INTAKES_ENDPOINT_PREFIX = '/api/public/admin-intakes'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not submit your intake form. Please try again.'

/** Fetch implementation used by the admin intake service. */
export type AdminIntakeFetcher = PortalFetcher<AdminIntakeSubmissionPayload>

/**
 * Dependencies required to submit an admin intake form.
 */
export interface SubmitAdminIntakeOptions extends PortalSubmitOptions<AdminIntakeSubmissionPayload> {
  /** Optional source URL for operational attribution. */
  sourceUrl?: string | null
}

/**
 * Dependencies required to verify an admin intake slug.
 */
export interface VerifyAdminIntakeSlugOptions {
  portalApiBaseUrl: string
  fetcher: <TResponse>(request: string) => Promise<TResponse>
}

/**
 * Converts Nuxt/fetch/native errors into an admin-intake submission message.
 */
export const getAdminIntakeSubmissionErrorMessage = (error: unknown): string => {
  return getPortalSubmissionErrorMessage(error, DEFAULT_SUBMISSION_ERROR_MESSAGE)
}

/**
 * Creates the portal API payload from validated client form state.
 */
export const createAdminIntakeSubmissionPayload = (
  form: AdminIntakeFormState,
  options: Pick<SubmitAdminIntakeOptions, 'sourceUrl'> = {}
): AdminIntakeSubmissionPayload => {
  return {
    primaryFirstName: form.primaryFirstName.trim(),
    primaryLastName: form.primaryLastName.trim(),
    primaryEmail: form.primaryEmail.trim(),
    spouseFirstName: form.spouseFirstName.trim(),
    spouseLastName: form.spouseLastName.trim(),
    spouseEmail: form.spouseEmail.trim(),
    privacyPreference: form.privacyPreference,
    sourceUrl: options.sourceUrl?.trim() || null
  }
}

/**
 * Outcome of verifying an admin intake slug against the portal.
 *
 * - `verified`: the portal confirmed the slug with `{ ok: true }`.
 * - `missing`: the portal explicitly responded with a 404.
 * - `invalid-response`: the portal returned a successful response whose
 *   payload does not satisfy the documented verification shape.
 */
export type AdminIntakeSlugVerification =
  | { status: 'verified' }
  | { status: 'missing' }
  | { status: 'invalid-response' }

/**
 * Guards portal fetch errors that confirm a slug does not exist.
 */
const isPortalSlugNotFound = (error: unknown): boolean => {
  return (
    typeof error === 'object'
    && error !== null
    && 'statusCode' in error
    && error.statusCode === 404
  )
}

/**
 * Verifies that an admin intake slug exists on the portal.
 *
 * Returns a typed outcome: `verified` for `{ ok: true }` responses, `missing`
 * when the portal confirms the slug does not exist with a 404, and
 * `invalid-response` when a successful response is malformed. Unexpected
 * network, server, timeout, or configuration errors are rethrown so callers
 * can distinguish upstream failures from a missing slug.
 */
export const verifyAdminIntakeSlug = async (
  slug: string,
  options: VerifyAdminIntakeSlugOptions
): Promise<AdminIntakeSlugVerification> => {
  const portalApiBaseUrl = normalizePortalApiBaseUrl(options.portalApiBaseUrl)
  const endpoint = `${portalApiBaseUrl}${ADMIN_INTAKES_ENDPOINT_PREFIX}/${encodeURIComponent(slug)}`

  try {
    const response = await options.fetcher<{ ok?: unknown }>(endpoint)

    if (typeof response === 'object' && response !== null && 'ok' in response && response.ok === true) {
      return { status: 'verified' }
    }

    return { status: 'invalid-response' }
  } catch (error) {
    if (isPortalSlugNotFound(error)) {
      return { status: 'missing' }
    }

    throw error
  }
}

/**
 * Runtime parser for the admin intake success response.
 *
 * Requires a non-empty string `submissionId` and preserves the public
 * `{ submissionId }` return shape exactly.
 */
const parseAdminIntakeSuccess = (response: object): { submissionId: string } | null => {
  return 'submissionId' in response && isNonEmptyString(response.submissionId)
    ? { submissionId: response.submissionId }
    : null
}

/**
 * Submits an admin intake form to the portal API and returns the submission ID.
 *
 * @throws Error when the portal returns a request-level error response.
 */
export const submitAdminIntake = async (
  form: AdminIntakeFormState,
  slug: string,
  options: SubmitAdminIntakeOptions
): Promise<{ submissionId: string }> => {
  return await submitToPortal({
    portalApiBaseUrl: options.portalApiBaseUrl,
    fetcher: options.fetcher,
    endpoint: `${ADMIN_INTAKES_ENDPOINT_PREFIX}/${encodeURIComponent(slug)}`,
    payload: createAdminIntakeSubmissionPayload(form, options),
    parseSuccess: parseAdminIntakeSuccess,
    fallbackMessage: DEFAULT_SUBMISSION_ERROR_MESSAGE
  })
}
