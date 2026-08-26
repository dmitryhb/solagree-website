import { solagreeQuizSchemaVersion } from '~/data/quiz'
import type { QuizPersistedSession } from '~/data/quiz-types'
import { isQuizCriterionId, normalizeQuizCriterionIds } from '~/utils/quiz-selection'

/** Parses only current-schema snapshots so stale or malformed state cannot enter the session. */
export const parseQuizSessionSnapshot = (value: unknown): QuizPersistedSession | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const snapshot = value as {
    version?: unknown
    selectedCriterionIds?: unknown
  }

  if (
    snapshot.version !== solagreeQuizSchemaVersion
    || !Array.isArray(snapshot.selectedCriterionIds)
    || !snapshot.selectedCriterionIds.every(isQuizCriterionId)
  ) {
    return null
  }

  const normalizedIds = normalizeQuizCriterionIds(snapshot.selectedCriterionIds)

  if (normalizedIds.length !== snapshot.selectedCriterionIds.length) {
    return null
  }

  return {
    version: solagreeQuizSchemaVersion,
    selectedCriterionIds: normalizedIds
  }
}
