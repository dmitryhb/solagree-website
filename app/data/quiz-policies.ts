import type { QuizOpenPolicy, QuizOutcomeId, QuizSpouseContactAnswer } from '~/data/quiz-types'

export const solagreeQuizResolvedPolicy = {
  legalAdviceYesOutcome: 'attorney-consult-first',
  legalAdviceNotSureOutcome: 'attorney-consult-first',
  spouseContactOutcomes: {
    'direct-contact': null,
    'cannot-find': 'attorney-consult-first',
    'unknown-whereabouts': 'attorney-consult-first',
    'know-where-not-communicating': 'attorney-consult-first'
  },
  genericFallbackResources: true
} as const satisfies {
  legalAdviceYesOutcome: QuizOutcomeId
  legalAdviceNotSureOutcome: QuizOutcomeId
  spouseContactOutcomes: Record<QuizSpouseContactAnswer, QuizOutcomeId | null>
  genericFallbackResources: boolean
}

export const solagreeQuizOpenPolicies: readonly QuizOpenPolicy[] = [
  {
    id: 'state-specific-result-messaging',
    title: 'State selection may affect future result messaging or resource links',
    description:
      'Phase one intentionally keeps the result messaging generic. State-aware result copy and richer resource links remain a follow-up policy/configuration topic.',
    relatedQuestions: ['state'],
    blocksOutcome: false
  }
]
