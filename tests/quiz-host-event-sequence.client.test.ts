import { defineComponent, h, nextTick } from 'vue'
import * as Vue from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { solagreeQuizStorageKey } from '../app/data/quiz'
import type { QuizHostEvent } from '../app/data/quiz-types'
import { useQuizHost } from '../app/composables/useQuizHost'
import { useQuizSession } from '../app/composables/useQuizSession'

const describeClient = typeof window !== 'undefined' ? describe : describe.skip

/** One ordered log shared by Google Analytics calls (`ga:`) and host callback events (`host:`). */
const log: string[] = []
const describeHost = (event: QuizHostEvent) => {
  const detail = 'questionId' in event
    ? event.questionId
    : 'fromQuestionId' in event ? `${event.fromQuestionId}->${event.toQuestionId}` : 'outcome' in event ? event.outcome : ''
  return `host:${event.type}${detail ? `:${detail}` : ''}`
}
const trackEvent = vi.fn((name: string, params?: Record<string, unknown>) => {
  const detail = params?.question_id ?? params?.outcome
  log.push(`ga:${name}${detail ? `:${String(detail)}` : ''}`)
})

Object.assign(globalThis, {
  ...Vue,
  useGoogleAnalytics: () => ({ trackEvent }),
  useRuntimeConfig: () => ({ public: { solagreeQuiz: { analytics: { enabled: true } } } })
})

type QuizSession = ReturnType<typeof useQuizSession>
type QuizHost = ReturnType<typeof useQuizHost>

const answers = {
  state: 'NC',
  children: 'no',
  financialScreener: 'no',
  spouseContact: 'cannot-find',
  legalAdvice: 'no',
  paymentReadiness: 'ready-now'
} as const

const harness = () => {
  let session: QuizSession
  let host: QuizHost
  const wrapper = mount(defineComponent({
    setup() {
      session = useQuizSession()
      host = useQuizHost(session, { onEvent: event => log.push(describeHost(event)) })
      return () => h('div')
    }
  }))
  return { host: host!, session: session!, wrapper }
}

const answerAll = async (host: QuizHost, from = 0) => {
  for (const [questionId, value] of Object.entries(answers).slice(from)) {
    host.handleSingleAnswer(questionId as keyof typeof answers, value)
    host.handleAdvance()
    await nextTick()
  }
}

beforeEach(() => {
  window.localStorage.clear()
  log.length = 0
  trackEvent.mockClear()
})
afterEach(() => { window.localStorage.clear() })

describeClient('quiz host and Google Analytics event order', () => {
  it('fresh start emits only the first question view', async () => {
    const { wrapper } = harness()
    await nextTick()
    expect(log).toEqual(['host:question_viewed:state'])
    wrapper.unmount()
  })

  it('answering every question emits the full ordered GA and host sequence', async () => {
    const { host, wrapper } = harness()
    await nextTick()
    await answerAll(host)
    expect(log).toEqual([
      'host:question_viewed:state',
      'ga:quiz_started:state',
      'host:question_answered:state',
      'host:progressed:state->children',
      'host:question_viewed:children',
      'host:question_answered:children',
      'host:progressed:children->financialScreener',
      'host:question_viewed:financialScreener',
      'host:question_answered:financialScreener',
      'host:progressed:financialScreener->spouseContact',
      'host:question_viewed:spouseContact',
      'host:question_answered:spouseContact',
      'host:progressed:spouseContact->legalAdvice',
      'host:question_viewed:legalAdvice',
      'host:question_answered:legalAdvice',
      'host:progressed:legalAdvice->paymentReadiness',
      'host:question_viewed:paymentReadiness',
      'host:question_answered:paymentReadiness',
      'host:progressed:paymentReadiness->result',
      'host:completed:solagree-fit',
      'ga:quiz_completed:solagree-fit'
    ])
    wrapper.unmount()
  })

  // Pinned current behavior: a restored question is not re-viewed, and GA `quiz_started` fires at the first live answer
  // (carrying the restored question id) even though the attempt began before the reload.
  it('restoring mid-quiz stays silent, then continues with live events only', async () => {
    window.localStorage.setItem(solagreeQuizStorageKey, JSON.stringify({
      version: 2, phase: 'question', currentQuestionId: 'spouseContact',
      answers: { state: 'NC', children: 'no', financialScreener: 'no' }
    }))
    const { host, wrapper } = harness()
    await nextTick()
    await nextTick()
    const restored = [...log]
    log.length = 0
    await answerAll(host, 3)
    expect(restored).toEqual([])
    expect(log).toEqual([
      'ga:quiz_started:spouseContact',
      'host:question_answered:spouseContact',
      'host:progressed:spouseContact->legalAdvice',
      'host:question_viewed:legalAdvice',
      'host:question_answered:legalAdvice',
      'host:progressed:legalAdvice->paymentReadiness',
      'host:question_viewed:paymentReadiness',
      'host:question_answered:paymentReadiness',
      'host:progressed:paymentReadiness->result',
      'host:completed:solagree-fit',
      'ga:quiz_completed:solagree-fit'
    ])
    wrapper.unmount()
  })

  it('restoring a result stays silent (no completion), then only the CTA events fire', async () => {
    window.localStorage.setItem(solagreeQuizStorageKey, JSON.stringify({
      version: 2, phase: 'result', currentQuestionId: 'paymentReadiness', answers
    }))
    const { host, wrapper } = harness()
    await nextTick()
    await nextTick()
    const restored = [...log]
    host.handleResultCtaClick(host.resolvedResultView.value!.primaryCta)
    expect(restored).toEqual([])
    expect(log).toEqual(['host:cta_clicked:solagree-fit', 'ga:quiz_cta_clicked:solagree-fit'])
    wrapper.unmount()
  })

  it('reset after a completed attempt emits reset events, a fresh first view and a new start', async () => {
    const { host, wrapper } = harness()
    await nextTick()
    await answerAll(host)
    log.length = 0
    host.handleReset()
    await nextTick()
    const afterReset = [...log]
    log.length = 0
    host.handleSingleAnswer('state', 'NC')
    host.handleAdvance()
    await nextTick()
    expect(afterReset).toEqual(['host:reset', 'ga:quiz_reset', 'host:question_viewed:state'])
    expect(log).toEqual([
      'ga:quiz_started:state',
      'host:question_answered:state',
      'host:progressed:state->children',
      'host:question_viewed:children'
    ])
    wrapper.unmount()
  })
})
