import {
  getPortalSubmissionErrorMessage,
  normalizePortalApiBaseUrl
} from '~/services/portal-api'
import type { PortalFetcher, PortalSubmitOptions } from '~/services/portal-api'
import type {
  AdminIntakeFormState,
  AdminIntakeSubmissionPayload
} from '~/types/admin-intake'

const ADMIN_INTAKES_ENDPOINT_PREFIX = '/api/public/admin-intakes'
const DEFAULT_SUBMISSION_ERROR_MESSAGE = 'We could not submit your intake form. Please try again.'

type AdminIntakeApiResult = { ok: true, submissionId: string } | { error: true, message: string }

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
 * Verifies that an admin intake slug exists on the portal.
 *
 * Returns `true` when the portal responds with `{ ok: true }`, `false` on 404.
 *
 * @throws Error for any unexpected network or server error.
 */
export const verifyAdminIntakeSlug = async (
  slug: string,
  options: VerifyAdminIntakeSlugOptions
): Promise<boolean> => {
  const portalApiBaseUrl = normalizePortalApiBaseUrl(options.portalApiBaseUrl)
  const endpoint = `${portalApiBaseUrl}${ADMIN_INTAKES_ENDPOINT_PREFIX}/${encodeURIComponent(slug)}`

  try {
    const response = await options.fetcher<{ ok?: unknown }>(endpoint)

    return typeof response === 'object' && response !== null && 'ok' in response && response.ok === true
  } catch (error) {
    if (
      typeof error === 'object'
      && error !== null
      && 'statusCode' in error
      && error.statusCode === 404
    ) {
      return false
    }

    throw error
  }
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
  const portalApiBaseUrl = normalizePortalApiBaseUrl(options.portalApiBaseUrl)
  const endpoint = `${portalApiBaseUrl}${ADMIN_INTAKES_ENDPOINT_PREFIX}/${encodeURIComponent(slug)}`

  const response = await options.fetcher<AdminIntakeApiResult>(
    endpoint,
    {
      method: 'POST',
      body: createAdminIntakeSubmissionPayload(form, options)
    }
  )

  if ('error' in response) {
    throw new Error(response.message)
  }

  return { submissionId: response.submissionId }
}
