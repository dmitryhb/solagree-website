import { solagreeQuizCriterionIds } from '~/data/quiz-schema'
import type { QuizCriterionId } from '~/data/quiz-types'

const quizCriterionIdSet = new Set<string>(solagreeQuizCriterionIds)

/** Narrows unknown input to an approved, stable criterion identifier. */
export const isQuizCriterionId = (value: unknown): value is QuizCriterionId => {
  return typeof value === 'string' && quizCriterionIdSet.has(value)
}

/** Returns a de-duplicated schema-ordered selection containing only current IDs. */
export const normalizeQuizCriterionIds = (value: unknown): QuizCriterionId[] => {
  if (!Array.isArray(value)) {
    return []
  }

  const selectedIds = new Set(value.filter(isQuizCriterionId))
  return solagreeQuizCriterionIds.filter(criterionId => selectedIds.has(criterionId))
}

/** Applies one checkbox change while preserving schema order and uniqueness. */
export const toggleQuizCriterionSelection = (
  selectedCriterionIds: readonly QuizCriterionId[],
  criterionId: QuizCriterionId,
  selected: boolean
): QuizCriterionId[] => {
  const nextIds = new Set(selectedCriterionIds)

  if (selected) {
    nextIds.add(criterionId)
  } else {
    nextIds.delete(criterionId)
  }

  return solagreeQuizCriterionIds.filter(id => nextIds.has(id))
}
