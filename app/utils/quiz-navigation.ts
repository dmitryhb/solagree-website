import { solagreeQuizQuestionIds, solagreeQuizQuestionMap, solagreeQuizQuestions } from '~/data/quiz-schema'
import type { QuizAnswerMap, QuizQuestionDefinition, QuizQuestionId, QuizQuestionValue } from '~/data/quiz-types'

/**
 * Resolves conditional visibility for a quiz question against current answers.
 */
export const isQuizQuestionVisible = (
  question: QuizQuestionDefinition,
  answers: Readonly<QuizAnswerMap>
): boolean => {
  return question.isVisible ? question.isVisible(answers) : true
}

/**
 * Returns the currently reachable quiz questions in schema order.
 */
export const getVisibleQuizQuestions = (
  answers: Readonly<QuizAnswerMap>
): readonly QuizQuestionDefinition[] => {
  return solagreeQuizQuestions.filter(question => isQuizQuestionVisible(question, answers))
}

/**
 * Returns IDs for the currently reachable quiz questions.
 */
export const getVisibleQuizQuestionIds = (
  answers: Readonly<QuizAnswerMap>
): readonly QuizQuestionId[] => {
  return getVisibleQuizQuestions(answers).map(question => question.id)
}

/**
 * Checks whether an answer value satisfies the minimum completeness rule.
 */
export const isQuizAnswerPresent = (
  questionId: QuizQuestionId,
  value: QuizQuestionValue | undefined
): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (questionId === 'state') {
    return typeof value === 'string' && value.length > 0
  }

  return typeof value === 'string' && value.length > 0
}

/**
 * Removes answers for questions hidden by the current branching path.
 */
export const pruneHiddenQuizAnswers = (
  answers: Readonly<QuizAnswerMap>
): QuizAnswerMap => {
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

/**
 * Ensures the active question is visible, falling back to the first visible question.
 */
export const coerceQuizCurrentQuestionId = (
  answers: Readonly<QuizAnswerMap>,
  currentQuestionId?: QuizQuestionId
): QuizQuestionId => {
  const visibleQuestionIds = getVisibleQuizQuestionIds(answers)

  if (currentQuestionId && visibleQuestionIds.includes(currentQuestionId)) {
    return currentQuestionId
  }

  return visibleQuestionIds[0] ?? solagreeQuizQuestionIds[0] ?? 'state'
}

/**
 * Finds the next visible question after the current question.
 */
export const getNextQuizQuestionId = (
  currentQuestionId: QuizQuestionId,
  answers: Readonly<QuizAnswerMap>
): QuizQuestionId | null => {
  const visibleQuestionIds = getVisibleQuizQuestionIds(answers)
  const currentIndex = visibleQuestionIds.indexOf(currentQuestionId)

  if (currentIndex === -1) {
    return visibleQuestionIds[0] ?? null
  }

  return visibleQuestionIds[currentIndex + 1] ?? null
}

/**
 * Finds the previous visible question before the current question.
 */
export const getPreviousQuizQuestionId = (
  currentQuestionId: QuizQuestionId,
  answers: Readonly<QuizAnswerMap>
): QuizQuestionId | null => {
  const visibleQuestionIds = getVisibleQuizQuestionIds(answers)
  const currentIndex = visibleQuestionIds.indexOf(currentQuestionId)

  if (currentIndex <= 0) {
    return null
  }

  return visibleQuestionIds[currentIndex - 1] ?? null
}

/**
 * Calculates the current visible-branch progress percentage.
 */
export const getQuizProgressValue = (
  currentQuestionId: QuizQuestionId,
  answers: Readonly<QuizAnswerMap>,
  phase: 'question' | 'result'
): number => {
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

/**
 * Looks up a quiz question by ID.
 */
export const getQuizQuestionById = (questionId: QuizQuestionId) => {
  return solagreeQuizQuestionMap[questionId]
}
