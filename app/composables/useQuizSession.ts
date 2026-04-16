import {
  solagreeQuizCompletionContent,
  solagreeQuizLabels,
  solagreeQuizStorageKey
} from '~/data/quiz'
import { solagreeQuizQuestionIds } from '~/data/quiz-schema'
import type {
  QuizAnswerMap,
  QuizPersistedSession,
  QuizQuestionId,
  QuizQuestionValue
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

function isQuizSessionSnapshot(value: unknown): value is QuizPersistedSession {
  if (!value || typeof value !== 'object') {
    return false
  }

  const snapshot = value as Partial<QuizPersistedSession>

  return (
    snapshot.version === 1 &&
    (snapshot.phase === 'question' || snapshot.phase === 'complete') &&
    typeof snapshot.currentQuestionId === 'string' &&
    !!snapshot.answers &&
    typeof snapshot.answers === 'object'
  )
}

export function useQuizSession() {
  const initialQuestionId = solagreeQuizQuestionIds[0]
  const answers = ref<QuizAnswerMap>({})
  const currentQuestionId = ref<QuizQuestionId>(initialQuestionId)
  const phase = ref<'question' | 'complete'>('question')
  const hasRestoredPersistedState = ref(false)

  const visibleQuestionIds = computed(() => getVisibleQuizQuestionIds(answers.value))
  const currentQuestion = computed(() => getQuizQuestionById(currentQuestionId.value))
  const currentValue = computed(() => answers.value[currentQuestionId.value])
  const canGoBack = computed(() => {
    if (phase.value === 'complete') {
      return false
    }

    return getPreviousQuizQuestionId(currentQuestionId.value, answers.value) !== null
  })
  const canAdvance = computed(() => {
    if (phase.value === 'complete') {
      return true
    }

    return isQuizAnswerPresent(currentQuestionId.value, currentValue.value as QuizQuestionValue | undefined)
  })
  const progressValue = computed(() =>
    getQuizProgressValue(currentQuestionId.value, answers.value, phase.value)
  )
  const primaryActionLabel = computed(() => {
    if (phase.value === 'complete') {
      return solagreeQuizCompletionContent.actionLabel
    }

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

  function setSingleAnswer(questionId: QuizQuestionId, value: string) {
    setAnswer(questionId, value as QuizQuestionValue)
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
    if (phase.value === 'complete') {
      reset()
      return
    }

    if (!canAdvance.value) {
      return
    }

    const nextQuestionId = getNextQuizQuestionId(currentQuestionId.value, answers.value)

    if (!nextQuestionId) {
      phase.value = 'complete'
      return
    }

    currentQuestionId.value = nextQuestionId
  }

  function goBack() {
    if (phase.value === 'complete') {
      phase.value = 'question'
      currentQuestionId.value = coerceQuizCurrentQuestionId(answers.value, currentQuestionId.value)
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
        phase.value = parsedSnapshot.phase
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
          version: 1,
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
    canGoBack,
    canAdvance,
    primaryActionLabel,
    completionContent: solagreeQuizCompletionContent,
    labels: solagreeQuizLabels,
    setSingleAnswer,
    toggleMultiAnswer,
    goNext,
    goBack,
    reset
  }
}
