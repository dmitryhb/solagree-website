import type {
  CaseQualifierCtaActionId,
  CaseQualifierHostConfigInput,
  CaseQualifierHostRuntimeConfig,
  CaseQualifierResultViewModel
} from '~/data/case-qualifier-types'
import {
  resolveHostConfig,
  resolveHostResultView
} from '~/utils/host-integration'
import type { HostConfigAdapter } from '~/utils/host-integration'

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
    postMessage: false
  },
  ctas: defaultCaseQualifierCtaTargets
} as const satisfies CaseQualifierHostRuntimeConfig

const caseQualifierHostConfigAdapter: HostConfigAdapter<
  CaseQualifierHostRuntimeConfig['mode'],
  CaseQualifierHostRuntimeConfig['display'],
  CaseQualifierCtaActionId
> = {
  defaults: defaultCaseQualifierHostRuntimeConfig
}

/**
 * Merges runtime qualifier host config with optional host overrides.
 */
export const resolveCaseQualifierHostConfig = (
  runtimeConfig?: CaseQualifierHostConfigInput,
  overrides?: CaseQualifierHostConfigInput
): CaseQualifierHostRuntimeConfig => {
  return resolveHostConfig(caseQualifierHostConfigAdapter, runtimeConfig, overrides)
}

/**
 * Applies host-specific CTA overrides to a qualifier result view model.
 */
export const resolveCaseQualifierResultViewForHost = (
  result: CaseQualifierResultViewModel,
  hostConfig: CaseQualifierHostRuntimeConfig
): CaseQualifierResultViewModel => {
  return resolveHostResultView(result, hostConfig.ctas)
}
