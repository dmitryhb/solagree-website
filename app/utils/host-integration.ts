export interface HostAnalyticsOptions {
  enabled: boolean
  namespace: string
  trackingId?: string
}

export interface HostBridgeOptions {
  postMessage: boolean
  targetOrigin?: string
}

export interface HostCtaTargetConfig {
  href: string
  trackingId?: string
  target?: '_self' | '_blank'
  rel?: string
}

export interface HostRuntimeConfig<
  TMode extends string,
  TDisplay extends object,
  TActionId extends string
> {
  hostId: string
  mode: TMode
  display: TDisplay
  analytics: HostAnalyticsOptions
  bridge: HostBridgeOptions
  ctas: Partial<Record<TActionId, HostCtaTargetConfig>>
}

export interface HostConfigInput<
  TMode extends string,
  TDisplay extends object,
  TActionId extends string
> {
  hostId?: string
  mode?: TMode
  display?: Partial<TDisplay>
  analytics?: Partial<HostAnalyticsOptions>
  bridge?: Partial<HostBridgeOptions>
  ctas?: Partial<Record<TActionId, Partial<HostCtaTargetConfig>>>
}

export interface HostEventContext<TMode extends string> {
  hostId: string
  mode: TMode
  sessionId: string
  trackingId?: string
  timestamp: string
}

export interface HostConfigAdapter<
  TMode extends string,
  TDisplay extends object,
  TActionId extends string
> {
  defaults: HostRuntimeConfig<TMode, TDisplay, TActionId>
}

export interface HostDispatchEnvironment {
  isClient: boolean
  isParentWindow: boolean
  postMessage: (message: unknown, targetOrigin: string) => void
}

const getHostDispatchEnvironment = (): HostDispatchEnvironment => {
  if (typeof window === 'undefined') {
    return {
      isClient: false,
      isParentWindow: true,
      postMessage: () => undefined
    }
  }

  return {
    isClient: true,
    isParentWindow: window.parent === window,
    postMessage: (message, targetOrigin) => window.parent.postMessage(message, targetOrigin)
  }
}

const mergeHostCtaTargets = <TActionId extends string>(
  defaults: Partial<Record<TActionId, HostCtaTargetConfig>>,
  overrides?: Partial<Record<TActionId, Partial<HostCtaTargetConfig>>>
): Partial<Record<TActionId, HostCtaTargetConfig>> => {
  return (Object.keys(defaults) as TActionId[]).reduce<Partial<Record<TActionId, HostCtaTargetConfig>>>(
    (targets, actionId) => {
      const target = defaults[actionId]

      if (target) {
        targets[actionId] = {
          ...target,
          ...overrides?.[actionId]
        }
      }

      return targets
    },
    {}
  )
}

/** Merges shared host concerns while leaving domain display and event types distinct. */
export const resolveHostConfig = <
  TMode extends string,
  TDisplay extends object,
  TActionId extends string
>(
  adapter: HostConfigAdapter<TMode, TDisplay, TActionId>,
  runtimeConfig?: HostConfigInput<TMode, TDisplay, TActionId>,
  overrides?: HostConfigInput<TMode, TDisplay, TActionId>
): HostRuntimeConfig<TMode, TDisplay, TActionId> => {
  const { defaults } = adapter

  return {
    hostId: overrides?.hostId ?? runtimeConfig?.hostId ?? defaults.hostId,
    mode: overrides?.mode ?? runtimeConfig?.mode ?? defaults.mode,
    display: {
      ...defaults.display,
      ...runtimeConfig?.display,
      ...overrides?.display
    },
    analytics: {
      enabled: overrides?.analytics?.enabled
        ?? runtimeConfig?.analytics?.enabled
        ?? defaults.analytics.enabled,
      namespace: overrides?.analytics?.namespace
        ?? runtimeConfig?.analytics?.namespace
        ?? defaults.analytics.namespace,
      trackingId: overrides?.analytics?.trackingId
        ?? runtimeConfig?.analytics?.trackingId
        ?? defaults.analytics.trackingId
    },
    bridge: {
      postMessage: overrides?.bridge?.postMessage
        ?? runtimeConfig?.bridge?.postMessage
        ?? defaults.bridge.postMessage,
      targetOrigin: overrides?.bridge?.targetOrigin
        ?? runtimeConfig?.bridge?.targetOrigin
        ?? defaults.bridge.targetOrigin
    },
    ctas: mergeHostCtaTargets(defaults.ctas, {
      ...runtimeConfig?.ctas,
      ...overrides?.ctas
    })
  }
}

/** Applies a host CTA override without coupling either host to the other's result engine. */
export const resolveHostResultView = <
  TActionId extends string,
  TResult extends { primaryCta: HostCtaTargetConfig & { actionId: TActionId } }
>(
  result: TResult,
  ctas: Partial<Record<TActionId, HostCtaTargetConfig>>
): TResult => {
  return {
    ...result,
    primaryCta: {
      ...result.primaryCta,
      ...ctas[result.primaryCta.actionId]
    }
  }
}

export const buildHostEventContext = <TMode extends string>(
  config: Pick<HostRuntimeConfig<TMode, object, string>, 'hostId' | 'mode' | 'analytics'>,
  sessionId: string
): HostEventContext<TMode> => {
  return {
    hostId: config.hostId,
    mode: config.mode,
    sessionId,
    trackingId: config.analytics.trackingId,
    timestamp: new Date().toISOString()
  }
}

export const shouldEmitHostEvents = <TEvent>(
  config: Pick<HostRuntimeConfig<string, object, string>, 'analytics' | 'bridge'>,
  onEvent?: (event: TEvent) => void
): boolean => {
  return config.analytics.enabled || config.bridge.postMessage || typeof onEvent === 'function'
}

/**
 * Returns a normalized, explicit web origin. Wildcards, paths, and non-web
 * protocols are rejected so an enabled iframe bridge cannot broadcast answers.
 */
export const resolveTrustedTargetOrigin = (targetOrigin?: string): string | null => {
  const candidate = targetOrigin?.trim()

  if (!candidate || candidate === '*') {
    return null
  }

  try {
    const url = new URL(candidate)
    const isWebOrigin = url.protocol === 'https:' || url.protocol === 'http:'
    const isOriginOnly = url.pathname === '/' && !url.search && !url.hash && !url.username && !url.password

    return isWebOrigin && isOriginOnly && url.origin !== 'null' ? url.origin : null
  } catch {
    return null
  }
}

/** Delivers one domain event to its callback and, when safe, its iframe parent. */
export const dispatchHostEvent = <TEvent>(
  event: TEvent,
  config: Pick<HostRuntimeConfig<string, object, string>, 'analytics' | 'bridge'>,
  onEvent?: (event: TEvent) => void,
  environment: HostDispatchEnvironment = getHostDispatchEnvironment()
): void => {
  if (!environment.isClient) {
    return
  }

  onEvent?.(event)

  const targetOrigin = config.bridge.postMessage
    ? resolveTrustedTargetOrigin(config.bridge.targetOrigin)
    : null

  if (!targetOrigin || environment.isParentWindow) {
    return
  }

  environment.postMessage(
    {
      source: config.analytics.namespace,
      payload: event
    },
    targetOrigin
  )
}
