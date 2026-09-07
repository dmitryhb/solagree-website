import { solagreeCaseQualifierSchemaVersion } from '~/data/case-qualifier'
import type { CaseQualifierPersistedSession } from '~/data/case-qualifier-types'
import { isCaseQualifierCriterionId, normalizeCaseQualifierCriterionIds } from '~/utils/case-qualifier-selection'

/** Parses only current-schema snapshots so stale or malformed state cannot enter the session. */
export const parseCaseQualifierSessionSnapshot = (value: unknown): CaseQualifierPersistedSession | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const snapshot = value as {
    version?: unknown
    selectedCriterionIds?: unknown
  }

  if (
    snapshot.version !== solagreeCaseQualifierSchemaVersion
    || !Array.isArray(snapshot.selectedCriterionIds)
    || !snapshot.selectedCriterionIds.every(isCaseQualifierCriterionId)
  ) {
    return null
  }

  const normalizedIds = normalizeCaseQualifierCriterionIds(snapshot.selectedCriterionIds)

  if (normalizedIds.length !== snapshot.selectedCriterionIds.length) {
    return null
  }

  return {
    version: solagreeCaseQualifierSchemaVersion,
    selectedCriterionIds: normalizedIds
  }
}
