import { solagreeQuizLabels, solagreeQuizStorageKey } from '~/data/quiz'
import { solagreeQuizQuestionIds } from '~/data/quiz-schema'
import type {
  QuizAnswerMap,
  QuizPersistedSession,
  QuizQuestionId,
  QuizQuestionValue,
  QuizSessionPhase
} from '~/data/quiz-types'
import {
  coerceQuizCurrentQuestionId,
  getNextQuizQuestionId,
  getPreviousQuizQuestionId,
  getQuizProgressValue,
  getQuizQuestionById,
  getVisibleQuizQuestionIds,
  isQuizAnswerPresent,
  pruneHiddenQuizAnswers
} from '~/utils/quiz-navigation'
import { evaluateQuizAnswers, getQuizResultViewModel } from '~/utils/quiz-results'

function isQuizSessionSnapshot(value: unknown): value is QuizPersistedSession {
  if (!value || typeof value !== 'object') {
    return false
  }

  const snapshot = value as Partial<QuizPersistedSession> & {
    version?: number
    phase?: 'question' | 'complete' | 'result'
  }

  return (
    (snapshot.version === 1 || snapshot.version === 2) &&
    (snapshot.phase === 'question' || snapshot.phase === 'complete' || snapshot.phase === 'result') &&
    typeof snapshot.currentQuestionId === 'string' &&
    !!snapshot.answers &&
    typeof snapshot.answers === 'object'
  )
}

function normalizeQuizSessionPhase(snapshot: QuizPersistedSession | {
  version?: number
  phase?: 'question' | 'complete' | 'result'
}): QuizSessionPhase {
  if (snapshot.phase === 'complete') {
    return 'result'
  }

  return snapshot.phase === 'result' ? 'result' : 'question'
}

export function useQuizSession() {
  const initialQuestionId = solagreeQuizQuestionIds[0]
  const answers = ref<QuizAnswerMap>({})
  const currentQuestionId = ref<QuizQuestionId>(initialQuestionId)
  const phase = ref<QuizSessionPhase>('question')
  const hasRestoredPersistedState = ref(false)

  const visibleQuestionIds = computed(() => getVisibleQuizQuestionIds(answers.value))
  const currentQuestion = computed(() => getQuizQuestionById(currentQuestionId.value))
  const currentValue = computed(() => answers.value[currentQuestionId.value])
  const canGoBack = computed(() => {
    if (phase.value === 'result') {
      return visibleQuestionIds.value.length > 0
    }

    return getPreviousQuizQuestionId(currentQuestionId.value, answers.value) !== null
  })
  const canAdvance = computed(() => {
    return isQuizAnswerPresent(currentQuestionId.value, currentValue.value as QuizQuestionValue | undefined)
  })
  const evaluation = computed(() => evaluateQuizAnswers(answers.value))
  const resultView = computed(() => getQuizResultViewModel(evaluation.value))
  const progressValue = computed(() =>
    getQuizProgressValue(currentQuestionId.value, answers.value, phase.value)
  )
  const primaryActionLabel = computed(() => {
    const nextQuestionId = getNextQuizQuestionId(currentQuestionId.value, answers.value)
    return nextQuestionId ? solagreeQuizLabels.next : solagreeQuizLabels.finish
  })

  function syncQuestionPosition(nextAnswers: QuizAnswerMap, preferredQuestionId?: QuizQuestionId) {
    const prunedAnswers = pruneHiddenQuizAnswers(nextAnswers)
    answers.value = prunedAnswers
    currentQuestionId.value = coerceQuizCurrentQuestionId(prunedAnswers, preferredQuestionId ?? currentQuestionId.value)
    phase.value = 'question'
  }

  function setAnswer<TQuestionId extends QuizQuestionId>(
    questionId: TQuestionId,
    value: QuizQuestionValue<TQuestionId> | undefined
  ) {
    const nextAnswers: QuizAnswerMap = {
      ...answers.value
    }

    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      delete nextAnswers[questionId]
    } else {
      nextAnswers[questionId] = value as never
    }

    syncQuestionPosition(nextAnswers, questionId)
  }

  function setSingleAnswer(questionId: QuizQuestionId, value: string | undefined) {
    setAnswer(questionId, value as QuizQuestionValue | undefined)
  }

  function toggleMultiAnswer(questionId: QuizQuestionId, optionId: string, checked: boolean) {
    const current = answers.value[questionId]
    const currentValues = Array.isArray(current) ? current : []
    const nextValues = checked
      ? [...new Set([...currentValues, optionId])]
      : currentValues.filter(value => value !== optionId)

    setAnswer(questionId, nextValues as QuizQuestionValue)
  }

  function goNext() {
    if (!canAdvance.value) {
      return
    }

    const nextQuestionId = getNextQuizQuestionId(currentQuestionId.value, answers.value)

    if (!nextQuestionId) {
      phase.value = 'result'
      return
    }

    currentQuestionId.value = nextQuestionId
  }

  function goBack() {
    if (phase.value === 'result') {
      phase.value = 'question'
      currentQuestionId.value = visibleQuestionIds.value.at(-1) ?? initialQuestionId
      return
    }

    const previousQuestionId = getPreviousQuizQuestionId(currentQuestionId.value, answers.value)
    if (previousQuestionId) {
      currentQuestionId.value = previousQuestionId
    }
  }

  function reset() {
    answers.value = {}
    currentQuestionId.value = initialQuestionId
    phase.value = 'question'

    if (import.meta.client) {
      window.localStorage.removeItem(solagreeQuizStorageKey)
    }
  }

  if (import.meta.client) {
    onMounted(() => {
      const snapshotText = window.localStorage.getItem(solagreeQuizStorageKey)

      if (!snapshotText) {
        hasRestoredPersistedState.value = true
        return
      }

      try {
        const parsedSnapshot = JSON.parse(snapshotText) as unknown
        if (!isQuizSessionSnapshot(parsedSnapshot)) {
          hasRestoredPersistedState.value = true
          return
        }

        const prunedAnswers = pruneHiddenQuizAnswers(parsedSnapshot.answers)
        answers.value = prunedAnswers
        currentQuestionId.value = coerceQuizCurrentQuestionId(prunedAnswers, parsedSnapshot.currentQuestionId)
        phase.value = normalizeQuizSessionPhase(parsedSnapshot)
      } catch {
        window.localStorage.removeItem(solagreeQuizStorageKey)
      } finally {
        hasRestoredPersistedState.value = true
      }
    })

    watch(
      [answers, currentQuestionId, phase],
      () => {
        if (!hasRestoredPersistedState.value) {
          return
        }

        const snapshot: QuizPersistedSession = {
          version: 2,
          phase: phase.value,
          currentQuestionId: currentQuestionId.value,
          answers: answers.value
        }

        window.localStorage.setItem(solagreeQuizStorageKey, JSON.stringify(snapshot))
      },
      { deep: true }
    )
  }

  return {
    answers: readonly(answers),
    currentQuestion,
    currentQuestionId: readonly(currentQuestionId),
    currentValue,
    phase: readonly(phase),
    visibleQuestionIds,
    progressValue,
    evaluation,
    resultView,
    canGoBack,
    canAdvance,
    primaryActionLabel,
    labels: solagreeQuizLabels,
    setSingleAnswer,
    toggleMultiAnswer,
    goNext,
    goBack,
    reset
  }
}
