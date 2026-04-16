import { solagreeQuizQuestionIds, solagreeQuizQuestionMap, solagreeQuizQuestions } from '~/data/quiz-schema'
import type { QuizAnswerMap, QuizQuestionDefinition, QuizQuestionId, QuizQuestionValue } from '~/data/quiz-types'

export function isQuizQuestionVisible(
  question: QuizQuestionDefinition,
  answers: Readonly<QuizAnswerMap>
): boolean {
  return question.isVisible ? question.isVisible(answers) : true
}

export function getVisibleQuizQuestions(
  answers: Readonly<QuizAnswerMap>
): readonly QuizQuestionDefinition[] {
  return solagreeQuizQuestions.filter(question => isQuizQuestionVisible(question, answers))
}

export function getVisibleQuizQuestionIds(
  answers: Readonly<QuizAnswerMap>
): readonly QuizQuestionId[] {
  return getVisibleQuizQuestions(answers).map(question => question.id)
}

export function isQuizAnswerPresent(
  questionId: QuizQuestionId,
  value: QuizQuestionValue | undefined
): boolean {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (questionId === 'state') {
    return typeof value === 'string' && value.length > 0
  }

  return typeof value === 'string' && value.length > 0
}

export function pruneHiddenQuizAnswers(
  answers: Readonly<QuizAnswerMap>
): QuizAnswerMap {
  let nextAnswers: QuizAnswerMap = { ...answers }
  let previousSerialized = ''

  while (previousSerialized !== JSON.stringify(nextAnswers)) {
    previousSerialized = JSON.stringify(nextAnswers)
    const visibleQuestionIds = new Set(getVisibleQuizQuestionIds(nextAnswers))

    nextAnswers = solagreeQuizQuestionIds.reduce<QuizAnswerMap>((prunedAnswers, questionId) => {
      if (!visibleQuestionIds.has(questionId)) {
        return prunedAnswers
      }

      const value = nextAnswers[questionId]
      if (value === undefined) {
        return prunedAnswers
      }

      if (Array.isArray(value) && value.length === 0) {
        return prunedAnswers
      }

      prunedAnswers[questionId] = value as never
      return prunedAnswers
    }, {})
  }

  return nextAnswers
}

export function coerceQuizCurrentQuestionId(
  answers: Readonly<QuizAnswerMap>,
  currentQuestionId?: QuizQuestionId
): QuizQuestionId {
  const visibleQuestionIds = getVisibleQuizQuestionIds(answers)

  if (currentQuestionId && visibleQuestionIds.includes(currentQuestionId)) {
    return currentQuestionId
  }

  return visibleQuestionIds[0] ?? solagreeQuizQuestionIds[0]
}

export function getNextQuizQuestionId(
  currentQuestionId: QuizQuestionId,
  answers: Readonly<QuizAnswerMap>
): QuizQuestionId | null {
  const visibleQuestionIds = getVisibleQuizQuestionIds(answers)
  const currentIndex = visibleQuestionIds.indexOf(currentQuestionId)

  if (currentIndex === -1) {
    return visibleQuestionIds[0] ?? null
  }

  return visibleQuestionIds[currentIndex + 1] ?? null
}

export function getPreviousQuizQuestionId(
  currentQuestionId: QuizQuestionId,
  answers: Readonly<QuizAnswerMap>
): QuizQuestionId | null {
  const visibleQuestionIds = getVisibleQuizQuestionIds(answers)
  const currentIndex = visibleQuestionIds.indexOf(currentQuestionId)

  if (currentIndex <= 0) {
    return null
  }

  return visibleQuestionIds[currentIndex - 1] ?? null
}

export function getQuizProgressValue(
  currentQuestionId: QuizQuestionId,
  answers: Readonly<QuizAnswerMap>,
  phase: 'question' | 'result'
): number {
  const visibleQuestionIds = getVisibleQuizQuestionIds(answers)

  if (!visibleQuestionIds.length) {
    return 0
  }

  if (phase === 'result') {
    return 100
  }

  const currentIndex = visibleQuestionIds.indexOf(currentQuestionId)
  const normalizedIndex = currentIndex === -1 ? 0 : currentIndex

  return Math.round(((normalizedIndex + 1) / visibleQuestionIds.length) * 100)
}

export function getQuizQuestionById(questionId: QuizQuestionId) {
  return solagreeQuizQuestionMap[questionId]
}
