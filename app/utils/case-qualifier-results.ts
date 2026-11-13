import {
  solagreeCaseQualifierCriterionWeightMap,
  solagreeCaseQualifierTotalWeight
} from '~/data/case-qualifier-schema'
import { solagreeCaseQualifierResultContent } from '~/data/case-qualifier-results'
import type {
  CaseQualifierCriterionId,
  CaseQualifierEvaluation,
  CaseQualifierOutcomeId,
  CaseQualifierResultViewModel
} from '~/data/case-qualifier-types'

/** Resolves the approved assessment tier for a weighted score. */
export const getCaseQualifierOutcome = (score: number): CaseQualifierOutcomeId | null => {
  if (!Number.isInteger(score) || score <= 0 || score > solagreeCaseQualifierTotalWeight) {
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
export const evaluateCaseQualifierAnswers = (
  selectedCriterionIds: readonly CaseQualifierCriterionId[]
): CaseQualifierEvaluation => {
  const score = selectedCriterionIds.reduce(
    (total, criterionId) => total + (solagreeCaseQualifierCriterionWeightMap[criterionId] ?? 0),
    0
  )

  return {
    score,
    outcome: getCaseQualifierOutcome(score)
  }
}

/** Returns the exact approved result copy for a non-zero assessment. */
export const getCaseQualifierResultViewModel = (score: number): CaseQualifierResultViewModel | null => {
  const outcome = getCaseQualifierOutcome(score)

  if (!outcome) {
    return null
  }

  const result = solagreeCaseQualifierResultContent[outcome]

  return {
    ...result,
    primaryCta: {
      ...result.primaryCta
    }
  }
}

/** Converts the weighted score into bounded progress for host analytics. */
export const getCaseQualifierProgressValue = (score: number): number => {
  const boundedScore = Math.min(Math.max(score, 0), solagreeCaseQualifierTotalWeight)
  return Math.round((boundedScore / solagreeCaseQualifierTotalWeight) * 100)
}
