import { describe, expect, it, vi } from 'vitest'
import {
  resolveCaseQualifierHostConfig,
  resolveCaseQualifierResultViewForHost
} from '../app/data/case-qualifier-host'
import type {
  CaseQualifierHostEvent,
  CaseQualifierResultViewModel
} from '../app/data/case-qualifier-types'
import {
  resolveQuizHostConfig,
  resolveQuizResultViewForHost
} from '../app/data/quiz-host'
import type { QuizHostEvent, QuizResultViewModel } from '../app/data/quiz-types'
import {
  buildHostEventContext,
  dispatchHostEvent,
  resolveTrustedTargetOrigin
} from '../app/utils/host-integration'

describe('shared host configuration adapters', () => {
  it('merges quiz host defaults, runtime config, overrides, and CTA targets', () => {
    const config = resolveQuizHostConfig(
      {
        hostId: 'runtime-quiz',
        display: { showExplainer: false },
        analytics: { trackingId: 'runtime-tracking' },
        bridge: {
          postMessage: true,
          targetOrigin: 'https://runtime.example'
        },
        ctas: {
          'solagree-consult': {
            target: '_blank',
            rel: 'noopener'
          }
        }
      },
      {
        mode: 'embedded',
        display: { showShellHeader: false },
        bridge: { targetOrigin: 'https://partner.example' },
        ctas: {
          'solagree-consult': {
            href: 'https://partner.example/consult'
          }
        }
      }
    )

    expect(config).toEqual({
      hostId: 'runtime-quiz',
      mode: 'embedded',
      display: {
        showShellHeader: false,
        showExplainer: false
      },
      analytics: {
        enabled: true,
        namespace: 'solagree.quiz',
        trackingId: 'runtime-tracking'
      },
      bridge: {
        postMessage: true,
        targetOrigin: 'https://partner.example'
      },
      ctas: {
        'solagree-consult': {
          href: 'https://partner.example/consult'
        }
      }
    })
  })

  it('keeps qualifier display and CTA contracts distinct', () => {
    const config = resolveCaseQualifierHostConfig(undefined, {
      mode: 'embedded',
      display: {
        showShellHeader: false,
        headingLevel: 2
      },
      ctas: {
        'solagree-consult': {
          href: '/partner-consult',
          trackingId: 'qualifier-cta'
        }
      }
    })

    expect(config.display).toEqual({
      showShellHeader: false,
      showInstructions: true,
      headingLevel: 2
    })
    expect(config.ctas['solagree-consult']).toEqual({
      href: '/partner-consult',
      trackingId: 'qualifier-cta'
    })
    expect(config.bridge).toEqual({
      postMessage: false,
      targetOrigin: undefined
    })
  })

  it('resolves result CTAs through the common implementation', () => {
    const quizResult: QuizResultViewModel = {
      eyebrow: 'Result',
      title: 'Quiz result',
      body: 'Body',
      primaryCta: {
        actionId: 'solagree-consult',
        label: 'Book',
        href: '/original'
      },
      resetLabel: 'Reset'
    }
    const qualifierResult: CaseQualifierResultViewModel = {
      outcome: 'good-fit',
      gaugeLabel: 'Good fit',
      title: 'Qualifier result',
      body: 'Body',
      actionLabel: 'Book',
      tone: 'good',
      primaryCta: {
        actionId: 'solagree-consult',
        label: 'Book',
        href: '/original'
      },
      resetLabel: 'Reset'
    }

    expect(resolveQuizResultViewForHost(
      quizResult,
      resolveQuizHostConfig(undefined, {
        ctas: { 'solagree-consult': { href: '/quiz-consult' } }
      })
    ).primaryCta.href).toBe('/quiz-consult')
    expect(resolveCaseQualifierResultViewForHost(
      qualifierResult,
      resolveCaseQualifierHostConfig(undefined, {
        ctas: { 'solagree-consult': { href: '/qualifier-consult' } }
      })
    ).primaryCta.href).toBe('/qualifier-consult')
  })

  it('builds the unchanged public event context for either adapter', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-15T10:30:00.000Z'))

    expect(buildHostEventContext(
      resolveQuizHostConfig(undefined, {
        mode: 'embedded',
        analytics: { trackingId: 'partner-tracking' }
      }),
      'quiz-session'
    )).toEqual({
      hostId: 'solagree-quiz',
      mode: 'embedded',
      sessionId: 'quiz-session',
      trackingId: 'partner-tracking',
      timestamp: '2026-09-15T10:30:00.000Z'
    })

    vi.useRealTimers()
  })
})

describe('shared host iframe dispatch', () => {
  const quizEvent: QuizHostEvent = {
    type: 'question_answered',
    hostId: 'quiz-host',
    mode: 'embedded',
    sessionId: 'quiz-session',
    timestamp: '2026-09-15T00:00:00.000Z',
    questionId: 'state',
    value: 'NC',
    progress: 10
  }
  const qualifierEvent: CaseQualifierHostEvent = {
    type: 'criterion_toggled',
    hostId: 'qualifier-host',
    mode: 'embedded',
    sessionId: 'qualifier-session',
    timestamp: '2026-09-15T00:00:00.000Z',
    criterionId: 'simple-estate',
    selected: true,
    score: 1,
    progress: 8
  }

  it.each([
    undefined,
    '',
    '*',
    'https://partner.example/path',
    'data:text/plain,unsafe'
  ])('rejects an unsafe target origin: %s', (targetOrigin) => {
    expect(resolveTrustedTargetOrigin(targetOrigin)).toBeNull()
  })

  it('normalizes an explicit trusted web origin', () => {
    expect(resolveTrustedTargetOrigin(' https://partner.example/ ')).toBe('https://partner.example')
    expect(resolveTrustedTargetOrigin('http://localhost:3100')).toBe('http://localhost:3100')
  })

  it.each([
    ['missing', undefined],
    ['wildcard', '*']
  ])('preserves callbacks but sends no iframe message for an enabled %s target', (_, targetOrigin) => {
    const onEvent = vi.fn()
    const postMessage = vi.fn()

    dispatchHostEvent(
      quizEvent,
      {
        analytics: { enabled: false, namespace: 'solagree.quiz' },
        bridge: { postMessage: true, targetOrigin }
      },
      onEvent,
      { isClient: true, isParentWindow: false, postMessage }
    )

    expect(onEvent).toHaveBeenCalledWith(quizEvent)
    expect(postMessage).not.toHaveBeenCalled()
  })

  it('sends each distinct event contract only to the configured trusted origin', () => {
    const quizPostMessage = vi.fn()
    const qualifierPostMessage = vi.fn()

    dispatchHostEvent(
      quizEvent,
      {
        analytics: { enabled: false, namespace: 'solagree.quiz' },
        bridge: { postMessage: true, targetOrigin: 'https://quiz-host.example' }
      },
      undefined,
      { isClient: true, isParentWindow: false, postMessage: quizPostMessage }
    )
    dispatchHostEvent(
      qualifierEvent,
      {
        analytics: { enabled: false, namespace: 'solagree.case_qualifier' },
        bridge: { postMessage: true, targetOrigin: 'https://qualifier-host.example' }
      },
      undefined,
      { isClient: true, isParentWindow: false, postMessage: qualifierPostMessage }
    )

    expect(quizPostMessage).toHaveBeenCalledWith(
      { source: 'solagree.quiz', payload: quizEvent },
      'https://quiz-host.example'
    )
    expect(qualifierPostMessage).toHaveBeenCalledWith(
      { source: 'solagree.case_qualifier', payload: qualifierEvent },
      'https://qualifier-host.example'
    )
  })

  it('keeps the embedded quiz functional with its default bridge disabled', () => {
    const onEvent = vi.fn()
    const postMessage = vi.fn()
    const config = resolveQuizHostConfig(undefined, {
      mode: 'embedded',
      display: { showShellHeader: false }
    })

    dispatchHostEvent(
      quizEvent,
      config,
      onEvent,
      { isClient: true, isParentWindow: false, postMessage }
    )

    expect(config.bridge.postMessage).toBe(false)
    expect(onEvent).toHaveBeenCalledWith(quizEvent)
    expect(postMessage).not.toHaveBeenCalled()
  })
})
