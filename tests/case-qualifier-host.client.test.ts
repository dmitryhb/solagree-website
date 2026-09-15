import { defineComponent, h, nextTick, ref } from 'vue'
import * as Vue from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCaseQualifierHost } from '../app/composables/useCaseQualifierHost'
import { useCaseQualifierSession } from '../app/composables/useCaseQualifierSession'
import type { CaseQualifierHostEvent } from '../app/data/case-qualifier-types'

const describeClient = typeof window !== 'undefined' ? describe : describe.skip
const trackEventMock = vi.fn()

Object.assign(globalThis, {
  ...Vue,
  useGoogleAnalytics: () => ({ trackEvent: trackEventMock }),
  useRuntimeConfig: () => ({
    public: {
      solagreeCaseQualifier: {
        analytics: { enabled: true }
      }
    }
  })
})

beforeEach(() => {
  window.localStorage.clear()
  trackEventMock.mockReset()
})

afterEach(() => {
  window.localStorage.clear()
})

describeClient('case qualifier host lifecycle', () => {
  it('preserves qualifier callback event names and payloads', async () => {
    const events: CaseQualifierHostEvent[] = []
    let host: ReturnType<typeof useCaseQualifierHost> | undefined
    const wrapper = mount(defineComponent({
      setup() {
        const session = useCaseQualifierSession()
        host = useCaseQualifierHost(session, { onEvent: event => events.push(event) })

        return () => h('div')
      }
    }))

    await nextTick()
    host!.handleCriterionChange('simple-estate', true)

    expect(events.map(event => event.type)).toEqual([
      'started',
      'criterion_toggled',
      'completed',
      'outcome_changed'
    ])
    expect(events.find(event => event.type === 'criterion_toggled')).toMatchObject({
      criterionId: 'simple-estate',
      selected: true,
      score: 1
    })
    expect(events.find(event => event.type === 'completed')).toMatchObject({
      outcome: 'possible-fit',
      score: 1
    })

    host!.handleReset()
    expect(events.at(-1)).toMatchObject({ type: 'reset' })
    wrapper.unmount()
  })

  it('restores qualifier state without acquiring quiz-style restore completion events', async () => {
    const restoredSession = {
      selectedCriterionIds: ref([
        'simple-estate',
        'budget-constraints',
        'financial-transparency'
      ]),
      hasRestoredPersistedState: ref(true),
      score: ref(3),
      outcome: ref('possible-fit'),
      progressValue: ref(25),
      resultView: ref(null),
      setCriterionSelected: vi.fn(),
      reset: vi.fn()
    } as unknown as ReturnType<typeof useCaseQualifierSession>

    const events: CaseQualifierHostEvent[] = []
    const wrapper = mount(defineComponent({
      setup() {
        useCaseQualifierHost(restoredSession, { onEvent: event => events.push(event) })

        return () => h('div')
      }
    }))

    await nextTick()
    await nextTick()

    expect(events).toEqual([])
    expect(trackEventMock).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
