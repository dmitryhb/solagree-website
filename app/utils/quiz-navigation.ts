import { solagreeQuizQuestionIds, solagreeQuizQuestionMap, solagreeQuizQuestions } from '~/data/quiz-schema'
import type {
  QuizAnswerMap,
  QuizPersistedSession,
  QuizQuestionDefinition,
  QuizQuestionId,
  QuizQuestionValue,
  QuizSessionPhase
} from '~/data/quiz-types'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/** Checks whether a value names a question in the current schema. */
export const isQuizQuestionId = (value: unknown): value is QuizQuestionId => {
  return typeof value === 'string' && value in solagreeQuizQuestionMap
}

/**
 * Keeps only schema-backed answer values. This is shared by persistence
 * consumers so a stale browser snapshot cannot introduce unknown values.
 */
export const normalizeQuizAnswerMap = (value: unknown): QuizAnswerMap => {
  if (!isRecord(value)) {
    return {}
  }

  return solagreeQuizQuestionIds.reduce<QuizAnswerMap>((answers, questionId) => {
    if (!Object.prototype.hasOwnProperty.call(value, questionId)) {
      return answers
    }

    const question = solagreeQuizQuestionMap[questionId]
    const rawValue = value[questionId]
    const optionIds = new Set<string>(question.options.map(option => option.id))

    if (question.kind === 'multi-select') {
      if (!Array.isArray(rawValue)) {
        return answers
      }

      const normalizedValues = [...new Set(rawValue.filter(
        answer => typeof answer === 'string' && optionIds.has(answer)
      ))]

      if (normalizedValues.length > 0) {
        answers[questionId] = normalizedValues as never
      }

      return answers
    }

    if (typeof rawValue === 'string' && optionIds.has(rawValue)) {
      answers[questionId] = rawValue as never
    }

    return answers
  }, {})
}

const normalizeQuizSessionPhase = (value: unknown): QuizSessionPhase | null => {
  if (value === 'complete' || value === 'result') {
    return 'result'
  }

  return value === 'question' ? 'question' : null
}

const normalizeProgressValue = (value: unknown): number | undefined => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined
  }

  return Math.min(Math.max(Math.round(value), 0), 100)
}

/**
 * Parses v1 and v2 persisted sessions into the current v2 shape. Unknown
 * question IDs and answer values are discarded while known legacy state is
 * retained for the active branch.
 */
export const parseQuizSessionSnapshot = (value: unknown): QuizPersistedSession | null => {
  if (!isRecord(value) || (value.version !== 1 && value.version !== 2)) {
    return null
  }

  const phase = normalizeQuizSessionPhase(value.phase)
  if (!phase || !isRecord(value.answers)) {
    return null
  }

  const answers = pruneHiddenQuizAnswers(normalizeQuizAnswerMap(value.answers))

  return {
    version: 2,
    phase,
    currentQuestionId: coerceQuizCurrentQuestionId(
      answers,
      isQuizQuestionId(value.currentQuestionId) ? value.currentQuestionId : undefined
    ),
    answers,
    maxProgressValue: normalizeProgressValue(value.maxProgressValue),
    hasCompletedAttempt: phase === 'result' || value.hasCompletedAttempt === true
  }
}

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
