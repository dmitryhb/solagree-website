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

const createQuizHostSessionId = () => {
  return `quiz-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Connects quiz session state to host configuration, CTA overrides, and embed events.
 */
export const useQuizHost = (
  quizSession: ReturnType<typeof useQuizSession>,
  options: UseQuizHostOptions = {}
) => {
  const runtimeConfig = useRuntimeConfig()
  const { trackEvent } = useGoogleAnalytics()
  const sessionId = ref(createQuizHostSessionId())
  const hasTrackedQuizStart = ref(false)
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

  const shouldEmitEvents = () => {
    return hostConfig.value.analytics.enabled
      || hostConfig.value.bridge.postMessage
      || typeof options.onEvent === 'function'
  }

  const dispatchEvent = (event: QuizHostEvent) => {
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

  const buildEventContext = () => {
    return {
      hostId: hostConfig.value.hostId,
      mode: hostConfig.value.mode,
      sessionId: sessionId.value,
      trackingId: hostConfig.value.analytics.trackingId,
      timestamp: new Date().toISOString()
    } as const
  }

  const buildAnalyticsContext = () => {
    return {
      host_id: hostConfig.value.hostId,
      quiz_mode: hostConfig.value.mode,
      quiz_session_id: sessionId.value,
      tracking_id: hostConfig.value.analytics.trackingId
    }
  }

  const trackQuizStarted = (questionId: QuizQuestionId) => {
    if (!hostConfig.value.analytics.enabled || hasTrackedQuizStart.value) {
      return
    }

    hasTrackedQuizStart.value = true
    trackEvent('quiz_started', {
      question_id: questionId,
      ...buildAnalyticsContext()
    })
  }

  const trackQuestionViewed = (questionId: QuizQuestionId, progress: number) => {
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

  const trackQuestionAnswered = (questionId: QuizQuestionId, value: QuizQuestionAnsweredEvent['value']) => {
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

  const getTrackedAnswerValue = (questionId: QuizQuestionId): QuizQuestionAnsweredEvent['value'] | undefined => {
    const value = quizSession.answers.value[questionId]

    if (value === undefined) {
      return undefined
    }

    return Array.isArray(value)
      ? [...value] as QuizQuestionAnsweredEvent['value']
      : value as QuizQuestionAnsweredEvent['value']
  }

  const handleSingleAnswer = (questionId: QuizQuestionId, value: string | undefined) => {
    quizSession.setSingleAnswer(questionId, value)

    const nextValue = getTrackedAnswerValue(questionId)
    if (nextValue !== undefined) {
      trackQuizStarted(questionId)
      trackQuestionAnswered(questionId, nextValue)
    }
  }

  const handleMultiAnswer = (questionId: QuizQuestionId, payload: { value: string, checked: boolean }) => {
    quizSession.toggleMultiAnswer(questionId, payload.value, payload.checked)

    const nextValue = getTrackedAnswerValue(questionId)
    if (nextValue !== undefined) {
      trackQuizStarted(questionId)
      trackQuestionAnswered(questionId, nextValue)
    }
  }

  const handleAdvance = () => {
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

  const handleBack = () => {
    quizSession.goBack()
  }

  const handleReset = () => {
    quizSession.reset()
    hasTrackedQuizStart.value = false

    if (!shouldEmitEvents()) {
      return
    }

    const event: QuizResetEvent = {
      type: 'reset',
      ...buildEventContext()
    }

    dispatchEvent(event)
  }

  const handleResultCtaClick = (cta: QuizResultCta) => {
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

      if (hostConfig.value.analytics.enabled) {
        trackEvent('quiz_completed', {
          outcome: evaluation.kind === 'resolved' ? evaluation.outcome : 'open-policy',
          policy_id: evaluation.kind === 'open-policy' ? evaluation.policyId : undefined,
          progress: quizSession.progressValue.value,
          tag_ids: evaluation.metadata.tags.join(','),
          ...buildAnalyticsContext()
        })
      }
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
