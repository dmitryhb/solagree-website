import { describe, expect, it } from 'vitest'
import {
  getVisibleQuizQuestionIds,
  normalizeQuizAnswerMap,
  parseQuizSessionSnapshot
} from '../app/utils/quiz-navigation'
import { evaluateQuizAnswers } from '../app/utils/quiz-results'

describe('quiz navigation and persisted session safety', () => {
  it('normalizes answer types and option IDs without retaining duplicates or arbitrary text', () => {
    expect(normalizeQuizAnswerMap({
      state: 'NC',
      children: ['yes'],
      parentingDetails: ['custody-schedule', 'free-form answer', 'custody-schedule', 7],
      financialDetails: 'real-estate',
      paymentReadiness: 'forward this text',
      unknownQuestion: 'unknown answer'
    })).toEqual({
      state: 'NC',
      parentingDetails: ['custody-schedule']
    })

    expect(normalizeQuizAnswerMap(Object.create({ state: 'NC' }) as unknown)).toEqual({})
  })

  it('keeps visible branches and result outcomes aligned with the documented matrix', () => {
    const hiddenParentingBranch = {
      state: 'NC',
      children: 'no',
      parentingScreener: 'yes',
      parentingDetails: ['child-support'],
      financialScreener: 'no',
      financialDetails: ['real-estate']
    } as const
    const visibleParentingBranch = {
      ...hiddenParentingBranch,
      children: 'yes',
      financialScreener: 'yes'
    } as const

    expect(getVisibleQuizQuestionIds(hiddenParentingBranch)).not.toContain('parentingScreener')
    expect(getVisibleQuizQuestionIds(hiddenParentingBranch)).not.toContain('financialDetails')
    expect(getVisibleQuizQuestionIds(visibleParentingBranch)).toEqual(expect.arrayContaining([
      'parentingScreener',
      'parentingDetails',
      'financialDetails'
    ]))
    expect(evaluateQuizAnswers({ paymentReadiness: 'ready-now' }).outcome).toBe('solagree-fit')
    expect(evaluateQuizAnswers({ paymentReadiness: 'need-payment-plan' }).outcome).toBe('payment-options-consult')
  })

  it('migrates known v1 state while safely removing unknown IDs, values, and hidden answers', () => {
    expect(parseQuizSessionSnapshot({
      version: 1,
      phase: 'complete',
      currentQuestionId: 'financialDetails',
      answers: {
        state: 'NC',
        children: 'no',
        parentingScreener: 'yes',
        financialScreener: 'no',
        financialDetails: ['real-estate', 'legacy-value', 'real-estate'],
        paymentReadiness: 'ready-now',
        legacyQuestion: 'legacy-answer'
      },
      maxProgressValue: 102.4
    })).toEqual({
      version: 2,
      phase: 'result',
      currentQuestionId: 'state',
      answers: {
        state: 'NC',
        children: 'no',
        financialScreener: 'no',
        paymentReadiness: 'ready-now'
      },
      maxProgressValue: 100,
      hasCompletedAttempt: true
    })
  })

  it('preserves optional v2 completion metadata without changing question snapshots', () => {
    const baseSnapshot = {
      version: 2,
      phase: 'question',
      currentQuestionId: 'state',
      answers: { state: 'NC' }
    } as const

    expect(parseQuizSessionSnapshot(baseSnapshot)).toMatchObject({
      version: 2,
      phase: 'question',
      hasCompletedAttempt: false
    })
    expect(parseQuizSessionSnapshot({
      ...baseSnapshot,
      hasCompletedAttempt: true
    })).toMatchObject({
      version: 2,
      phase: 'question',
      hasCompletedAttempt: true
    })
  })

  it.each([
    null,
    { version: 3, phase: 'question', currentQuestionId: 'state', answers: {} },
    { version: 2, phase: 'unexpected', currentQuestionId: 'state', answers: {} },
    { version: 2, phase: 'question', currentQuestionId: 'state', answers: [] }
  ])('rejects malformed or unsupported snapshots: %o', snapshot => {
    expect(parseQuizSessionSnapshot(snapshot)).toBeNull()
  })
})
