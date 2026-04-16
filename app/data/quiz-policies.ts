import type { QuizOpenPolicy } from '~/data/quiz-types'

export const solagreeQuizOpenPolicies: readonly QuizOpenPolicy[] = [
  {
    id: 'missing-spouse-routing-cannot-find',
    title: 'Missing spouse routing when the user cannot find their spouse',
    description:
      'Outcome policy remains unresolved for the branch where the user cannot find their spouse. HIR-39 should keep this explicit in the result engine.',
    relatedQuestions: ['spouseContact']
  },
  {
    id: 'missing-spouse-routing-no-communication',
    title: 'Missing spouse routing when the user knows where their spouse is but communication is broken',
    description:
      'Outcome policy remains unresolved for the branch where the spouse is known but not communicating. HIR-39 should not silently collapse this branch.',
    relatedQuestions: ['spouseContact']
  },
  {
    id: 'legal-advice-not-sure-routing',
    title: 'Legal-advice routing when the user is not sure',
    description:
      'Result policy remains unresolved for legal-advice = not-sure. Keep the branch explicit until routing rules are finalized.',
    relatedQuestions: ['legalAdvice']
  },
  {
    id: 'payment-plan-eligibility',
    title: 'Payment-plan treatment in final qualification logic',
    description:
      'Payment-plan readiness must remain explicit until the final outcome policy defines whether it qualifies as a standard Solagree fit or a softer branch.',
    relatedQuestions: ['paymentReadiness']
  }
]
