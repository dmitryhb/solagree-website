import { solagreeQuizStorageKey } from '~/data/quiz'
import { solagreeQuizQuestionMap } from '~/data/quiz-schema'
import type {
  QuizQuestionId,
  QuizQuestionValue
} from '~/data/quiz-types'
import type { ConsultRequestQuizAnswer } from '#shared/types/consult-request'
import {
  getVisibleQuizQuestionIds,
  parseQuizSessionSnapshot
} from '~/utils/quiz-navigation'

function getAnswerLabels(questionId: QuizQuestionId, value: QuizQuestionValue | undefined): string[] {
  const question = solagreeQuizQuestionMap[questionId]
  const values = Array.isArray(value) ? value : value ? [value] : []

  return values.flatMap(answerValue => {
    const label = question.options.find(option => option.id === answerValue)?.label
    return label ? [label] : []
  })
}

/**
 * Builds the consult request answer list from a supported, schema-valid quiz session.
 */
export function getConsultQuizAnswersFromSnapshot(value: unknown): ConsultRequestQuizAnswer[] {
  const snapshot = parseQuizSessionSnapshot(value)

  if (!snapshot) {
    return []
  }

  const answers = snapshot.answers

  return getVisibleQuizQuestionIds(answers).flatMap((questionId) => {
    const answerValue = answers[questionId]
    const answerLabels = getAnswerLabels(questionId, answerValue)

    if (!answerValue || answerLabels.length === 0) {
      return []
    }

    const question = solagreeQuizQuestionMap[questionId]

    return [{
      questionId,
      question: question.title,
      value: Array.isArray(answerValue) ? [...answerValue] : answerValue,
      answerLabels
    }]
  })
}

/**
 * Reads the persisted quiz session and builds a safe answer snapshot for consult request submission.
 */
export function getStoredConsultQuizAnswers(
  storage?: Pick<Storage, 'getItem'> | null
): ConsultRequestQuizAnswer[] {
  let snapshotStorage = storage

  if (snapshotStorage === undefined) {
    if (!import.meta.client) {
      return []
    }

    try {
      snapshotStorage = window.localStorage
    } catch {
      return []
    }
  }

  if (!snapshotStorage) {
    return []
  }

  try {
    const snapshotText = snapshotStorage.getItem(solagreeQuizStorageKey)

    if (!snapshotText) {
      return []
    }

    return getConsultQuizAnswersFromSnapshot(JSON.parse(snapshotText) as unknown)
  } catch {
    return []
  }
}
