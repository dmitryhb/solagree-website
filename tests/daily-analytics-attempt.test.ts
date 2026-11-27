import { defineComponent, h, nextTick } from 'vue'
import * as Vue from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDailyAnalyticsAttempt } from '../app/composables/useDailyAnalyticsAttempt'
import type { AttemptEvent } from '../app/utils/analytics-attempt'

// `import.meta.client` is a Nuxt compile flag; it only exists in the client-flag vitest config
// (vitest.analytics-client.config.ts). The default run skips this file instead of testing the disabled SSR branch.
const describeClient = import.meta.client ? describe : describe.skip

interface Pending { event: AttemptEvent, context: unknown }

const quizKey = 'solagree.analytics.pending.v1:quiz'
const qualifierKey = 'solagree.analytics.pending.v1:qualifier'
const runtimeConfig = { public: { analyticsCaptureEnabled: true, portalApiBaseUrl: 'https://portal.example.test/' } }
const fetchMock = vi.fn()
const marketingContext = { journeyId: '123e4567-e89b-42d3-a456-426614174000', proof: 'a'.repeat(64) }

Object.assign(globalThis, {
  ...Vue,
  useRuntimeConfig: () => runtimeConfig,
  $fetch: fetchMock
})

const settle = async () => { await nextTick(); await new Promise(resolve => setTimeout(resolve, 0)) }
const readQueue = (key = quizKey): Pending[] => JSON.parse(window.localStorage.getItem(key) ?? '[]')
const event = (eventId: string, instrument: 'quiz' | 'qualifier' = 'quiz'): AttemptEvent => ({
  eventId,
  attemptId: 'attempt-1',
  instrument,
  schemaVersion: 1,
  type: 'started',
  occurredAt: '2026-01-01T00:00:00.000Z',
  outcome: null,
  action: null
})

const mountCapture = (instrument: 'quiz' | 'qualifier' = 'quiz', enabled: () => boolean = () => true) => {
  let capture: ReturnType<typeof useDailyAnalyticsAttempt>
  const wrapper = mount(defineComponent({
    setup() {
      capture = useDailyAnalyticsAttempt(instrument, enabled)
      return () => h('div')
    }
  }))
  return { capture: capture!, wrapper }
}

beforeEach(() => {
  window.localStorage.clear()
  fetchMock.mockReset()
  fetchMock.mockResolvedValue({ accepted: true })
  runtimeConfig.public.analyticsCaptureEnabled = true
})
afterEach(() => { window.localStorage.clear() })

describeClient('useDailyAnalyticsAttempt retry queue', () => {
  it('keeps at most the newest 100 queued events when delivery keeps failing', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    const { capture, wrapper } = mountCapture()
    await settle()
    const seen: string[] = []
    for (let i = 0; i < 120; i++) {
      capture.reset()
      capture.mutate()
      await settle()
      for (const { event: queued } of readQueue()) if (!seen.includes(queued.eventId)) seen.push(queued.eventId)
    }
    const queue = readQueue()
    expect(seen.length).toBeGreaterThan(100)
    expect(queue).toHaveLength(100)
    expect(queue.map(p => p.event.eventId)).toEqual(seen.slice(-100))
    wrapper.unmount()
  })

  it('retains the exact queued event and context when $fetch fails, then retries it on the next mount', async () => {
    window.localStorage.setItem('solagree-marketing-origin-v1', JSON.stringify({ context: marketingContext, expiresAt: '2099-01-01T00:00:00.000Z' }))
    fetchMock.mockRejectedValueOnce(new Error('offline'))
    const first = mountCapture()
    await settle()
    first.capture.mutate()
    await settle()
    const queued = readQueue()
    expect(queued).toHaveLength(1)
    expect(queued[0]!.context).toEqual(marketingContext)
    expect(queued[0]!.event).toMatchObject({ instrument: 'quiz', type: 'started' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    first.wrapper.unmount()

    const second = mountCapture()
    await settle()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1]![1].body).toEqual(queued[0])
    expect(readQueue()).toEqual([])
    second.wrapper.unmount()
  })

  it('posts to the normalized capture endpoint and removes only the delivered event by eventId, oldest first', async () => {
    window.localStorage.setItem(quizKey, JSON.stringify([
      { event: event('a'), context: null },
      { event: event('b'), context: null },
      { event: event('c'), context: null }
    ]))
    const { wrapper } = mountCapture()
    await settle()
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(Array(3).fill('https://portal.example.test/api/analytics/capture'))
    expect(fetchMock.mock.calls.map(([, options]) => options.body.event.eventId)).toEqual(['a', 'b', 'c'])
    expect(fetchMock.mock.calls[0]![1]).toMatchObject({ method: 'POST', keepalive: true })
    expect(readQueue()).toEqual([])
    wrapper.unmount()
  })

  it('keeps an event appended while an earlier one is in flight', async () => {
    window.localStorage.setItem(quizKey, JSON.stringify([{ event: event('a'), context: null }]))
    let appended = false
    fetchMock.mockImplementation(async () => {
      if (!appended) {
        appended = true
        window.localStorage.setItem(quizKey, JSON.stringify([...readQueue(), { event: event('late'), context: null }]))
      }
      return { accepted: true }
    })
    const { wrapper } = mountCapture()
    await settle()
    expect(fetchMock.mock.calls.map(([, options]) => options.body.event.eventId)).toEqual(['a', 'late'])
    expect(readQueue()).toEqual([])
    wrapper.unmount()
  })

  it('stops at the first failure and leaves later events queued in order', async () => {
    window.localStorage.setItem(quizKey, JSON.stringify([
      { event: event('a'), context: null },
      { event: event('b'), context: null }
    ]))
    fetchMock.mockResolvedValueOnce({ accepted: true }).mockRejectedValueOnce(new Error('offline'))
    const { wrapper } = mountCapture()
    await settle()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(readQueue().map(p => p.event.eventId)).toEqual(['b'])
    wrapper.unmount()
  })

  it('only reads and sends events of its own instrument and ignores malformed entries', async () => {
    window.localStorage.setItem(quizKey, JSON.stringify([
      { event: event('other', 'qualifier'), context: null },
      null,
      'junk',
      { event: null },
      { event: event('mine'), context: null }
    ]))
    window.localStorage.setItem(qualifierKey, JSON.stringify([{ event: event('q1', 'qualifier'), context: null }]))
    const { wrapper } = mountCapture('quiz')
    await settle()
    expect(fetchMock.mock.calls.map(([, options]) => options.body.event.eventId)).toEqual(['mine'])
    expect(readQueue(qualifierKey).map(p => p.event.eventId)).toEqual(['q1'])
    wrapper.unmount()
  })

  it('treats a damaged queue as empty', async () => {
    window.localStorage.setItem(quizKey, '{not json')
    const { wrapper } = mountCapture()
    await settle()
    expect(fetchMock).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('does nothing when capture is disabled by runtime config or by the host setting', async () => {
    window.localStorage.setItem(quizKey, JSON.stringify([{ event: event('a'), context: null }]))
    runtimeConfig.public.analyticsCaptureEnabled = false
    const off = mountCapture()
    await settle()
    off.capture.restore(false)
    off.capture.mutate()
    await settle()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(readQueue().map(p => p.event.eventId)).toEqual(['a'])
    off.wrapper.unmount()

    runtimeConfig.public.analyticsCaptureEnabled = true
    const hostOff = mountCapture('quiz', () => false)
    await settle()
    hostOff.capture.mutate()
    await settle()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(readQueue().map(p => p.event.eventId)).toEqual(['a'])
    hostOff.wrapper.unmount()
  })
})
