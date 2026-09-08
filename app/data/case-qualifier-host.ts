import type {
  CaseQualifierCtaActionId,
  CaseQualifierHostConfigInput,
  CaseQualifierHostRuntimeConfig,
  CaseQualifierResultViewModel
} from '~/data/case-qualifier-types'

const defaultCaseQualifierCtaTargets = {
  'solagree-consult': {
    href: '/book-a-solagree-consult'
  }
} as const satisfies Record<CaseQualifierCtaActionId, { href: string }>

const defaultCaseQualifierHostRuntimeConfig = {
  hostId: 'solagree-case-qualifier',
  mode: 'standalone',
  display: {
    showShellHeader: true,
    showInstructions: true,
    headingLevel: 1
  },
  analytics: {
    enabled: true,
    namespace: 'solagree.case_qualifier'
  },
  bridge: {
    postMessage: false,
    targetOrigin: '*'
  },
  ctas: defaultCaseQualifierCtaTargets
} as const satisfies CaseQualifierHostRuntimeConfig

const mergeCaseQualifierCtaTargets = (overrides?: CaseQualifierHostConfigInput['ctas']) => {
  return Object.entries(defaultCaseQualifierCtaTargets).reduce<CaseQualifierHostRuntimeConfig['ctas']>((targets, [actionId, target]) => {
    targets[actionId as CaseQualifierCtaActionId] = {
      ...target,
      ...overrides?.[actionId as CaseQualifierCtaActionId]
    }

    return targets
  }, {})
}

/**
 * Merges runtime qualifier host config with optional host overrides.
 */
export const resolveCaseQualifierHostConfig = (
  runtimeConfig?: CaseQualifierHostConfigInput,
  overrides?: CaseQualifierHostConfigInput
): CaseQualifierHostRuntimeConfig => {
  const mergedInput: CaseQualifierHostConfigInput = {
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
    hostId: mergedInput.hostId ?? defaultCaseQualifierHostRuntimeConfig.hostId,
    mode: mergedInput.mode ?? defaultCaseQualifierHostRuntimeConfig.mode,
    display: {
      showShellHeader: mergedInput.display?.showShellHeader ?? defaultCaseQualifierHostRuntimeConfig.display.showShellHeader,
      showInstructions: mergedInput.display?.showInstructions ?? defaultCaseQualifierHostRuntimeConfig.display.showInstructions,
      headingLevel: mergedInput.display?.headingLevel ?? defaultCaseQualifierHostRuntimeConfig.display.headingLevel
    },
    analytics: {
      enabled: mergedInput.analytics?.enabled ?? defaultCaseQualifierHostRuntimeConfig.analytics.enabled,
      namespace: mergedInput.analytics?.namespace ?? defaultCaseQualifierHostRuntimeConfig.analytics.namespace,
      trackingId: mergedInput.analytics?.trackingId
    },
    bridge: {
      postMessage: mergedInput.bridge?.postMessage ?? defaultCaseQualifierHostRuntimeConfig.bridge.postMessage,
      targetOrigin: mergedInput.bridge?.targetOrigin ?? defaultCaseQualifierHostRuntimeConfig.bridge.targetOrigin
    },
    ctas: mergeCaseQualifierCtaTargets(mergedInput.ctas)
  }
}

/**
 * Applies host-specific CTA overrides to a qualifier result view model.
 */
export const resolveCaseQualifierResultViewForHost = (
  result: CaseQualifierResultViewModel,
  hostConfig: CaseQualifierHostRuntimeConfig
): CaseQualifierResultViewModel => {
  const ctaOverride = hostConfig.ctas[result.primaryCta.actionId]

  return {
    ...result,
    primaryCta: {
      ...result.primaryCta,
      ...ctaOverride
    }
  }
}
