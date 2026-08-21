import type {
  InitialConsultBookingEvent,
  InitialConsultBookingTrackingContext
} from '#shared/initial-consult-booking'

/** Cal.com listener registration used by the inline booking embed. */
export interface CalComEmbedListener {
  action: 'linkReady' | 'linkFailed'
  callback: () => void
}

/** Cal.com inline configuration for one Initial Consult booking option. */
export interface CalComEmbedInlineOptions {
  calLink: string
  elementOrSelector: HTMLElement
  config: InitialConsultBookingTrackingContext
}

/** Minimal Cal.com namespace API required to render and clean up an inline booking embed. */
export interface CalComEmbedNamespace {
  (method: 'on' | 'off', options: CalComEmbedListener): void
  (method: 'inline', options: CalComEmbedInlineOptions): void
}

/** Minimal Cal.com client API required to initialize a namespaced inline booking embed. */
export interface CalComEmbedClient {
  (method: 'init', namespace: string, options: { origin: string }): void
  ns: Record<string, CalComEmbedNamespace | undefined>
}

/** Creates a Cal.com client, allowing the embed lifecycle to be verified without loading Cal.com. */
export type CreateCalComEmbedClient = () => CalComEmbedClient

/** Dependencies notified only for callbacks from the current Cal.com embed mount. */
export interface CalComBookingEmbedCallbacks {
  onReady: () => void
  onFailed: () => void
}

/** Coordinates a single active Cal.com iframe and prevents stale provider callbacks after a selection change. */
export interface CalComBookingEmbedController {
  mount: (options: {
    event: InitialConsultBookingEvent
    host: HTMLElement
    trackingContext: InitialConsultBookingTrackingContext
  }) => number
  isActive: (mountId: number) => boolean
  unmount: () => void
}

/**
 * Creates a controller that clears and detaches the previous Cal.com iframe before mounting a new event.
 * Provider callbacks from superseded mounts are ignored, so an old iframe cannot overwrite current UI state.
 */
export const createCalComBookingEmbedController = (
  createClient: CreateCalComEmbedClient,
  callbacks: CalComBookingEmbedCallbacks
): CalComBookingEmbedController => {
  let activeMountId = 0
  let detachListeners: (() => void) | undefined

  const unmount = (): void => {
    activeMountId += 1
    detachListeners?.()
    detachListeners = undefined
  }

  const mount = ({ event, host, trackingContext }: {
    event: InitialConsultBookingEvent
    host: HTMLElement
    trackingContext: InitialConsultBookingTrackingContext
  }): number => {
    unmount()
    host.replaceChildren()

    const mountId = activeMountId
    const client = createClient()
    const namespace = `solagree-initial-consult-${event.id}-${mountId}`

    client('init', namespace, { origin: 'https://cal.com' })

    const namespacedClient = client.ns[namespace]

    if (!namespacedClient) {
      throw new Error('Cal.com did not initialize the booking namespace.')
    }

    const notifyReady = (): void => {
      if (mountId === activeMountId) {
        callbacks.onReady()
      }
    }
    const notifyFailed = (): void => {
      if (mountId === activeMountId) {
        callbacks.onFailed()
      }
    }

    namespacedClient('on', { action: 'linkReady', callback: notifyReady })
    namespacedClient('on', { action: 'linkFailed', callback: notifyFailed })
    detachListeners = () => {
      namespacedClient('off', { action: 'linkReady', callback: notifyReady })
      namespacedClient('off', { action: 'linkFailed', callback: notifyFailed })
    }
    namespacedClient('inline', {
      calLink: event.eventPath,
      elementOrSelector: host,
      config: trackingContext
    })

    return mountId
  }

  const isActive = (mountId: number): boolean => mountId === activeMountId

  return { mount, isActive, unmount }
}
