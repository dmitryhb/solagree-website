import type { QuizOpenPolicy, QuizOutcomeId } from '~/data/quiz-types'

export const solagreeQuizResolvedPolicy = {
  legalAdviceYesOutcome: 'attorney-consult-first',
  legalAdviceNotSureOutcome: 'attorney-consult-first',
  paymentPlanEligibleOutcome: 'solagree-fit',
  genericFallbackResources: true
} as const satisfies {
  legalAdviceYesOutcome: QuizOutcomeId
  legalAdviceNotSureOutcome: QuizOutcomeId
  paymentPlanEligibleOutcome: QuizOutcomeId
  genericFallbackResources: boolean
}

export const solagreeQuizOpenPolicies: readonly QuizOpenPolicy[] = [
  {
    id: 'missing-spouse-routing-cannot-find',
    title: 'Missing spouse routing when the user cannot find their spouse',
    description:
      'Outcome policy remains unresolved for the branch where the user cannot find their spouse. HIR-39 should keep this explicit in the result engine.',
    relatedQuestions: ['spouseContact'],
    blocksOutcome: true
  },
  {
    id: 'missing-spouse-routing-no-communication',
    title: 'Missing spouse routing when the user knows where their spouse is but communication is broken',
    description:
      'Outcome policy remains unresolved for the branch where the spouse is known but not communicating. HIR-39 should not silently collapse this branch.',
    relatedQuestions: ['spouseContact'],
    blocksOutcome: true
  },
  {
    id: 'state-specific-result-messaging',
    title: 'State selection may affect future result messaging or resource links',
    description:
      'Phase one intentionally keeps the result messaging generic. State-aware result copy and richer resource links remain a follow-up policy/configuration topic.',
    relatedQuestions: ['state'],
    blocksOutcome: false
  }
]
