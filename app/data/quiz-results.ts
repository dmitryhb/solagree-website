import type {
  QuizOpenPolicy,
  QuizOutcomeId,
  QuizResultResourceLink,
  QuizResultViewModel
} from '~/data/quiz-types'

type QuizResultContentDefinition = Omit<QuizResultViewModel, 'summaryItems'>

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
    summaryTitle: 'What we will carry into the consult',
    primaryCta: {
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
    summaryTitle: 'Why this route was flagged',
    primaryCta: {
      label: 'Book an attorney consult',
      href: '#attorney-consult-placeholder',
      note: 'Placeholder destination until production booking links are wired.',
      isPlaceholder: true
    },
    resetLabel: 'Start again',
    resourceTitle: 'Phase-one fallback resources',
    resourceBody:
      'State-specific legal-resource links are deferred for now, so phase one uses a generic fallback resource block.',
    resources: phaseOneFallbackResources
  },
  'not-fit-right-now': {
    eyebrow: 'Recommended next step',
    title: 'Solagree may not be the right fit right now.',
    body:
      'Based on your answers, the best next step is to pause the Solagree path and use a broader legal-help resource while your situation changes.',
    summaryTitle: 'What shaped this recommendation',
    primaryCta: {
      label: 'Review general legal-help resources',
      href: '#fallback-resources',
      note: 'Placeholder destination for the generic fallback resource block.',
      isPlaceholder: true
    },
    resetLabel: 'Start again',
    resourceTitle: 'Phase-one fallback resources',
    resourceBody:
      'These links stay generic for phase one. State-specific referrals can be layered in later without changing the evaluator.',
    resources: phaseOneFallbackResources
  }
} as const satisfies Record<QuizOutcomeId, QuizResultContentDefinition>

export const solagreeQuizOpenPolicyContent = {
  'missing-spouse-routing-cannot-find': {
    eyebrow: 'Policy review still open',
    title: 'This branch still needs a manual routing decision.',
    body:
      'Your spouse-contact answers fall into a policy branch that is intentionally left open. The result engine surfaces it explicitly instead of guessing the final recommendation.',
    summaryTitle: 'What triggered the open-policy branch',
    primaryCta: {
      label: 'Review generic legal-help resources',
      href: '#fallback-resources',
      note: 'Placeholder destination while the final missing-spouse routing is unresolved.',
      isPlaceholder: true
    },
    resetLabel: 'Start again',
    resourceTitle: 'Phase-one fallback resources',
    resourceBody:
      'Until the missing-spouse outcome is finalized, this branch stays paired with the same generic fallback resource block used elsewhere in phase one.',
    resources: phaseOneFallbackResources
  },
  'missing-spouse-routing-no-communication': {
    eyebrow: 'Policy review still open',
    title: 'This branch still needs a manual routing decision.',
    body:
      'Your spouse-contact answers fall into a policy branch that is intentionally left open. The result engine surfaces it explicitly instead of guessing the final recommendation.',
    summaryTitle: 'What triggered the open-policy branch',
    primaryCta: {
      label: 'Review generic legal-help resources',
      href: '#fallback-resources',
      note: 'Placeholder destination while the final missing-spouse routing is unresolved.',
      isPlaceholder: true
    },
    resetLabel: 'Start again',
    resourceTitle: 'Phase-one fallback resources',
    resourceBody:
      'Until the missing-spouse outcome is finalized, this branch stays paired with the same generic fallback resource block used elsewhere in phase one.',
    resources: phaseOneFallbackResources
  }
} as const satisfies Record<
  Extract<QuizOpenPolicy['id'], 'missing-spouse-routing-cannot-find' | 'missing-spouse-routing-no-communication'>,
  QuizResultContentDefinition
>
