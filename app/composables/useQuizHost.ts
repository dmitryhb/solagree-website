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
import {
  buildHostEventContext,
  dispatchHostEvent,
  shouldEmitHostEvents
} from '~/utils/host-integration'

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
  const hasTrackedCompletion = ref(false)
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
    return shouldEmitHostEvents(hostConfig.value, options.onEvent)
  }

  const dispatchEvent = (event: QuizHostEvent) => {
    dispatchHostEvent(event, hostConfig.value, options.onEvent)
  }

  const buildEventContext = () => {
    return buildHostEventContext(hostConfig.value, sessionId.value)
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
    hasTrackedCompletion.value = false

    if (shouldEmitEvents()) {
      const event: QuizResetEvent = {
        type: 'reset',
        ...buildEventContext()
      }

      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('quiz_reset', buildAnalyticsContext())
    }
  }

  const handleResultCtaClick = (cta: QuizResultCta) => {
    const evaluation = quizSession.evaluation.value
    const outcome = evaluation.kind === 'resolved' ? evaluation.outcome : 'open-policy'
    const policyId = evaluation.kind === 'open-policy' ? evaluation.policyId : undefined

    if (shouldEmitEvents()) {
      const event: QuizCtaClickedEvent = {
        type: 'cta_clicked',
        actionId: cta.actionId,
        href: cta.href,
        ctaTrackingId: cta.trackingId,
        outcome,
        policyId,
        ...buildEventContext()
      }

      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('quiz_cta_clicked', {
        action_id: cta.actionId,
        cta_tracking_id: cta.trackingId,
        outcome,
        policy_id: policyId,
        ...buildAnalyticsContext()
      })
    }
  }

  watch(
    [
      () => quizSession.currentQuestionId.value,
      () => quizSession.phase.value,
      () => quizSession.hasRestoredPersistedState.value
    ] as const,
    ([questionId, phase, hasRestoredPersistedState], previousState) => {
      const previouslyRestoredPersistedState = previousState?.[2] ?? false

      if (!hasRestoredPersistedState || phase !== 'question') {
        return
      }

      if (!previouslyRestoredPersistedState && quizSession.didRestorePersistedState.value) {
        return
      }

      trackQuestionViewed(questionId, quizSession.progressValue.value)
    },
    { immediate: true }
  )

  watch(
    [
      () => quizSession.phase.value,
      () => quizSession.hasRestoredPersistedState.value
    ] as const,
    ([phase, hasRestoredPersistedState], previousState) => {
      const previousPhase = previousState?.[0]
      const previouslyRestoredPersistedState = previousState?.[1] ?? false

      if (
        !hasRestoredPersistedState
        || !shouldEmitEvents()
        || phase !== 'result'
        || previousPhase === 'result'
        || quizSession.hasCompletedAttempt.value
        || hasTrackedCompletion.value
      ) {
        return
      }

      if (!previouslyRestoredPersistedState && quizSession.didRestorePersistedState.value) {
        hasTrackedCompletion.value = true
        return
      }

      const evaluation = quizSession.evaluation.value
      hasTrackedCompletion.value = true
      quizSession.markAttemptCompleted()
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
