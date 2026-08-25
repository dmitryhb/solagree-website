import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createCalComBookingEmbedController,
  type CalComEmbedClient,
  type CalComEmbedListener,
  type CalComEmbedNamespace,
  type CalComEmbedUiOptions
} from '../app/utils/calcom-booking-embed.ts'
import { resolveInitialConsultBookingEvents } from '../shared/initial-consult-booking.ts'

const events = resolveInitialConsultBookingEvents({
  firstAvailableEventPath: 'initial-consults/initial-consult',
  tajEventPath: 'initial-consults/initial-consult-taj',
  stacieEventPath: 'initial-consults/initial-consult-stacie',
  jessicaEventPath: 'initial-consults/initial-consult-jessica',
  jamesEventPath: 'initial-consults/initial-consult-james'
})

if (events.length !== 5) {
  throw new Error('Initial Consult test configuration must resolve booking events.')
}

interface CalComCall {
  method: 'init' | 'on' | 'off' | 'ui' | 'inline'
  namespace?: string
  options: unknown
}

const createEmbedClientSpy = (): {
  calls: CalComCall[]
  listeners: Map<string, CalComEmbedListener[]>
  createClient: () => CalComEmbedClient
} => {
  const calls: CalComCall[] = []
  const listeners = new Map<string, CalComEmbedListener[]>()

  const createClient = (): CalComEmbedClient => {
    const namespaces: Record<string, CalComEmbedNamespace> = {}
    const client = ((method: 'init', namespace: string, options: { origin: string }): void => {
      calls.push({ method, namespace, options })
      const namespaceListeners: CalComEmbedListener[] = []
      listeners.set(namespace, namespaceListeners)

      namespaces[namespace] = ((
        namespaceMethod: 'on' | 'off' | 'ui' | 'inline',
        namespaceOptions: CalComEmbedListener | CalComEmbedUiOptions | { calLink: string }
      ): void => {
        calls.push({ method: namespaceMethod, namespace, options: namespaceOptions })

        if (namespaceMethod === 'on') {
          namespaceListeners.push(namespaceOptions as CalComEmbedListener)
        }
      }) as CalComEmbedNamespace
    }) as CalComEmbedClient

    client.ns = namespaces
    return client
  }

  return { calls, listeners, createClient }
}

test('remounts each Cal.com event once and ignores callbacks from replaced embeds', () => {
  const host = {
    replaceChildrenCalls: 0,
    replaceChildren: (): void => {
      host.replaceChildrenCalls += 1
    }
  } as unknown as HTMLElement
  const cal = createEmbedClientSpy()
  let readyCount = 0
  let failureCount = 0
  const controller = createCalComBookingEmbedController(cal.createClient, {
    onReady: () => { readyCount += 1 },
    onFailed: () => { failureCount += 1 }
  })

  const mounts = events.map(event => {
    const mountId = controller.mount({ event, host, trackingContext: {} })

    return {
      event,
      namespace: `solagree-initial-consult-${event.id}-${mountId}`
    }
  })
  const currentMount = mounts.at(-1)

  if (!currentMount) {
    throw new Error('Initial Consult test configuration must produce a current booking mount.')
  }

  assert.equal(host.replaceChildrenCalls, events.length)
  assert.deepEqual(
    cal.calls.filter(call => call.method === 'init').map(call => call.options),
    events.map(() => ({ origin: 'https://solagree.cal.com' }))
  )
  assert.deepEqual(
    cal.calls.filter(call => call.method === 'ui').map(call => call.options),
    events.map(() => ({ hideEventTypeDetails: false, layout: 'month_view' }))
  )
  assert.deepEqual(
    cal.calls.filter(call => call.method === 'inline').map(call => [call.namespace, (call.options as { calLink: string }).calLink]),
    mounts.map(({ event, namespace }) => [namespace, event.eventPath])
  )
  assert.equal(
    cal.calls.filter(call => call.method === 'inline' && call.namespace === currentMount.namespace).length,
    1
  )
  for (const staleMount of mounts.slice(0, -1)) {
    assert.equal(cal.calls.filter(call => call.method === 'off' && call.namespace === staleMount.namespace).length, 2)

    cal.listeners.get(staleMount.namespace)?.find(listener => listener.action === 'linkReady')?.callback()
    cal.listeners.get(staleMount.namespace)?.find(listener => listener.action === 'linkFailed')?.callback()
  }
  assert.equal(readyCount, 0)
  assert.equal(failureCount, 0)

  cal.listeners.get(currentMount.namespace)?.find(listener => listener.action === 'linkReady')?.callback()
  assert.equal(readyCount, 1)
  assert.equal(failureCount, 0)
})
