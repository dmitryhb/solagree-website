import { solagreeCaseQualifierLegacyCriterionIdMap } from '~/data/case-qualifier-schema'
import { solagreeCaseQualifierSchemaVersion } from '~/data/case-qualifier'
import type { CaseQualifierPersistedSession } from '~/data/case-qualifier-types'
import { isCaseQualifierCriterionId, normalizeCaseQualifierCriterionIds } from '~/utils/case-qualifier-selection'

const mapLegacyCriterionIds = (ids: readonly unknown[]): unknown[] => {
  return ids.map(id => (typeof id === 'string' ? solagreeCaseQualifierLegacyCriterionIdMap[id] ?? id : id))
}

/** Parses only current-schema snapshots so stale or malformed state cannot enter the session. */
export const parseCaseQualifierSessionSnapshot = (value: unknown): CaseQualifierPersistedSession | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const snapshot = value as {
    version?: unknown
    selectedCriterionIds?: unknown
  }

  if (snapshot.version !== solagreeCaseQualifierSchemaVersion || !Array.isArray(snapshot.selectedCriterionIds)) {
    return null
  }

  const selectedIds = mapLegacyCriterionIds(snapshot.selectedCriterionIds)

  if (!selectedIds.every(isCaseQualifierCriterionId)) {
    return null
  }

  const normalizedIds = normalizeCaseQualifierCriterionIds(selectedIds)

  if (normalizedIds.length !== selectedIds.length) {
    return null
  }

  return {
    version: solagreeCaseQualifierSchemaVersion,
    selectedCriterionIds: normalizedIds
  }
}
