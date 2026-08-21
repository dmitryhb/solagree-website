import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import test from 'node:test'
import {
  createCalComBookingEmbedController,
  type CalComEmbedClient,
  type CalComEmbedListener,
  type CalComEmbedNamespace
} from '../app/utils/calcom-booking-embed.ts'
import { resolveInitialConsultBookingEvents } from '../shared/initial-consult-booking.ts'

const events = resolveInitialConsultBookingEvents({
  firstAvailableEventPath: 'solagree/initial-consults/initial-consult',
  tajEventPath: 'solagree/initial-consults/initial-consult-taj',
  stacieEventPath: 'solagree/initial-consults/initial-consult-stacie',
  jessicaEventPath: 'solagree/initial-consults/initial-consult-jessica',
  jamesEventPath: 'solagree/initial-consults/initial-consult-james'
})

const firstEvent = events[0]
const tajEvent = events[1]

if (!firstEvent || !tajEvent) {
  throw new Error('Initial Consult test configuration must resolve booking events.')
}

interface CalComCall {
  method: 'init' | 'on' | 'off' | 'inline'
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
        namespaceMethod: 'on' | 'off' | 'inline',
        namespaceOptions: CalComEmbedListener | { calLink: string }
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

test('remounts exactly one current Cal.com iframe when a selector option changes', () => {
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

  const firstMountId = controller.mount({ event: firstEvent, host, trackingContext: {} })
  const firstNamespace = `solagree-initial-consult-${firstEvent.id}-${firstMountId}`
  const secondMountId = controller.mount({ event: tajEvent, host, trackingContext: {} })
  const secondNamespace = `solagree-initial-consult-${tajEvent.id}-${secondMountId}`

  assert.equal(host.replaceChildrenCalls, 2)
  assert.deepEqual(
    cal.calls.filter(call => call.method === 'inline').map(call => [call.namespace, (call.options as { calLink: string }).calLink]),
    [
      [firstNamespace, firstEvent.eventPath],
      [secondNamespace, tajEvent.eventPath]
    ]
  )
  assert.equal(cal.calls.filter(call => call.method === 'off' && call.namespace === firstNamespace).length, 2)
  assert.equal(cal.calls.filter(call => call.method === 'inline' && call.namespace === secondNamespace).length, 1)

  cal.listeners.get(firstNamespace)?.find(listener => listener.action === 'linkReady')?.callback()
  cal.listeners.get(firstNamespace)?.find(listener => listener.action === 'linkFailed')?.callback()
  assert.equal(readyCount, 0)
  assert.equal(failureCount, 0)

  cal.listeners.get(secondNamespace)?.find(listener => listener.action === 'linkReady')?.callback()
  assert.equal(readyCount, 1)
  assert.equal(failureCount, 0)
})

test('connects a consultant selector choice to a keyed booking embed remount', async () => {
  const pageSource = await readFile(resolve('app/components/consult/InitialConsultBookingPage.vue'), 'utf8')
  const selectorSource = await readFile(resolve('app/components/consult/ConsultantSelector.vue'), 'utf8')

  assert.match(selectorSource, /@click="selectOption\(event\.id\)"/)
  assert.match(pageSource, /@select="handleSelection"/)
  assert.match(pageSource, /:key="selectedEvent\.id"/)
  assert.match(pageSource, /:event="selectedEvent"/)
})
