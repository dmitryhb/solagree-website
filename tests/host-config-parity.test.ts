import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveCaseQualifierHostConfig } from '../app/data/case-qualifier-host'
import { defaultQuizHostRuntimeConfig, resolveQuizHostConfig } from '../app/data/quiz-host'

// The host defaults exist twice: in nuxt.config.ts runtimeConfig.public and in the app/data host modules.
// This keeps them identical (HIR-735). Only the deployment-driven analytics fields may differ.
// It is a vitest file rather than node:test because the host modules import through the `~` alias.

const loadPublicConfig = async (env: Record<string, string>) => {
  vi.resetModules()
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value)
  vi.stubGlobal('defineNuxtConfig', (config: unknown) => config)
  const { default: config } = await import('../nuxt.config') as { default: { runtimeConfig: { public: Record<string, unknown> } } }
  return config.runtimeConfig.public as {
    solagreeQuiz: Record<string, unknown> & { analytics: Record<string, unknown> }
    solagreeCaseQualifier: Record<string, unknown> & { analytics: Record<string, unknown> }
  }
}

const withoutDeploymentAnalytics = <T extends { analytics: object }>(config: T) => {
  const { enabled: _enabled, trackingId: _trackingId, ...analytics } = config.analytics as Record<string, unknown>
  return { ...config, analytics }
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('host defaults declared in nuxt.config.ts match the host modules', () => {
  it.each([
    ['without a GA measurement ID', { NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: 'dev', NUXT_PUBLIC_GA_MEASUREMENT_ID: '' }],
    ['with a GA measurement ID', { NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: 'dev', NUXT_PUBLIC_GA_MEASUREMENT_ID: 'G-LOCALTEST' }]
  ])('quiz %s', async (_label, env) => {
    const { solagreeQuiz } = await loadPublicConfig(env)
    const resolved = resolveQuizHostConfig(solagreeQuiz as never)
    expect(withoutDeploymentAnalytics(resolved)).toEqual(withoutDeploymentAnalytics(defaultQuizHostRuntimeConfig))
    expect(withoutDeploymentAnalytics(solagreeQuiz as never)).toEqual(withoutDeploymentAnalytics(defaultQuizHostRuntimeConfig))
    expect(resolveQuizHostConfig(undefined)).toEqual(defaultQuizHostRuntimeConfig)
  })

  it.each([
    ['without a GA measurement ID', { NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: 'dev', NUXT_PUBLIC_GA_MEASUREMENT_ID: '' }],
    ['with a GA measurement ID', { NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: 'dev', NUXT_PUBLIC_GA_MEASUREMENT_ID: 'G-LOCALTEST' }]
  ])('case qualifier %s', async (_label, env) => {
    const { solagreeCaseQualifier } = await loadPublicConfig(env)
    // The qualifier module does not export its defaults, so the unconfigured resolution is the reference.
    const defaults = resolveCaseQualifierHostConfig(undefined)
    expect(withoutDeploymentAnalytics(resolveCaseQualifierHostConfig(solagreeCaseQualifier as never))).toEqual(withoutDeploymentAnalytics(defaults))
    expect(withoutDeploymentAnalytics(solagreeCaseQualifier as never)).toEqual(withoutDeploymentAnalytics(defaults))
  })

  it('only the analytics enabled flag and tracking ID follow the deployment', async () => {
    const off = await loadPublicConfig({ NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: 'dev', NUXT_PUBLIC_GA_MEASUREMENT_ID: '' })
    expect(off.solagreeQuiz.analytics).toMatchObject({ enabled: false, namespace: 'solagree.quiz' })
    expect(off.solagreeCaseQualifier.analytics).toMatchObject({ enabled: false, namespace: 'solagree.case_qualifier' })
    const on = await loadPublicConfig({ NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT: 'dev', NUXT_PUBLIC_GA_MEASUREMENT_ID: 'G-LOCALTEST' })
    expect(on.solagreeQuiz.analytics).toMatchObject({ enabled: true, trackingId: 'G-LOCALTEST' })
    expect(on.solagreeCaseQualifier.analytics).toMatchObject({ enabled: true, trackingId: 'G-LOCALTEST' })
  })
})
