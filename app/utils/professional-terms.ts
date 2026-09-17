import { getPortalErrorStatusCode } from '~/services/portal-api'

/** A stale response refreshes the displayed document and clears the prior checkbox acknowledgment. */
export const refreshTermsAfterVersionConflict = async (
  error: unknown,
  refresh: (() => Promise<void>) | undefined,
  clearAcknowledgment: () => void
): Promise<void> => {
  if (getPortalErrorStatusCode(error) !== 409) return

  try {
    await refresh?.()
  } finally {
    clearAcknowledgment()
  }
}
