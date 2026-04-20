import { solagreeQuizOpenPolicies, solagreeQuizResolvedPolicy } from '~/data/quiz-policies'
import { solagreeQuizOpenPolicyContent, solagreeQuizResultContent } from '~/data/quiz-results'
import type {
  QuizAnswerMap,
  QuizConsultMetadata,
  QuizEvaluation,
  QuizInternalTag,
  QuizOpenPolicy,
  QuizResultViewModel
} from '~/data/quiz-types'

function getResolvedSpouseContactOutcome(answers: Readonly<QuizAnswerMap>) {
  if (!answers.spouseContact) {
    return null
  }

  return solagreeQuizResolvedPolicy.spouseContactOutcomes[answers.spouseContact] ?? null
}

export function buildQuizConsultMetadata(answers: Readonly<QuizAnswerMap>): QuizConsultMetadata {
  const tags = new Set<QuizInternalTag>()
  const parentingTopicIds = answers.parentingDetails ?? []
  const financialTopicIds = answers.financialDetails ?? []

  const hasParentingConcerns = answers.children === 'yes' && answers.parentingScreener === 'yes'
  const hasFinancialConcerns = answers.financialScreener === 'yes'
  const hasFinancialComplexity = financialTopicIds.length > 0
  const hasMissingSpouse =
    answers.spouseContact === 'cannot-find' || answers.spouseContact === 'unknown-whereabouts'
  const hasNoSpouseCommunication = answers.spouseContact === 'know-where-not-communicating'
  const needsLegalAdvice = answers.legalAdvice === 'yes' || answers.legalAdvice === 'not-sure'

  if (hasParentingConcerns) {
    tags.add('parenting')
  }

  if (hasFinancialConcerns) {
    tags.add('financial')
  }

  if (hasParentingConcerns && hasFinancialConcerns) {
    tags.add('both')
  }

  if (hasFinancialComplexity) {
    tags.add('financial-complexity')
  }

  if (hasMissingSpouse) {
    tags.add('missing-spouse')
  }

  if (hasNoSpouseCommunication) {
    tags.add('no-spouse-communication')
  }

  if (needsLegalAdvice) {
    tags.add('legal-advice-needed')
  }

  if (answers.paymentReadiness === 'need-payment-plan') {
    tags.add('payment-plan')
  }

  if (answers.spouseCooperation === 'no') {
    tags.add('spouse-resistance')
  }

  return {
    state: answers.state,
    tags: [...tags],
    parentingTopicIds,
    financialTopicIds,
    spouseContact: answers.spouseContact,
    spouseCooperation: answers.spouseCooperation,
    legalAdvice: answers.legalAdvice,
    paymentReadiness: answers.paymentReadiness,
    hasParentingConcerns,
    hasFinancialConcerns,
    hasFinancialComplexity,
    hasMissingSpouse,
    needsLegalAdvice,
    deferredPolicyIds: getQuizDeferredPolicyIds(answers)
  }
}

export function evaluateQuizAnswers(answers: Readonly<QuizAnswerMap>): QuizEvaluation {
  const metadata = buildQuizConsultMetadata(answers)
  const resolvedSpouseContactOutcome = getResolvedSpouseContactOutcome(answers)

  if (resolvedSpouseContactOutcome) {
    return {
      kind: 'resolved',
      outcome: resolvedSpouseContactOutcome,
      metadata
    }
  }

  if (answers.paymentReadiness === 'not-ready') {
    return {
      kind: 'resolved',
      outcome: 'not-fit-right-now',
      metadata
    }
  }

  if (answers.legalAdvice === 'yes') {
    return {
      kind: 'resolved',
      outcome: solagreeQuizResolvedPolicy.legalAdviceYesOutcome,
      metadata
    }
  }

  if (answers.legalAdvice === 'not-sure') {
    return {
      kind: 'resolved',
      outcome: solagreeQuizResolvedPolicy.legalAdviceNotSureOutcome,
      metadata
    }
  }

  if (answers.spouseCooperation === 'no') {
    return {
      kind: 'resolved',
      outcome: 'attorney-consult-first',
      metadata
    }
  }

  return {
    kind: 'resolved',
    outcome:
      answers.paymentReadiness === 'need-payment-plan'
        ? solagreeQuizResolvedPolicy.paymentPlanEligibleOutcome
        : 'solagree-fit',
    metadata
  }
}

export function getQuizResultViewModel(evaluation: QuizEvaluation): QuizResultViewModel {
  const content = evaluation.kind === 'resolved'
    ? solagreeQuizResultContent[evaluation.outcome]
    : solagreeQuizOpenPolicyContent[evaluation.policyId]

  return {
    ...content
  }
}

export function getQuizDeferredPolicyIds(_: Readonly<QuizAnswerMap>): readonly QuizOpenPolicy['id'][] {
  return solagreeQuizOpenPolicies
    .filter(policy => !policy.blocksOutcome)
    .map(policy => policy.id)
}

export function isQuizResultBlockedByOpenPolicy(evaluation: QuizEvaluation): boolean {
  return evaluation.kind === 'open-policy'
}
