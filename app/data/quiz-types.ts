export type QuizStateCode =
  | 'AL'
  | 'AK'
  | 'AZ'
  | 'AR'
  | 'CA'
  | 'CO'
  | 'CT'
  | 'DE'
  | 'DC'
  | 'FL'
  | 'GA'
  | 'HI'
  | 'ID'
  | 'IL'
  | 'IN'
  | 'IA'
  | 'KS'
  | 'KY'
  | 'LA'
  | 'ME'
  | 'MD'
  | 'MA'
  | 'MI'
  | 'MN'
  | 'MS'
  | 'MO'
  | 'MT'
  | 'NE'
  | 'NV'
  | 'NH'
  | 'NJ'
  | 'NM'
  | 'NY'
  | 'NC'
  | 'ND'
  | 'OH'
  | 'OK'
  | 'OR'
  | 'PA'
  | 'RI'
  | 'SC'
  | 'SD'
  | 'TN'
  | 'TX'
  | 'UT'
  | 'VT'
  | 'VA'
  | 'WA'
  | 'WV'
  | 'WI'
  | 'WY'

export type QuizBinaryAnswer = 'yes' | 'no'

export type QuizParentingDetailAnswer =
  | 'custody-schedule'
  | 'decision-making'
  | 'child-support'
  | 'communication-conflict'

export type QuizFinancialDetailAnswer =
  | 'real-estate'
  | 'retirement-assets'
  | 'business-self-employment'
  | 'spousal-support'
  | 'debts-assets'

export type QuizSpouseContactAnswer =
  | 'direct-contact'
  | 'know-where-not-communicating'
  | 'cannot-find'
  | 'unknown-whereabouts'

export type QuizCooperationAnswer = 'yes' | 'no' | 'not-sure'

export type QuizLegalAdviceAnswer = 'yes' | 'no' | 'not-sure'

export type QuizPaymentReadinessAnswer =
  | 'ready-now'
  | 'need-payment-plan'
  | 'not-ready'

export interface QuizAnswerMap {
  state?: QuizStateCode
  children?: QuizBinaryAnswer
  parentingScreener?: QuizBinaryAnswer
  parentingDetails?: QuizParentingDetailAnswer[]
  financialScreener?: QuizBinaryAnswer
  financialDetails?: QuizFinancialDetailAnswer[]
  spouseContact?: QuizSpouseContactAnswer
  spouseCooperation?: QuizCooperationAnswer
  legalAdvice?: QuizLegalAdviceAnswer
  paymentReadiness?: QuizPaymentReadinessAnswer
}

export type QuizQuestionId = keyof QuizAnswerMap

export type QuizQuestionValue<TQuestionId extends QuizQuestionId = QuizQuestionId> =
  QuizAnswerMap[TQuestionId]

export type QuizFieldKind = 'select' | 'single-select' | 'multi-select'

export interface QuizOption<TValue extends string = string> {
  id: TValue
  label: string
  description?: string
}

export interface QuizQuestionDefinition<
  TQuestionId extends QuizQuestionId = QuizQuestionId,
  TValue extends string = string
> {
  id: TQuestionId
  kind: QuizFieldKind
  title: string
  description?: string
  placeholder?: string
  options: readonly QuizOption<TValue>[]
  explainerTitle: string
  explainerBody: string
  isVisible?: (answers: Readonly<QuizAnswerMap>) => boolean
}

export interface QuizPersistedSession {
  version: 2
  phase: QuizSessionPhase
  currentQuestionId: QuizQuestionId
  answers: QuizAnswerMap
}

export type QuizOpenPolicyId =
  | 'missing-spouse-routing-cannot-find'
  | 'missing-spouse-routing-no-communication'
  | 'state-specific-result-messaging'

export interface QuizOpenPolicy {
  id: QuizOpenPolicyId
  title: string
  description: string
  relatedQuestions: readonly QuizQuestionId[]
  blocksOutcome: boolean
}

export type QuizSessionPhase = 'question' | 'result'

export type QuizOutcomeId =
  | 'solagree-fit'
  | 'attorney-consult-first'
  | 'not-fit-right-now'

export type QuizCtaActionId =
  | 'solagree-consult'
  | 'attorney-consult'
  | 'fallback-resources'

export type QuizInternalTag =
  | 'parenting'
  | 'financial'
  | 'both'
  | 'financial-complexity'
  | 'missing-spouse'
  | 'legal-advice-needed'
  | 'payment-plan'
  | 'spouse-resistance'
  | 'no-spouse-communication'

export interface QuizConsultMetadata {
  state?: QuizStateCode
  tags: readonly QuizInternalTag[]
  parentingTopicIds: readonly QuizParentingDetailAnswer[]
  financialTopicIds: readonly QuizFinancialDetailAnswer[]
  spouseContact?: QuizSpouseContactAnswer
  spouseCooperation?: QuizCooperationAnswer
  legalAdvice?: QuizLegalAdviceAnswer
  paymentReadiness?: QuizPaymentReadinessAnswer
  hasParentingConcerns: boolean
  hasFinancialConcerns: boolean
  hasFinancialComplexity: boolean
  hasMissingSpouse: boolean
  needsLegalAdvice: boolean
  deferredPolicyIds: readonly QuizOpenPolicyId[]
}

export interface QuizResolvedEvaluation {
  kind: 'resolved'
  outcome: QuizOutcomeId
  metadata: QuizConsultMetadata
}

export interface QuizOpenPolicyEvaluation {
  kind: 'open-policy'
  policyId: QuizOpenPolicy['id']
  metadata: QuizConsultMetadata
}

export type QuizEvaluation = QuizResolvedEvaluation | QuizOpenPolicyEvaluation

export interface QuizResultCta {
  actionId: QuizCtaActionId
  label: string
  href: string
  note?: string
  isPlaceholder?: boolean
  target?: '_self' | '_blank'
  rel?: string
  trackingId?: string
}

export interface QuizResultResourceLink {
  label: string
  href: string
  description: string
}

export interface QuizResultViewModel {
  eyebrow: string
  title: string
  body: string
  summaryTitle: string
  summaryItems: readonly string[]
  primaryCta: QuizResultCta
  resourceTitle?: string
  resourceBody?: string
  resources?: readonly QuizResultResourceLink[]
  policyNote?: string
  resetLabel: string
}

export type QuizHostMode = 'standalone' | 'embedded'

export interface QuizHostDisplayOptions {
  showShellHeader: boolean
  showExplainer: boolean
}

export interface QuizHostAnalyticsOptions {
  enabled: boolean
  namespace: string
  trackingId?: string
}

export interface QuizHostBridgeOptions {
  postMessage: boolean
  targetOrigin: string
}

export interface QuizCtaTargetConfig {
  href: string
  trackingId?: string
  target?: '_self' | '_blank'
  rel?: string
}

export interface QuizHostRuntimeConfig {
  hostId: string
  mode: QuizHostMode
  display: QuizHostDisplayOptions
  analytics: QuizHostAnalyticsOptions
  bridge: QuizHostBridgeOptions
  ctas: Partial<Record<QuizCtaActionId, QuizCtaTargetConfig>>
}

export interface QuizHostConfigInput {
  hostId?: string
  mode?: QuizHostMode
  display?: Partial<QuizHostDisplayOptions>
  analytics?: Partial<QuizHostAnalyticsOptions>
  bridge?: Partial<QuizHostBridgeOptions>
  ctas?: Partial<Record<QuizCtaActionId, Partial<QuizCtaTargetConfig>>>
}

interface QuizHostEventBase {
  hostId: string
  mode: QuizHostMode
  sessionId: string
  trackingId?: string
  timestamp: string
}

export interface QuizQuestionViewedEvent extends QuizHostEventBase {
  type: 'question_viewed'
  questionId: QuizQuestionId
  progress: number
}

export interface QuizQuestionAnsweredEvent extends QuizHostEventBase {
  type: 'question_answered'
  questionId: QuizQuestionId
  value: QuizQuestionValue
  progress: number
}

export interface QuizProgressedEvent extends QuizHostEventBase {
  type: 'progressed'
  fromQuestionId: QuizQuestionId
  toQuestionId: QuizQuestionId | 'result'
  progress: number
}

export interface QuizCompletedEvent extends QuizHostEventBase {
  type: 'completed'
  outcome: QuizOutcomeId | 'open-policy'
  policyId?: QuizOpenPolicyId
  tags: readonly QuizInternalTag[]
  progress: number
}

export interface QuizCtaClickedEvent extends QuizHostEventBase {
  type: 'cta_clicked'
  actionId: QuizCtaActionId
  href: string
  outcome: QuizOutcomeId | 'open-policy'
  policyId?: QuizOpenPolicyId
}

export interface QuizResetEvent extends QuizHostEventBase {
  type: 'reset'
}

export type QuizHostEvent =
  | QuizQuestionViewedEvent
  | QuizQuestionAnsweredEvent
  | QuizProgressedEvent
  | QuizCompletedEvent
  | QuizCtaClickedEvent
  | QuizResetEvent
