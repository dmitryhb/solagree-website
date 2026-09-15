import type {
  QuizCtaActionId,
  QuizHostConfigInput,
  QuizHostRuntimeConfig,
  QuizResultViewModel
} from '~/data/quiz-types'
import {
  resolveHostConfig,
  resolveHostResultView
} from '~/utils/host-integration'
import type { HostConfigAdapter } from '~/utils/host-integration'

const defaultQuizCtaTargets = {
  'solagree-consult': {
    href: '/book-a-solagree-consult'
  }
} as const satisfies Record<QuizCtaActionId, { href: string }>

export const defaultQuizHostRuntimeConfig = {
  hostId: 'solagree-quiz',
  mode: 'standalone',
  display: {
    showShellHeader: true,
    showExplainer: true
  },
  analytics: {
    enabled: true,
    namespace: 'solagree.quiz'
  },
  bridge: {
    postMessage: false
  },
  ctas: defaultQuizCtaTargets
} as const satisfies QuizHostRuntimeConfig

const quizHostConfigAdapter: HostConfigAdapter<
  QuizHostRuntimeConfig['mode'],
  QuizHostRuntimeConfig['display'],
  QuizCtaActionId
> = {
  defaults: defaultQuizHostRuntimeConfig
}

/**
 * Merges runtime quiz host config with optional per-embed overrides.
 */
export const resolveQuizHostConfig = (
  runtimeConfig?: QuizHostConfigInput,
  overrides?: QuizHostConfigInput
): QuizHostRuntimeConfig => {
  return resolveHostConfig(quizHostConfigAdapter, runtimeConfig, overrides)
}

/**
 * Applies host-specific CTA overrides to a quiz result view model.
 */
export const resolveQuizResultViewForHost = (
  result: QuizResultViewModel,
  hostConfig: QuizHostRuntimeConfig
): QuizResultViewModel => {
  return resolveHostResultView(result, hostConfig.ctas)
}
