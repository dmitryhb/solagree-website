import { describe, expect, it } from 'vitest'
import { solagreeQuizCriterionIds } from '../app/data/quiz-schema'
import {
  normalizeQuizCriterionIds,
  toggleQuizCriterionSelection
} from '../app/utils/quiz-selection'
import { parseQuizSessionSnapshot } from '../app/utils/quiz-session'

describe('case qualifier session safety', () => {
  it('rejects stale v1 and v2 snapshots', () => {
    expect(parseQuizSessionSnapshot({
      version: 1,
      phase: 'question',
      answers: { state: 'NY' }
    })).toBeNull()
    expect(parseQuizSessionSnapshot({
      version: 2,
      selectedCriterionIds: ['simple-estate']
    })).toBeNull()
  })

  it('restores a valid v3 snapshot in schema order', () => {
    expect(parseQuizSessionSnapshot({
      version: 3,
      selectedCriterionIds: ['court-avoidance', 'simple-estate']
    })).toEqual({
      version: 3,
      selectedCriterionIds: ['simple-estate', 'court-avoidance']
    })
  })

  it('rejects unknown and duplicated criterion IDs', () => {
    expect(parseQuizSessionSnapshot({
      version: 3,
      selectedCriterionIds: ['simple-estate', 'legacy-answer']
    })).toBeNull()
    expect(parseQuizSessionSnapshot({
      version: 3,
      selectedCriterionIds: ['simple-estate', 'simple-estate']
    })).toBeNull()
  })

  it('normalizes arbitrary selection input and applies checkbox changes deterministically', () => {
    expect(normalizeQuizCriterionIds([
      'court-avoidance',
      'unknown',
      'simple-estate',
      'court-avoidance'
    ])).toEqual(['simple-estate', 'court-avoidance'])

    const selected = toggleQuizCriterionSelection([], solagreeQuizCriterionIds[2], true)
    expect(selected).toEqual(['financial-transparency'])
    expect(toggleQuizCriterionSelection(selected, solagreeQuizCriterionIds[2], false)).toEqual([])
  })
})
