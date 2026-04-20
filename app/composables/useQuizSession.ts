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

  const snapshot = value as {
    version?: unknown
    phase?: unknown
    currentQuestionId?: unknown
    answers?: unknown
  }

  return (
    (snapshot.version === 1 || snapshot.version === 2) &&
    (snapshot.phase === 'question' || snapshot.phase === 'complete' || snapshot.phase === 'result') &&
    typeof snapshot.currentQuestionId === 'string' &&
    !!snapshot.answers &&
    typeof snapshot.answers === 'object'
  )
}

function normalizeQuizSessionPhase(snapshot: { phase?: unknown }): QuizSessionPhase {
  if (snapshot.phase === 'complete') {
    return 'result'
  }

  return snapshot.phase === 'result' ? 'result' : 'question'
}

function normalizeProgressValue(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined
  }

  return Math.min(Math.max(Math.round(value), 0), 100)
}

export function useQuizSession() {
  const initialQuestionId = solagreeQuizQuestionIds[0] ?? 'state'
  const answers = ref<QuizAnswerMap>({})
  const currentQuestionId = ref<QuizQuestionId>(initialQuestionId)
  const phase = ref<QuizSessionPhase>('question')
  const maxForwardProgressValue = ref(getQuizProgressValue(initialQuestionId, {}, 'question'))
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
  const branchProgressValue = computed(() => {
    return getQuizProgressValue(currentQuestionId.value, answers.value, phase.value)
  })
  const progressValue = computed(() => {
    if (phase.value === 'result') {
      return 100
    }

    return Math.max(branchProgressValue.value, maxForwardProgressValue.value)
  })
  const primaryActionLabel = computed(() => {
    const nextQuestionId = getNextQuizQuestionId(currentQuestionId.value, answers.value)
    return nextQuestionId ? solagreeQuizLabels.next : solagreeQuizLabels.finish
  })

  function raiseForwardProgressFloor() {
    maxForwardProgressValue.value = Math.max(
      maxForwardProgressValue.value,
      branchProgressValue.value
    )
  }

  function resetProgressFloorToCurrentBranch() {
    maxForwardProgressValue.value = branchProgressValue.value
  }

  function syncQuestionPosition(nextAnswers: QuizAnswerMap, preferredQuestionId?: QuizQuestionId) {
    const prunedAnswers = pruneHiddenQuizAnswers(nextAnswers)
    answers.value = prunedAnswers
    currentQuestionId.value = coerceQuizCurrentQuestionId(prunedAnswers, preferredQuestionId ?? currentQuestionId.value)
    phase.value = 'question'
    raiseForwardProgressFloor()
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
      raiseForwardProgressFloor()
      return
    }

    currentQuestionId.value = nextQuestionId
    raiseForwardProgressFloor()
  }

  function goBack() {
    if (phase.value === 'result') {
      phase.value = 'question'
      currentQuestionId.value = visibleQuestionIds.value.at(-1) ?? initialQuestionId
      resetProgressFloorToCurrentBranch()
      return
    }

    const previousQuestionId = getPreviousQuizQuestionId(currentQuestionId.value, answers.value)
    if (previousQuestionId) {
      currentQuestionId.value = previousQuestionId
      resetProgressFloorToCurrentBranch()
    }
  }

  function reset() {
    answers.value = {}
    currentQuestionId.value = initialQuestionId
    phase.value = 'question'
    resetProgressFloorToCurrentBranch()

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
        maxForwardProgressValue.value = normalizeProgressValue(parsedSnapshot.maxProgressValue)
          ?? branchProgressValue.value
        raiseForwardProgressFloor()
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
          answers: answers.value,
          maxProgressValue: progressValue.value
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
