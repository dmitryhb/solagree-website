import { describe, expect, it } from 'vitest'

import {
  getConsultQuizAnswersFromSnapshot,
  getStoredConsultQuizAnswers
} from '../app/utils/consult-quiz-answers'

describe('stored consult quiz answers', () => {
  it('includes normalized visible answers from a valid partial v2 session', () => {
    const snapshot = {
      version: 2,
      phase: 'question',
      currentQuestionId: 'children',
      answers: {
        state: 'NC',
        children: 'yes'
      },
      maxProgressValue: 20
    }
    const expectedAnswers = [
      {
        questionId: 'state',
        question: 'Where will your divorce be filed?',
        value: 'NC',
        answerLabels: ['North Carolina']
      },
      {
        questionId: 'children',
        question: 'Do you have children under 21?',
        value: 'yes',
        answerLabels: ['Yes']
      }
    ]

    expect(getConsultQuizAnswersFromSnapshot(snapshot)).toEqual(expectedAnswers)
    expect(getStoredConsultQuizAnswers({
      getItem: () => JSON.stringify(snapshot)
    })).toEqual(expectedAnswers)
  })

  it('includes normalized answers from a valid completed v2 session', () => {
    const snapshot = {
      version: 2,
      phase: 'result',
      currentQuestionId: 'paymentReadiness',
      answers: {
        financialScreener: 'yes',
        financialDetails: ['real-estate', 'debts-assets'],
        paymentReadiness: 'ready-now'
      },
      maxProgressValue: 100
    }

    expect(getConsultQuizAnswersFromSnapshot(snapshot)).toEqual([
      {
        questionId: 'financialScreener',
        question: 'Do you have financial questions about your divorce?',
        value: 'yes',
        answerLabels: ['Yes']
      },
      {
        questionId: 'financialDetails',
        question: 'Which financial topics apply to your situation?',
        value: ['real-estate', 'debts-assets'],
        answerLabels: [
          'A home, real estate, or major property',
          'Debt, asset division, or other complex finances'
        ]
      },
      {
        questionId: 'paymentReadiness',
        question: 'Do you have the ability to pay for a service to help you?',
        value: 'ready-now',
        answerLabels: ['Yes, I am ready now']
      }
    ])
  })

  it('supports v1 complete snapshots while dropping unknown, duplicate, and hidden answers', () => {
    const snapshot = {
      version: 1,
      phase: 'complete',
      currentQuestionId: 'financialDetails',
      answers: {
        state: 'NC',
        children: 'no',
        parentingScreener: 'yes',
        parentingDetails: ['child-support'],
        financialScreener: 'yes',
        financialDetails: ['real-estate', 'free-form answer', 'real-estate'],
        paymentReadiness: 'forward this text',
        unknownQuestion: 'unknown answer'
      }
    }

    expect(getConsultQuizAnswersFromSnapshot(snapshot)).toEqual([
      expect.objectContaining({ questionId: 'state', value: 'NC' }),
      expect.objectContaining({ questionId: 'children', value: 'no' }),
      expect.objectContaining({ questionId: 'financialScreener', value: 'yes' }),
      expect.objectContaining({ questionId: 'financialDetails', value: ['real-estate'] })
    ])
  })

  it.each([
    null,
    { version: 3, phase: 'question', currentQuestionId: 'state', answers: { state: 'NC' } },
    { version: 2, phase: 'unexpected', currentQuestionId: 'state', answers: { state: 'NC' } },
    { version: 2, phase: 'question', currentQuestionId: 'state', answers: [] },
    {
      version: 2,
      phase: 'question',
      currentQuestionId: 'state',
      answers: { state: ['NC'], financialDetails: 'real-estate', children: 42 }
    }
  ])('omits unsupported snapshots and invalid answer types without throwing: %o', snapshot => {
    expect(() => getConsultQuizAnswersFromSnapshot(snapshot)).not.toThrow()
    expect(getConsultQuizAnswersFromSnapshot(snapshot)).toEqual([])
  })

  it('omits malformed JSON and localStorage access failures', () => {
    const malformedStorage = { getItem: () => '{malformed-json' }
    const unavailableStorage = {
      getItem: () => {
        throw new Error('Storage is unavailable')
      }
    }

    expect(() => getStoredConsultQuizAnswers(malformedStorage)).not.toThrow()
    expect(getStoredConsultQuizAnswers(malformedStorage)).toEqual([])
    expect(() => getStoredConsultQuizAnswers(unavailableStorage)).not.toThrow()
    expect(getStoredConsultQuizAnswers(unavailableStorage)).toEqual([])
  })
})
