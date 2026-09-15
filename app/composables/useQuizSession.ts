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
  parseQuizSessionSnapshot,
  pruneHiddenQuizAnswers
} from '~/utils/quiz-navigation'
import { evaluateQuizAnswers, getQuizResultViewModel } from '~/utils/quiz-results'

const isQuizClient = import.meta.client || typeof window !== 'undefined'

/**
 * Owns quiz answer state, branching navigation, result evaluation, and persistence.
 */
export const useQuizSession = () => {
  const initialQuestionId = solagreeQuizQuestionIds[0] ?? 'state'
  const answers = ref<QuizAnswerMap>({})
  const currentQuestionId = ref<QuizQuestionId>(initialQuestionId)
  const phase = ref<QuizSessionPhase>('question')
  const maxForwardProgressValue = ref(getQuizProgressValue(initialQuestionId, {}, 'question'))
  const hasRestoredPersistedState = ref(false)
  const didRestorePersistedState = ref(false)

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
  const resultView = computed(() => getQuizResultViewModel())
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

  const raiseForwardProgressFloor = () => {
    maxForwardProgressValue.value = Math.max(
      maxForwardProgressValue.value,
      branchProgressValue.value
    )
  }

  const resetProgressFloorToCurrentBranch = () => {
    maxForwardProgressValue.value = branchProgressValue.value
  }

  const syncQuestionPosition = (nextAnswers: QuizAnswerMap, preferredQuestionId?: QuizQuestionId) => {
    const prunedAnswers = pruneHiddenQuizAnswers(nextAnswers)
    answers.value = prunedAnswers
    currentQuestionId.value = coerceQuizCurrentQuestionId(prunedAnswers, preferredQuestionId ?? currentQuestionId.value)
    phase.value = 'question'
    raiseForwardProgressFloor()
  }

  const setAnswer = <TQuestionId extends QuizQuestionId>(
    questionId: TQuestionId,
    value: QuizQuestionValue<TQuestionId> | undefined
  ) => {
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

  const setSingleAnswer = (questionId: QuizQuestionId, value: string | undefined) => {
    setAnswer(questionId, value as QuizQuestionValue | undefined)
  }

  const toggleMultiAnswer = (questionId: QuizQuestionId, optionId: string, checked: boolean) => {
    const current = answers.value[questionId]
    const currentValues = Array.isArray(current) ? current : []
    const nextValues = checked
      ? [...new Set([...currentValues, optionId])]
      : currentValues.filter(value => value !== optionId)

    setAnswer(questionId, nextValues as QuizQuestionValue)
  }

  const goNext = () => {
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

  const goBack = () => {
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

  const reset = () => {
    answers.value = {}
    currentQuestionId.value = initialQuestionId
    phase.value = 'question'
    resetProgressFloorToCurrentBranch()

    if (isQuizClient) {
      window.localStorage.removeItem(solagreeQuizStorageKey)
    }
  }

  if (isQuizClient) {
    onMounted(() => {
      const snapshotText = window.localStorage.getItem(solagreeQuizStorageKey)

      if (!snapshotText) {
        hasRestoredPersistedState.value = true
        return
      }

      try {
        const snapshot = parseQuizSessionSnapshot(JSON.parse(snapshotText) as unknown)
        if (!snapshot) {
          window.localStorage.removeItem(solagreeQuizStorageKey)
          return
        }

        answers.value = snapshot.answers
        currentQuestionId.value = snapshot.currentQuestionId
        phase.value = snapshot.phase
        maxForwardProgressValue.value = snapshot.maxProgressValue
          ?? branchProgressValue.value
        raiseForwardProgressFloor()
        didRestorePersistedState.value = true
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

        if (Object.keys(answers.value).length === 0 && phase.value === 'question') {
          window.localStorage.removeItem(solagreeQuizStorageKey)
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
    hasRestoredPersistedState: readonly(hasRestoredPersistedState),
    didRestorePersistedState: readonly(didRestorePersistedState),
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
