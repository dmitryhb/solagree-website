import type { QuizOpenPolicy } from '~/data/quiz-types'

export const solagreeQuizOpenPolicies: readonly QuizOpenPolicy[] = [
  {
    id: 'state-specific-result-messaging',
    title: 'State selection may affect future result messaging',
    description:
      'The current quiz intentionally uses one recommendation. State-aware result copy remains a follow-up policy/configuration topic.',
    relatedQuestions: ['state'],
    blocksOutcome: false
  }
]
