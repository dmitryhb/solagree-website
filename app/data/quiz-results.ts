import type {
  QuizOpenPolicy,
  QuizOutcomeId,
  QuizResultResourceLink,
  QuizResultViewModel
} from '~/data/quiz-types'

type QuizResultContentDefinition = QuizResultViewModel

const phaseOneFallbackResources = [
  {
    label: 'Legal Services Corporation',
    href: 'https://www.lsc.gov/',
    description: 'National starting point for legal-aid and civil-help directories.'
  },
  {
    label: 'LawHelp.org',
    href: 'https://www.lawhelp.org/',
    description: 'General legal-help information and self-help resources by jurisdiction.'
  }
] as const satisfies readonly QuizResultResourceLink[]

export const solagreeQuizResultContent = {
  'solagree-fit': {
    eyebrow: 'Recommended next step',
    title: 'You look like a fit for a Solagree consult.',
    body:
      'Your answers suggest a guided Solagree path may be appropriate. We will still carry your flagged topics into the consult so the right specialist can prepare.',
    primaryCta: {
      actionId: 'solagree-consult',
      label: 'Book a Solagree consult',
      href: '#solagree-consult-placeholder',
      note: 'Placeholder destination until production booking links are wired.',
      isPlaceholder: true
    },
    resetLabel: 'Start again'
  },
  'attorney-consult-first': {
    eyebrow: 'Recommended next step',
    title: 'An attorney consult should happen first.',
    body:
      'Your answers point to questions or risk factors that should be clarified with an attorney before choosing the next Solagree step.',
    primaryCta: {
      actionId: 'attorney-consult',
      label: 'Book an attorney consult',
      href: '#attorney-consult-placeholder',
      note: 'Placeholder destination until production booking links are wired.',
      isPlaceholder: true
    },
    resetLabel: 'Start again',
    resourceTitle: 'General legal-help resources',
    resourceBody:
      'These national resources can help you explore legal aid and self-help options while you prepare for the right next step.',
    resources: phaseOneFallbackResources
  },
  'not-fit-right-now': {
    eyebrow: 'Recommended next step',
    title: 'Solagree may not be the right fit right now.',
    body:
      'Based on your answers, the best next step is to pause the Solagree path and use a broader legal-help resource while your situation changes.',
    primaryCta: {
      actionId: 'fallback-resources',
      label: 'Review general legal-help resources',
      href: '#fallback-resources',
      note: 'Placeholder destination for the generic fallback resource block.',
      isPlaceholder: true
    },
    resetLabel: 'Start again',
    resourceTitle: 'General legal-help resources',
    resourceBody:
      'These national resources can help you explore legal aid and self-help options while your situation changes.',
    resources: phaseOneFallbackResources
  }
} as const satisfies Record<QuizOutcomeId, QuizResultContentDefinition>

export const solagreeQuizOpenPolicyContent = {
  'state-specific-result-messaging': {
    eyebrow: 'Recommended next step',
    title: 'General legal-help resources may be the best next step.',
    body:
      'Based on your answers, broader legal-help resources may be more useful before choosing a Solagree path.',
    primaryCta: {
      actionId: 'fallback-resources',
      label: 'Review general legal-help resources',
      href: '#fallback-resources',
      note: 'Placeholder destination while state-specific referrals remain deferred.',
      isPlaceholder: true
    },
    resetLabel: 'Start again',
    resourceTitle: 'General legal-help resources',
    resourceBody:
      'These national resources can help you explore legal aid and self-help options while you decide your next step.',
    resources: phaseOneFallbackResources
  }
} as const satisfies Record<QuizOpenPolicy['id'], QuizResultContentDefinition>
