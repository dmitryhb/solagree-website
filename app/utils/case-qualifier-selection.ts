import { solagreeCaseQualifierCriterionIds } from '~/data/case-qualifier-schema'
import type { CaseQualifierCriterionId } from '~/data/case-qualifier-types'

const caseQualifierCriterionIdSet = new Set<string>(solagreeCaseQualifierCriterionIds)

/** Narrows unknown input to an approved, stable criterion identifier. */
export const isCaseQualifierCriterionId = (value: unknown): value is CaseQualifierCriterionId => {
  return typeof value === 'string' && caseQualifierCriterionIdSet.has(value)
}

/** Returns a de-duplicated schema-ordered selection containing only current IDs. */
export const normalizeCaseQualifierCriterionIds = (value: unknown): CaseQualifierCriterionId[] => {
  if (!Array.isArray(value)) {
    return []
  }

  const selectedIds = new Set(value.filter(isCaseQualifierCriterionId))
  return solagreeCaseQualifierCriterionIds.filter(criterionId => selectedIds.has(criterionId))
}

/** Applies one checkbox change while preserving schema order and uniqueness. */
export const toggleCaseQualifierCriterionSelection = (
  selectedCriterionIds: readonly CaseQualifierCriterionId[],
  criterionId: CaseQualifierCriterionId,
  selected: boolean
): CaseQualifierCriterionId[] => {
  const nextIds = new Set(selectedCriterionIds)

  if (selected) {
    nextIds.add(criterionId)
  } else {
    nextIds.delete(criterionId)
  }

  return solagreeCaseQualifierCriterionIds.filter(id => nextIds.has(id))
}
