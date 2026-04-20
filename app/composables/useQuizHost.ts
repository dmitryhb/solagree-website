import { resolveQuizHostConfig, resolveQuizResultViewForHost } from '~/data/quiz-host'
import type {
  QuizCtaClickedEvent,
  QuizHostConfigInput,
  QuizHostEvent,
  QuizQuestionAnsweredEvent,
  QuizQuestionId,
  QuizQuestionViewedEvent,
  QuizResetEvent,
  QuizResultCta
} from '~/data/quiz-types'
import type { useQuizSession } from '~/composables/useQuizSession'

interface UseQuizHostOptions {
  hostConfig?: MaybeRefOrGetter<QuizHostConfigInput | undefined>
  onEvent?: (event: QuizHostEvent) => void
}

function createQuizHostSessionId() {
  return `quiz-${Math.random().toString(36).slice(2, 10)}`
}

export function useQuizHost(
  quizSession: ReturnType<typeof useQuizSession>,
  options: UseQuizHostOptions = {}
) {
  const runtimeConfig = useRuntimeConfig()
  const sessionId = ref(createQuizHostSessionId())
  const hostConfig = computed(() => {
    return resolveQuizHostConfig(
      runtimeConfig.public.solagreeQuiz as QuizHostConfigInput | undefined,
      toValue(options.hostConfig)
    )
  })
  const resolvedResultView = computed(() => {
    const result = quizSession.resultView.value
    return result ? resolveQuizResultViewForHost(result, hostConfig.value) : undefined
  })

  function shouldEmitEvents() {
    return hostConfig.value.analytics.enabled
      || hostConfig.value.bridge.postMessage
      || typeof options.onEvent === 'function'
  }

  function dispatchEvent(event: QuizHostEvent) {
    if (!import.meta.client) {
      return
    }

    options.onEvent?.(event)

    if (hostConfig.value.bridge.postMessage && window.parent !== window) {
      window.parent.postMessage(
        {
          source: hostConfig.value.analytics.namespace,
          payload: event
        },
        hostConfig.value.bridge.targetOrigin
      )
    }
  }

  function buildEventContext() {
    return {
      hostId: hostConfig.value.hostId,
      mode: hostConfig.value.mode,
      sessionId: sessionId.value,
      trackingId: hostConfig.value.analytics.trackingId,
      timestamp: new Date().toISOString()
    } as const
  }

  function trackQuestionViewed(questionId: QuizQuestionId, progress: number) {
    if (!shouldEmitEvents()) {
      return
    }

    const event: QuizQuestionViewedEvent = {
      type: 'question_viewed',
      questionId,
      progress,
      ...buildEventContext()
    }

    dispatchEvent(event)
  }

  function trackQuestionAnswered(questionId: QuizQuestionId, value: QuizQuestionAnsweredEvent['value']) {
    if (!shouldEmitEvents()) {
      return
    }

    const event: QuizQuestionAnsweredEvent = {
      type: 'question_answered',
      questionId,
      value,
      progress: quizSession.progressValue.value,
      ...buildEventContext()
    }

    dispatchEvent(event)
  }

  function getTrackedAnswerValue(questionId: QuizQuestionId): QuizQuestionAnsweredEvent['value'] | undefined {
    const value = quizSession.answers.value[questionId]

    if (value === undefined) {
      return undefined
    }

    return Array.isArray(value)
      ? [...value] as QuizQuestionAnsweredEvent['value']
      : value as QuizQuestionAnsweredEvent['value']
  }

  function handleSingleAnswer(questionId: QuizQuestionId, value: string | undefined) {
    quizSession.setSingleAnswer(questionId, value)

    const nextValue = getTrackedAnswerValue(questionId)
    if (nextValue !== undefined) {
      trackQuestionAnswered(questionId, nextValue)
    }
  }

  function handleMultiAnswer(questionId: QuizQuestionId, payload: { value: string, checked: boolean }) {
    quizSession.toggleMultiAnswer(questionId, payload.value, payload.checked)

    const nextValue = getTrackedAnswerValue(questionId)
    if (nextValue !== undefined) {
      trackQuestionAnswered(questionId, nextValue)
    }
  }

  function handleAdvance() {
    const fromQuestionId = quizSession.currentQuestionId.value
    const previousPhase = quizSession.phase.value

    quizSession.goNext()

    if (!shouldEmitEvents() || previousPhase !== 'question') {
      return
    }

    dispatchEvent({
      type: 'progressed',
      fromQuestionId,
      toQuestionId: quizSession.phase.value === 'result' ? 'result' : quizSession.currentQuestionId.value,
      progress: quizSession.progressValue.value,
      ...buildEventContext()
    })
  }

  function handleBack() {
    quizSession.goBack()
  }

  function handleReset() {
    quizSession.reset()

    if (!shouldEmitEvents()) {
      return
    }

    const event: QuizResetEvent = {
      type: 'reset',
      ...buildEventContext()
    }

    dispatchEvent(event)
  }

  function handleResultCtaClick(cta: QuizResultCta) {
    if (!shouldEmitEvents()) {
      return
    }

    const evaluation = quizSession.evaluation.value
    const event: QuizCtaClickedEvent = {
      type: 'cta_clicked',
      actionId: cta.actionId,
      href: cta.href,
      ctaTrackingId: cta.trackingId,
      outcome: evaluation.kind === 'resolved' ? evaluation.outcome : 'open-policy',
      policyId: evaluation.kind === 'open-policy' ? evaluation.policyId : undefined,
      ...buildEventContext()
    }

    dispatchEvent(event)
  }

  watch(
    [() => quizSession.currentQuestionId.value, () => quizSession.phase.value] as const,
    ([questionId, phase]) => {
      if (phase !== 'question') {
        return
      }

      trackQuestionViewed(questionId, quizSession.progressValue.value)
    },
    { immediate: true }
  )

  watch(
    () => quizSession.phase.value,
    (phase, previousPhase) => {
      if (!shouldEmitEvents() || phase !== 'result' || previousPhase === 'result') {
        return
      }

      const evaluation = quizSession.evaluation.value
      dispatchEvent({
        type: 'completed',
        outcome: evaluation.kind === 'resolved' ? evaluation.outcome : 'open-policy',
        policyId: evaluation.kind === 'open-policy' ? evaluation.policyId : undefined,
        tags: evaluation.metadata.tags,
        progress: quizSession.progressValue.value,
        ...buildEventContext()
      })
    }
  )

  return {
    hostConfig,
    resolvedResultView,
    handleSingleAnswer,
    handleMultiAnswer,
    handleAdvance,
    handleBack,
    handleReset,
    handleResultCtaClick
  }
}
