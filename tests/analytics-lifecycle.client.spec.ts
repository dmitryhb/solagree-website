import { defineComponent, h, nextTick } from 'vue'
import * as Vue from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useQuizHost } from '../app/composables/useQuizHost'
import { useQuizSession } from '../app/composables/useQuizSession'
import { solagreeQuizStorageKey } from '../app/data/quiz'
import type { AttemptEvent } from '../app/utils/analytics-attempt'

const sent: AttemptEvent[] = []
Object.assign(globalThis, {
  ...Vue,
  useGoogleAnalytics: () => ({ trackEvent: vi.fn() }),
  useRuntimeConfig: () => ({ public: { analyticsCaptureEnabled: true, portalApiBaseUrl: 'https://portal.example.test', solagreeQuiz: { analytics: { enabled: true } } } }),
  $fetch: async (_: string, options: { body: { event: AttemptEvent } }) => { sent.push(options.body.event); return { accepted: true } }
})
const settle = async () => { await nextTick(); await new Promise(resolve => setTimeout(resolve, 0)) }
const harness = () => {
  let session: ReturnType<typeof useQuizSession>
  let host: ReturnType<typeof useQuizHost>
  const wrapper = mount(defineComponent({ setup() { session = useQuizSession(); host = useQuizHost(session); return () => h('div') } }))
  return { session: session!, host: host!, wrapper }
}
const answers = { state: 'NC', children: 'no', financialScreener: 'no', spouseContact: 'cannot-find', legalAdvice: 'no', paymentReadiness: 'ready-now' } as const
const finish = async (host: ReturnType<typeof useQuizHost>) => {
  for (const [question, value] of Object.entries(answers)) { host.handleSingleAnswer(question as keyof typeof answers, value); host.handleAdvance(); await settle() }
}
beforeEach(() => { localStorage.clear(); sent.length = 0 })
afterEach(() => { localStorage.clear() })
describe('real client quiz capture lifecycle', () => {
  it('does not create a new cohort from a completed legacy result revisit, edits or reload, then captures a real Reset attempt once', async () => {
    expect(import.meta.client).toBe(true)
    localStorage.setItem(solagreeQuizStorageKey, JSON.stringify({ version: 2, phase: 'result', currentQuestionId: 'paymentReadiness', answers, hasCompletedAttempt: true }))
    let current = harness()
    await settle()
    expect(current.session.phase.value).toBe('result')
    current.host.handleBack(); await settle(); current.host.handleAdvance(); await settle()
    expect(sent).toEqual([])
    current.host.handleBack(); current.host.handleSingleAnswer('paymentReadiness', 'need-payment-plan'); current.host.handleAdvance(); await settle()
    current.wrapper.unmount()
    current = harness(); await settle(); current.host.handleBack(); current.host.handleAdvance(); await settle()
    expect(sent).toEqual([])
    current.host.handleReset(); await settle(); await finish(current.host)
    expect(sent.map(e => e.type)).toEqual(['started', 'result'])
    current.host.handleBack(); current.host.handleAdvance(); await settle()
    expect(sent.filter(e => e.type === 'result')).toHaveLength(1)
    current.wrapper.unmount()
  })
  it('records the first explicit completion of a partial legacy attempt without inventing its start', async () => {
    localStorage.setItem(solagreeQuizStorageKey, JSON.stringify({ version: 2, phase: 'question', currentQuestionId: 'state', answers: { state: 'NC' } }))
    const current = harness(); await settle(); await finish(current.host)
    expect(sent.map(e => e.type)).toEqual(['result'])
    current.wrapper.unmount()
  })
})
