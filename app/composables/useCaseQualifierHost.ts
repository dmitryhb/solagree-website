import { resolveCaseQualifierHostConfig, resolveCaseQualifierResultViewForHost } from '~/data/case-qualifier-host'
import type {
  CaseQualifierCompletedEvent,
  CaseQualifierCriterionId,
  CaseQualifierCriterionToggledEvent,
  CaseQualifierCtaClickedEvent,
  CaseQualifierHostConfigInput,
  CaseQualifierHostEvent,
  CaseQualifierOutcomeChangedEvent,
  CaseQualifierResetEvent,
  CaseQualifierResultCta,
  CaseQualifierStartedEvent
} from '~/data/case-qualifier-types'

interface UseCaseQualifierHostOptions {
  hostConfig?: MaybeRefOrGetter<CaseQualifierHostConfigInput | undefined>
  onEvent?: (event: CaseQualifierHostEvent) => void
}

const createCaseQualifierHostSessionId = (): string => {
  return `case-qualifier-${Math.random().toString(36).slice(2, 10)}`
}

/** Connects the PII-free qualifier session to host events, GA, CTA overrides, and iframe messaging. */
export const useCaseQualifierHost = (
  caseQualifierSession: ReturnType<typeof useCaseQualifierSession>,
  options: UseCaseQualifierHostOptions = {}
) => {
  const runtimeConfig = useRuntimeConfig()
  const { trackEvent } = useGoogleAnalytics()
  const sessionId = ref(createCaseQualifierHostSessionId())
  const hasTrackedCaseQualifierStart = ref(false)
  const hasTrackedCompletion = ref(false)
  const hostConfig = computed(() => {
    return resolveCaseQualifierHostConfig(
      runtimeConfig.public.solagreeCaseQualifier as CaseQualifierHostConfigInput | undefined,
      toValue(options.hostConfig)
    )
  })
  const resolvedResultView = computed(() => {
    const result = caseQualifierSession.resultView.value
    return result ? resolveCaseQualifierResultViewForHost(result, hostConfig.value) : null
  })

  const shouldEmitEvents = (): boolean => {
    return hostConfig.value.analytics.enabled
      || hostConfig.value.bridge.postMessage
      || typeof options.onEvent === 'function'
  }

  const dispatchEvent = (event: CaseQualifierHostEvent): void => {
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
      case_qualifier_mode: hostConfig.value.mode,
      case_qualifier_session_id: sessionId.value,
      tracking_id: hostConfig.value.analytics.trackingId
    }
  }

  const trackStarted = (): void => {
    if (hasTrackedCaseQualifierStart.value) {
      return
    }

    hasTrackedCaseQualifierStart.value = true

    if (shouldEmitEvents()) {
      const event: CaseQualifierStartedEvent = {
        type: 'started',
        ...buildEventContext()
      }
      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('case_qualifier_started', buildAnalyticsContext())
    }
  }

  const trackCriterionToggled = (
    criterionId: CaseQualifierCriterionId,
    selected: boolean
  ): void => {
    const analyticsPayload = {
      criterion_id: criterionId,
      selected,
      criteria_met: caseQualifierSession.score.value,
      progress: caseQualifierSession.progressValue.value,
      ...buildAnalyticsContext()
    }

    if (shouldEmitEvents()) {
      const event: CaseQualifierCriterionToggledEvent = {
        type: 'criterion_toggled',
        criterionId,
        selected,
        score: caseQualifierSession.score.value,
        progress: caseQualifierSession.progressValue.value,
        ...buildEventContext()
      }
      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('case_qualifier_criterion_toggled', analyticsPayload)
    }
  }

  const trackCompleted = (): void => {
    const outcome = caseQualifierSession.outcome.value

    if (!outcome || hasTrackedCompletion.value) {
      return
    }

    hasTrackedCompletion.value = true

    if (shouldEmitEvents()) {
      const event: CaseQualifierCompletedEvent = {
        type: 'completed',
        outcome,
        score: caseQualifierSession.score.value,
        progress: caseQualifierSession.progressValue.value,
        ...buildEventContext()
      }
      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('case_qualifier_completed', {
        outcome,
        criteria_met: caseQualifierSession.score.value,
        progress: caseQualifierSession.progressValue.value,
        ...buildAnalyticsContext()
      })
    }
  }

  const trackOutcomeChanged = (): void => {
    const outcome = caseQualifierSession.outcome.value

    if (!outcome) {
      return
    }

    if (shouldEmitEvents()) {
      const event: CaseQualifierOutcomeChangedEvent = {
        type: 'outcome_changed',
        outcome,
        score: caseQualifierSession.score.value,
        ...buildEventContext()
      }
      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('case_qualifier_outcome_changed', {
        outcome,
        criteria_met: caseQualifierSession.score.value,
        ...buildAnalyticsContext()
      })
    }
  }

  const handleCriterionChange = (
    criterionId: CaseQualifierCriterionId,
    selected: boolean
  ): void => {
    const previousOutcome = caseQualifierSession.outcome.value

    caseQualifierSession.setCriterionSelected(criterionId, selected)
    trackStarted()
    trackCriterionToggled(criterionId, selected)
    trackCompleted()

    if (caseQualifierSession.outcome.value !== previousOutcome) {
      trackOutcomeChanged()
    }
  }

  const handleReset = (): void => {
    caseQualifierSession.reset()
    hasTrackedCaseQualifierStart.value = false
    hasTrackedCompletion.value = false

    if (shouldEmitEvents()) {
      const event: CaseQualifierResetEvent = {
        type: 'reset',
        ...buildEventContext()
      }
      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('case_qualifier_reset', buildAnalyticsContext())
    }
  }

  const handleResultCtaClick = (cta: CaseQualifierResultCta): void => {
    const outcome = caseQualifierSession.outcome.value

    if (!outcome) {
      return
    }

    if (shouldEmitEvents()) {
      const event: CaseQualifierCtaClickedEvent = {
        type: 'cta_clicked',
        actionId: cta.actionId,
        ctaTrackingId: cta.trackingId,
        outcome,
        score: caseQualifierSession.score.value,
        ...buildEventContext()
      }
      dispatchEvent(event)
    }

    if (hostConfig.value.analytics.enabled) {
      trackEvent('case_qualifier_cta_clicked', {
        action_id: cta.actionId,
        cta_tracking_id: cta.trackingId,
        outcome,
        criteria_met: caseQualifierSession.score.value,
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
