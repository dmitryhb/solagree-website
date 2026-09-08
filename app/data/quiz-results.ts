import type { QuizResultViewModel } from '~/data/quiz-types'

/** The single recommendation displayed after every completed quiz path. */
export const solagreeQuizResultContent = {
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
} as const satisfies QuizResultViewModel
