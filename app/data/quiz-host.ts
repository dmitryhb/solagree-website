import type {
  QuizCtaActionId,
  QuizHostConfigInput,
  QuizHostRuntimeConfig,
  QuizResultViewModel
} from '~/data/quiz-types'

const defaultQuizCtaTargets = {
  'solagree-consult': {
    href: '/book-a-solagree-consult'
  }
} as const satisfies Record<QuizCtaActionId, { href: string }>

const defaultQuizHostRuntimeConfig = {
  hostId: 'solagree-quiz',
  mode: 'standalone',
  display: {
    showShellHeader: true,
    showInstructions: true,
    headingLevel: 1
  },
  analytics: {
    enabled: true,
    namespace: 'solagree.quiz'
  },
  bridge: {
    postMessage: false,
    targetOrigin: '*'
  },
  ctas: defaultQuizCtaTargets
} as const satisfies QuizHostRuntimeConfig

const mergeQuizCtaTargets = (overrides?: QuizHostConfigInput['ctas']) => {
  return Object.entries(defaultQuizCtaTargets).reduce<QuizHostRuntimeConfig['ctas']>((targets, [actionId, target]) => {
    targets[actionId as QuizCtaActionId] = {
      ...target,
      ...overrides?.[actionId as QuizCtaActionId]
    }

    return targets
  }, {})
}

/**
 * Merges runtime quiz host config with optional per-embed overrides.
 */
export const resolveQuizHostConfig = (
  runtimeConfig?: QuizHostConfigInput,
  overrides?: QuizHostConfigInput
): QuizHostRuntimeConfig => {
  const mergedInput: QuizHostConfigInput = {
    ...runtimeConfig,
    ...overrides,
    display: {
      ...runtimeConfig?.display,
      ...overrides?.display
    },
    analytics: {
      ...runtimeConfig?.analytics,
      ...overrides?.analytics
    },
    bridge: {
      ...runtimeConfig?.bridge,
      ...overrides?.bridge
    },
    ctas: {
      ...runtimeConfig?.ctas,
      ...overrides?.ctas
    }
  }

  return {
    hostId: mergedInput.hostId ?? defaultQuizHostRuntimeConfig.hostId,
    mode: mergedInput.mode ?? defaultQuizHostRuntimeConfig.mode,
    display: {
      showShellHeader: mergedInput.display?.showShellHeader ?? defaultQuizHostRuntimeConfig.display.showShellHeader,
      showInstructions: mergedInput.display?.showInstructions ?? defaultQuizHostRuntimeConfig.display.showInstructions,
      headingLevel: mergedInput.display?.headingLevel ?? defaultQuizHostRuntimeConfig.display.headingLevel
    },
    analytics: {
      enabled: mergedInput.analytics?.enabled ?? defaultQuizHostRuntimeConfig.analytics.enabled,
      namespace: mergedInput.analytics?.namespace ?? defaultQuizHostRuntimeConfig.analytics.namespace,
      trackingId: mergedInput.analytics?.trackingId
    },
    bridge: {
      postMessage: mergedInput.bridge?.postMessage ?? defaultQuizHostRuntimeConfig.bridge.postMessage,
      targetOrigin: mergedInput.bridge?.targetOrigin ?? defaultQuizHostRuntimeConfig.bridge.targetOrigin
    },
    ctas: mergeQuizCtaTargets(mergedInput.ctas)
  }
}

/**
 * Applies host-specific CTA overrides to a quiz result view model.
 */
export const resolveQuizResultViewForHost = (
  result: QuizResultViewModel,
  hostConfig: QuizHostRuntimeConfig
): QuizResultViewModel => {
  const ctaOverride = hostConfig.ctas[result.primaryCta.actionId]

  return {
    ...result,
    primaryCta: {
      ...result.primaryCta,
      ...ctaOverride
    }
  }
}
