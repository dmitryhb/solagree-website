import type {
  HostAnalyticsOptions,
  HostBridgeOptions,
  HostConfigInput,
  HostCtaTargetConfig,
  HostEventContext,
  HostRuntimeConfig
} from '~/utils/host-integration'

export type CaseQualifierCriterionId =
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

export type CaseQualifierCriterionGroupId =
  | 'financial-asset-alignment'
  | 'client-mindset-goals'
  | 'case-suitability'

export type CaseQualifierOutcomeId = 'possible-fit' | 'good-fit' | 'ideal-fit'

export type CaseQualifierAssessmentTone = 'possible' | 'good' | 'ideal'

/** One approved case signal displayed as a checkbox in the qualifier. */
export interface CaseQualifierCriterionDefinition {
  id: CaseQualifierCriterionId
  title: string
  description: string
}

/** A practitioner-facing criterion group and its approved listening cue. */
export interface CaseQualifierCriterionGroupDefinition {
  id: CaseQualifierCriterionGroupId
  title: string
  listeningCue: string
  criteria: readonly CaseQualifierCriterionDefinition[]
}

/** Versioned local state. Only snapshots matching the current schema restore. */
export interface CaseQualifierPersistedSession {
  version: 1
  selectedCriterionIds: CaseQualifierCriterionId[]
}

export type CaseQualifierCtaActionId = 'solagree-consult'

export interface CaseQualifierResultCta {
  actionId: CaseQualifierCtaActionId
  label: string
  href: string
  target?: '_self' | '_blank'
  rel?: string
  trackingId?: string
}

/** Approved result content for one non-zero assessment tier. */
export interface CaseQualifierResultViewModel {
  outcome: CaseQualifierOutcomeId
  gaugeLabel: string
  title: string
  body: string
  actionLabel: string
  tone: CaseQualifierAssessmentTone
  primaryCta: CaseQualifierResultCta
  resetLabel: string
}

export interface CaseQualifierEvaluation {
  score: number
  outcome: CaseQualifierOutcomeId | null
}

export type CaseQualifierHostMode = 'standalone' | 'embedded'

export interface CaseQualifierHostDisplayOptions {
  showShellHeader: boolean
  showInstructions: boolean
  headingLevel: 1 | 2 | 3
}

export type CaseQualifierHostAnalyticsOptions = HostAnalyticsOptions

export type CaseQualifierHostBridgeOptions = HostBridgeOptions

export type CaseQualifierCtaTargetConfig = HostCtaTargetConfig

/** Fully resolved behavior for a homepage, standalone, or iframe quiz host. */
export type CaseQualifierHostRuntimeConfig = HostRuntimeConfig<
  CaseQualifierHostMode,
  CaseQualifierHostDisplayOptions,
  CaseQualifierCtaActionId
>

export type CaseQualifierHostConfigInput = HostConfigInput<
  CaseQualifierHostMode,
  CaseQualifierHostDisplayOptions,
  CaseQualifierCtaActionId
>

type CaseQualifierHostEventBase = HostEventContext<CaseQualifierHostMode>

export interface CaseQualifierStartedEvent extends CaseQualifierHostEventBase {
  type: 'started'
}

export interface CaseQualifierCriterionToggledEvent extends CaseQualifierHostEventBase {
  type: 'criterion_toggled'
  criterionId: CaseQualifierCriterionId
  selected: boolean
  score: number
  progress: number
}

export interface CaseQualifierCompletedEvent extends CaseQualifierHostEventBase {
  type: 'completed'
  outcome: CaseQualifierOutcomeId
  score: number
  progress: number
}

export interface CaseQualifierOutcomeChangedEvent extends CaseQualifierHostEventBase {
  type: 'outcome_changed'
  outcome: CaseQualifierOutcomeId
  score: number
}

export interface CaseQualifierCtaClickedEvent extends CaseQualifierHostEventBase {
  type: 'cta_clicked'
  actionId: CaseQualifierCtaActionId
  ctaTrackingId?: string
  outcome: CaseQualifierOutcomeId
  score: number
}

export interface CaseQualifierResetEvent extends CaseQualifierHostEventBase {
  type: 'reset'
}

/** Privacy-safe events emitted to Vue hosts and optional iframe bridges. */
export type CaseQualifierHostEvent =
  | CaseQualifierStartedEvent
  | CaseQualifierCriterionToggledEvent
  | CaseQualifierCompletedEvent
  | CaseQualifierOutcomeChangedEvent
  | CaseQualifierCtaClickedEvent
  | CaseQualifierResetEvent
