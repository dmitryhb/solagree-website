export type QuizCriterionId =
  | 'simple-estate'
  | 'budget-constraints'
  | 'financial-transparency'
  | 'high-net-worth-exception'
  | 'court-avoidance'
  | 'resolution-focus'
  | 'co-parenting-priority'
  | 'ready-to-move-forward'
  | 'willing-participants'
  | 'specific-disagreements'
  | 'litigation-stuck'
  | 'integrity-deficit'

export type QuizCriterionGroupId =
  | 'financial-asset-alignment'
  | 'client-mindset-goals'
  | 'case-suitability'

export type QuizOutcomeId = 'possible-fit' | 'good-fit' | 'ideal-fit'

export type QuizAssessmentTone = 'possible' | 'good' | 'ideal'

/** One approved case signal displayed as a checkbox in the qualifier. */
export interface QuizCriterionDefinition {
  id: QuizCriterionId
  title: string
  description: string
}

/** A practitioner-facing criterion group and its approved listening cue. */
export interface QuizCriterionGroupDefinition {
  id: QuizCriterionGroupId
  title: string
  listeningCue: string
  criteria: readonly QuizCriterionDefinition[]
}

/** Versioned local state. Only snapshots matching the current schema restore. */
export interface QuizPersistedSession {
  version: 3
  selectedCriterionIds: QuizCriterionId[]
}

export type QuizCtaActionId = 'solagree-consult'

export interface QuizResultCta {
  actionId: QuizCtaActionId
  label: string
  href: string
  target?: '_self' | '_blank'
  rel?: string
  trackingId?: string
}

/** Approved result content for one non-zero assessment tier. */
export interface QuizResultViewModel {
  outcome: QuizOutcomeId
  gaugeLabel: string
  title: string
  body: string
  actionLabel: string
  tone: QuizAssessmentTone
  primaryCta: QuizResultCta
  resetLabel: string
}

export interface QuizEvaluation {
  score: number
  outcome: QuizOutcomeId | null
}

export type QuizHostMode = 'standalone' | 'embedded'

export interface QuizHostDisplayOptions {
  showShellHeader: boolean
  showInstructions: boolean
  headingLevel: 1 | 2 | 3
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

/** Fully resolved behavior for a homepage, standalone, or iframe quiz host. */
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

export interface QuizStartedEvent extends QuizHostEventBase {
  type: 'started'
}

export interface QuizCriterionToggledEvent extends QuizHostEventBase {
  type: 'criterion_toggled'
  criterionId: QuizCriterionId
  selected: boolean
  score: number
  progress: number
}

export interface QuizCompletedEvent extends QuizHostEventBase {
  type: 'completed'
  outcome: QuizOutcomeId
  score: number
  progress: number
}

export interface QuizOutcomeChangedEvent extends QuizHostEventBase {
  type: 'outcome_changed'
  outcome: QuizOutcomeId
  score: number
}

export interface QuizCtaClickedEvent extends QuizHostEventBase {
  type: 'cta_clicked'
  actionId: QuizCtaActionId
  ctaTrackingId?: string
  outcome: QuizOutcomeId
  score: number
}

export interface QuizResetEvent extends QuizHostEventBase {
  type: 'reset'
}

/** Privacy-safe events emitted to Vue hosts and optional iframe bridges. */
export type QuizHostEvent =
  | QuizStartedEvent
  | QuizCriterionToggledEvent
  | QuizCompletedEvent
  | QuizOutcomeChangedEvent
  | QuizCtaClickedEvent
  | QuizResetEvent
