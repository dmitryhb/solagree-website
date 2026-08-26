import { resolveQuizHostConfig, resolveQuizResultViewForHost } from '~/data/quiz-host'
import type {
  QuizCompletedEvent,
  QuizCriterionId,
  QuizCriterionToggledEvent,
  QuizCtaClickedEvent,
  QuizHostConfigInput,
  QuizHostEvent,
  QuizOutcomeChangedEvent,
  QuizResetEvent,
  QuizResultCta,
  QuizStartedEvent
} from '~/data/quiz-types'

interface UseQuizHostOptions {
  hostConfig?: MaybeRefOrGetter<QuizHostConfigInput | undefined>
  onEvent?: (event: QuizHostEvent) => void
}

const createQuizHostSessionId = (): string => {
  return `quiz-${Math.random().toString(36).slice(2, 10)}`
}

/** Connects the PII-free qualifier session to host events, GA, CTA overrides, and iframe messaging. */
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
    return result ? resolveQuizResultViewForHost(result, hostConfig.value) : null
  })

  const shouldEmitEvents = (): boolean => {
    return hostConfig.value.analytics.enabled
      || hostConfig.value.bridge.postMessage
      || typeof options.onEvent === 'function'
  }

  const dispatchEvent = (event: QuizHostEvent): void => {
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

  const trackStarted = (): void => {
    if (hasTrackedQuizStart.value) {
      return
    }

    hasTrackedQuizStart.value = true

    if (shouldEmitEvents()) {
      const event: QuizStartedEvent = {
        type: 'started',
        ...buildEventContext()
      }
      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('quiz_started', buildAnalyticsContext())
    }
  }

  const trackCriterionToggled = (
    criterionId: QuizCriterionId,
    selected: boolean
  ): void => {
    const analyticsPayload = {
      criterion_id: criterionId,
      selected,
      criteria_met: quizSession.score.value,
      progress: quizSession.progressValue.value,
      ...buildAnalyticsContext()
    }

    if (shouldEmitEvents()) {
      const event: QuizCriterionToggledEvent = {
        type: 'criterion_toggled',
        criterionId,
        selected,
        score: quizSession.score.value,
        progress: quizSession.progressValue.value,
        ...buildEventContext()
      }
      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('quiz_criterion_toggled', analyticsPayload)
    }
  }

  const trackCompleted = (): void => {
    const outcome = quizSession.outcome.value

    if (!outcome || hasTrackedCompletion.value) {
      return
    }

    hasTrackedCompletion.value = true

    if (shouldEmitEvents()) {
      const event: QuizCompletedEvent = {
        type: 'completed',
        outcome,
        score: quizSession.score.value,
        progress: quizSession.progressValue.value,
        ...buildEventContext()
      }
      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('quiz_completed', {
        outcome,
        criteria_met: quizSession.score.value,
        progress: quizSession.progressValue.value,
        ...buildAnalyticsContext()
      })
    }
  }

  const trackOutcomeChanged = (): void => {
    const outcome = quizSession.outcome.value

    if (!outcome) {
      return
    }

    if (shouldEmitEvents()) {
      const event: QuizOutcomeChangedEvent = {
        type: 'outcome_changed',
        outcome,
        score: quizSession.score.value,
        ...buildEventContext()
      }
      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('quiz_outcome_changed', {
        outcome,
        criteria_met: quizSession.score.value,
        ...buildAnalyticsContext()
      })
    }
  }

  const handleCriterionChange = (
    criterionId: QuizCriterionId,
    selected: boolean
  ): void => {
    const previousOutcome = quizSession.outcome.value

    quizSession.setCriterionSelected(criterionId, selected)
    trackStarted()
    trackCriterionToggled(criterionId, selected)
    trackCompleted()

    if (quizSession.outcome.value !== previousOutcome) {
      trackOutcomeChanged()
    }
  }

  const handleReset = (): void => {
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

  const handleResultCtaClick = (cta: QuizResultCta): void => {
    const outcome = quizSession.outcome.value

    if (!outcome) {
      return
    }

    if (shouldEmitEvents()) {
      const event: QuizCtaClickedEvent = {
        type: 'cta_clicked',
        actionId: cta.actionId,
        ctaTrackingId: cta.trackingId,
        outcome,
        score: quizSession.score.value,
        ...buildEventContext()
      }
      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('quiz_cta_clicked', {
        action_id: cta.actionId,
        cta_tracking_id: cta.trackingId,
        outcome,
        criteria_met: quizSession.score.value,
        ...buildAnalyticsContext()
      })
    }
  }

  return {
    hostConfig,
    resolvedResultView,
    handleCriterionChange,
    handleReset,
    handleResultCtaClick
  }
}
