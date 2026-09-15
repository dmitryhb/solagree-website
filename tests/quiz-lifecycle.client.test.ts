import { defineComponent, h, nextTick } from 'vue'
import * as Vue from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { solagreeQuizStorageKey } from '../app/data/quiz'
import type { QuizHostEvent } from '../app/data/quiz-types'
import { useQuizHost } from '../app/composables/useQuizHost'
import { useQuizSession } from '../app/composables/useQuizSession'

const describeClient = typeof window !== 'undefined' ? describe : describe.skip
const trackEventMock = vi.fn()

Object.assign(globalThis, {
  ...Vue,
  useGoogleAnalytics: () => ({ trackEvent: trackEventMock }),
  useRuntimeConfig: () => ({
    public: {
      solagreeQuiz: {
        analytics: { enabled: true }
      }
    }
  })
})

type QuizSession = ReturnType<typeof useQuizSession>
type QuizHost = ReturnType<typeof useQuizHost>

const createQuizHarness = () => {
  const events: QuizHostEvent[] = []
  let session: QuizSession | undefined
  let host: QuizHost | undefined
  const wrapper = mount(defineComponent({
    setup() {
      session = useQuizSession()
      host = useQuizHost(session, { onEvent: event => events.push(event) })

      return () => h('div')
    }
  }))

  return {
    events,
    host: host!,
    session: session!,
    wrapper
  }
}

const finishVisibleBranch = async (host: QuizHost, session: QuizSession) => {
  const answers = {
    state: 'NC',
    children: 'no',
    financialScreener: 'no',
    spouseContact: 'cannot-find',
    legalAdvice: 'no',
    paymentReadiness: 'ready-now'
  } as const

  for (const [questionId, answer] of Object.entries(answers)) {
    host.handleSingleAnswer(questionId as keyof typeof answers, answer)
    host.handleAdvance()
    await nextTick()
  }

  expect(session.phase.value).toBe('result')
}

beforeEach(() => {
  window.localStorage.clear()
  trackEventMock.mockReset()
})

afterEach(() => {
  window.localStorage.clear()
})

describeClient('quiz lifecycle in the client branch', () => {
  it('keeps storage empty after reset and after Vue watchers flush', async () => {
    const { host, session, wrapper } = createQuizHarness()

    await nextTick()
    host.handleSingleAnswer('state', 'NC')
    await nextTick()
    expect(window.localStorage.getItem(solagreeQuizStorageKey)).not.toBeNull()

    host.handleReset()
    await nextTick()

    expect(session.answers.value).toEqual({})
    expect(window.localStorage.getItem(solagreeQuizStorageKey)).toBeNull()
    expect(trackEventMock).toHaveBeenCalledWith('quiz_reset', expect.objectContaining({
      host_id: 'solagree-quiz'
    }))
    wrapper.unmount()
  })

  it('removes malformed snapshots on mount', async () => {
    window.localStorage.setItem(solagreeQuizStorageKey, JSON.stringify({
      version: 99,
      phase: 'question',
      currentQuestionId: 'state',
      answers: {}
    }))

    const { session, wrapper } = createQuizHarness()
    await nextTick()

    expect(session.didRestorePersistedState.value).toBe(false)
    expect(window.localStorage.getItem(solagreeQuizStorageKey)).toBeNull()
    wrapper.unmount()
  })

  it('restores known v1 state as the normalized v2 snapshot', async () => {
    window.localStorage.setItem(solagreeQuizStorageKey, JSON.stringify({
      version: 1,
      phase: 'complete',
      currentQuestionId: 'legacy-question',
      answers: {
        state: 'NC',
        children: 'no',
        parentingScreener: 'yes',
        legacyQuestion: 'legacy-answer'
      }
    }))

    const { session, wrapper } = createQuizHarness()
    await nextTick()
    await nextTick()

    expect(session.phase.value).toBe('result')
    expect(session.answers.value).toEqual({ state: 'NC', children: 'no' })
    expect(JSON.parse(window.localStorage.getItem(solagreeQuizStorageKey)!)).toMatchObject({
      version: 2,
      phase: 'result',
      currentQuestionId: 'state',
      answers: { state: 'NC', children: 'no' }
    })
    wrapper.unmount()
  })

  it('does not emit completion or an initial question view when restoring a result', async () => {
    window.localStorage.setItem(solagreeQuizStorageKey, JSON.stringify({
      version: 2,
      phase: 'result',
      currentQuestionId: 'paymentReadiness',
      answers: {
        state: 'NC',
        children: 'no',
        financialScreener: 'no',
        spouseContact: 'cannot-find',
        legalAdvice: 'no',
        paymentReadiness: 'ready-now'
      }
    }))

    const { events, session, wrapper } = createQuizHarness()
    await nextTick()

    expect(session.phase.value).toBe('result')
    expect(events).toEqual([])
    expect(trackEventMock).not.toHaveBeenCalledWith('quiz_completed', expect.anything())
    wrapper.unmount()
  })

  it('emits one completion per attempt, preserves callback events, and tracks reset and result CTAs', async () => {
    const { events, host, session, wrapper } = createQuizHarness()
    await nextTick()

    await finishVisibleBranch(host, session)
    expect(events.filter(event => event.type === 'completed')).toHaveLength(1)
    expect(trackEventMock.mock.calls.filter(([name]) => name === 'quiz_completed')).toHaveLength(1)

    host.handleBack()
    host.handleAdvance()
    await nextTick()
    expect(events.filter(event => event.type === 'completed')).toHaveLength(1)

    host.handleResultCtaClick(host.resolvedResultView.value!.primaryCta)
    expect(events.find(event => event.type === 'cta_clicked')).toMatchObject({
      actionId: 'solagree-consult',
      href: '/book-a-solagree-consult',
      outcome: 'solagree-fit'
    })
    expect(trackEventMock).toHaveBeenCalledWith('quiz_cta_clicked', expect.objectContaining({
      action_id: 'solagree-consult',
      outcome: 'solagree-fit'
    }))

    host.handleReset()
    await nextTick()
    await finishVisibleBranch(host, session)

    expect(events.filter(event => event.type === 'completed')).toHaveLength(2)
    expect(trackEventMock.mock.calls.filter(([name]) => name === 'quiz_completed')).toHaveLength(2)
    expect(events.find(event => event.type === 'reset')).toMatchObject({ type: 'reset' })
    wrapper.unmount()
  })
})
