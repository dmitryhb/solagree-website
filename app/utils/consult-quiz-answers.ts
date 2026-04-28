import { solagreeQuizStorageKey } from '~/data/quiz'
import { solagreeQuizQuestionMap } from '~/data/quiz-schema'
import type {
  QuizAnswerMap,
  QuizQuestionId,
  QuizQuestionValue
} from '~/data/quiz-types'
import type { ConsultRequestQuizAnswer } from '~/types/consult-request'
import {
  getVisibleQuizQuestionIds,
  pruneHiddenQuizAnswers
} from '~/utils/quiz-navigation'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isQuizSessionSnapshot(value: unknown): value is { answers: Record<string, unknown> } {
  return isRecord(value) && isRecord(value.answers)
}

function normalizeQuizAnswerMap(value: Record<string, unknown>): QuizAnswerMap {
  const answers: Partial<Record<QuizQuestionId, QuizQuestionValue>> = {}

  Object.entries(value).forEach(([questionId, answer]) => {
    if (!(questionId in solagreeQuizQuestionMap)) {
      return
    }

    const typedQuestionId = questionId as QuizQuestionId

    if (typeof answer === 'string') {
      answers[typedQuestionId] = answer as QuizQuestionValue
      return
    }

    if (Array.isArray(answer) && answer.every(item => typeof item === 'string')) {
      answers[typedQuestionId] = answer as QuizQuestionValue
    }
  })

  return answers as QuizAnswerMap
}

function getAnswerLabels(questionId: QuizQuestionId, value: QuizQuestionValue | undefined): string[] {
  const question = solagreeQuizQuestionMap[questionId]
  const values = Array.isArray(value) ? value : value ? [value] : []

  return values.map(answerValue => {
    return question.options.find(option => option.id === answerValue)?.label ?? answerValue
  })
}

/**
 * Reads the persisted quiz session and builds a safe answer snapshot for consult request submission.
 */
export function getStoredConsultQuizAnswers(): ConsultRequestQuizAnswer[] {
  if (!import.meta.client) {
    return []
  }

  const snapshotText = window.localStorage.getItem(solagreeQuizStorageKey)

  if (!snapshotText) {
    return []
  }

  try {
    const snapshot = JSON.parse(snapshotText) as unknown

    if (!isQuizSessionSnapshot(snapshot)) {
      return []
    }

    const answers = pruneHiddenQuizAnswers(normalizeQuizAnswerMap(snapshot.answers))

    return getVisibleQuizQuestionIds(answers).flatMap((questionId) => {
      const value = answers[questionId]
      const answerLabels = getAnswerLabels(questionId, value)

      if (!value || answerLabels.length === 0) {
        return []
      }

      const question = solagreeQuizQuestionMap[questionId]

      return [{
        questionId,
        question: question.title,
        value: Array.isArray(value) ? [...value] : value,
        answerLabels
      }]
    })
  } catch {
    return []
  }
}
