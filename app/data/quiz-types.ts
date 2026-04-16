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
  version: 1
  phase: 'question' | 'complete'
  currentQuestionId: QuizQuestionId
  answers: QuizAnswerMap
}

export interface QuizOpenPolicy {
  id: string
  title: string
  description: string
  relatedQuestions: readonly QuizQuestionId[]
}
