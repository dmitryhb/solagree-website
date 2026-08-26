import { solagreeQuizCriterionIds } from '~/data/quiz-schema'
import { solagreeQuizResultContent } from '~/data/quiz-results'
import type {
  QuizCriterionId,
  QuizEvaluation,
  QuizOutcomeId,
  QuizResultViewModel
} from '~/data/quiz-types'

/** Resolves the approved assessment tier for a criterion count. */
export const getQuizOutcome = (score: number): QuizOutcomeId | null => {
  if (!Number.isInteger(score) || score <= 0 || score > solagreeQuizCriterionIds.length) {
    return null
  }

  if (score <= 2) {
    return 'possible-fit'
  }

  if (score <= 5) {
    return 'good-fit'
  }

  return 'ideal-fit'
}

/** Evaluates a normalized selection without using criterion labels or user-entered data. */
export const evaluateQuizAnswers = (
  selectedCriterionIds: readonly QuizCriterionId[]
): QuizEvaluation => {
  const score = selectedCriterionIds.length

  return {
    score,
    outcome: getQuizOutcome(score)
  }
}

/** Returns the exact approved result copy for a non-zero assessment. */
export const getQuizResultViewModel = (score: number): QuizResultViewModel | null => {
  const outcome = getQuizOutcome(score)

  if (!outcome) {
    return null
  }

  const result = solagreeQuizResultContent[outcome]

  return {
    ...result,
    primaryCta: {
      ...result.primaryCta
    }
  }
}

/** Converts selection count into bounded progress for host analytics. */
export const getQuizProgressValue = (score: number): number => {
  const boundedScore = Math.min(Math.max(score, 0), solagreeQuizCriterionIds.length)
  return Math.round((boundedScore / solagreeQuizCriterionIds.length) * 100)
}
