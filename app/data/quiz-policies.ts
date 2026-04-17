import type { QuizOpenPolicy, QuizOutcomeId, QuizSpouseContactAnswer } from '~/data/quiz-types'

export const solagreeQuizResolvedPolicy = {
  legalAdviceYesOutcome: 'attorney-consult-first',
  legalAdviceNotSureOutcome: 'attorney-consult-first',
  paymentPlanEligibleOutcome: 'solagree-fit',
  spouseContactOutcomes: {
    'direct-contact': null,
    'cannot-find': 'not-fit-right-now',
    'unknown-whereabouts': 'not-fit-right-now',
    'know-where-not-communicating': 'not-fit-right-now'
  },
  genericFallbackResources: true
} as const satisfies {
  legalAdviceYesOutcome: QuizOutcomeId
  legalAdviceNotSureOutcome: QuizOutcomeId
  paymentPlanEligibleOutcome: QuizOutcomeId
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
