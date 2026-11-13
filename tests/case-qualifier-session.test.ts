import { describe, expect, it } from 'vitest'
import {
  normalizeCaseQualifierCriterionIds,
  toggleCaseQualifierCriterionSelection
} from '../app/utils/case-qualifier-selection'
import { parseCaseQualifierSessionSnapshot } from '../app/utils/case-qualifier-session'

describe('case qualifier session safety', () => {
  it('accepts only the current v1 schema', () => {
    expect(parseCaseQualifierSessionSnapshot({
      version: 1,
      selectedCriterionIds: ['court-avoidance', 'simple-estate']
    })).toEqual({
      version: 1,
      selectedCriterionIds: ['simple-estate', 'court-avoidance']
    })

    expect(parseCaseQualifierSessionSnapshot({
      version: 3,
      selectedCriterionIds: ['simple-estate']
    })).toBeNull()
  })

  it('rejects unknown and duplicated criterion IDs', () => {
    expect(parseCaseQualifierSessionSnapshot({
      version: 1,
      selectedCriterionIds: ['simple-estate', 'legacy-answer']
    })).toBeNull()
    expect(parseCaseQualifierSessionSnapshot({
      version: 1,
      selectedCriterionIds: ['simple-estate', 'simple-estate']
    })).toBeNull()
  })

  it('maps legacy criterion IDs to the renamed criteria instead of dropping the selection', () => {
    expect(parseCaseQualifierSessionSnapshot({
      version: 1,
      selectedCriterionIds: ['integrity-deficit', 'willing-participants', 'simple-estate']
    })).toEqual({
      version: 1,
      selectedCriterionIds: ['cost-limitations', 'simple-estate', 'spouse-participation-potential']
    })
  })

  it('still rejects a snapshot that selects a renamed criterion under both its old and new ID', () => {
    expect(parseCaseQualifierSessionSnapshot({
      version: 1,
      selectedCriterionIds: ['integrity-deficit', 'cost-limitations']
    })).toBeNull()
  })

  it('normalizes input and applies checkbox changes deterministically', () => {
    expect(normalizeCaseQualifierCriterionIds([
      'court-avoidance',
      'unknown',
      'simple-estate',
      'court-avoidance'
    ])).toEqual(['simple-estate', 'court-avoidance'])

    const selected = toggleCaseQualifierCriterionSelection([], 'financial-transparency', true)
    expect(selected).toEqual(['financial-transparency'])
    expect(toggleCaseQualifierCriterionSelection(selected, 'financial-transparency', false)).toEqual([])
  })
})
