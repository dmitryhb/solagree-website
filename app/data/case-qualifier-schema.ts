import type {
  CaseQualifierCriterionDefinition,
  CaseQualifierCriterionGroupDefinition,
  CaseQualifierCriterionId
} from '~/data/case-qualifier-types'

export const solagreeCaseQualifierCriterionGroups = [
  {
    id: 'financial-asset-alignment',
    title: 'Financial & Asset Alignment',
    listeningCue:
      '"I don\'t have $10,000 for a retainer," or "We\'re spending more fighting than the house is worth."',
    criteria: [
      {
        id: 'cost-limitations',
        title: 'Cost Limitations',
        description: 'Client wants a fair, high-integrity process but can\'t afford the cost that comes with it.',
        weight: 2
      },
      {
        id: 'simple-estate',
        title: 'Simple Estate',
        description: 'Marital estate is approximately $500,000 or less'
      },
      {
        id: 'budget-constraints',
        title: 'Budget Constraints',
        description: 'Client is hesitant or unable to pay a $7,500+ litigation retainer'
      },
      {
        id: 'financial-transparency',
        title: 'Financial Transparency',
        description: 'Neither party is alleging hidden assets or significant financial misconduct'
      },
      {
        id: 'high-net-worth-exception',
        title: 'High-Net-Worth Exception',
        description: 'High-net-worth client seeking a private, confidential alternative to courtroom litigation'
      }
    ]
  },
  {
    id: 'client-mindset-goals',
    title: 'Client Mindset & Goals',
    listeningCue:
      '"Can we stay out of court?", "Our kids don\'t deserve this," or "I just want this over."',
    criteria: [
      {
        id: 'court-avoidance',
        title: 'Court Avoidance',
        description: 'Both parties want to avoid court if possible'
      },
      {
        id: 'resolution-focus',
        title: 'Resolution Focus',
        description: 'Client wants a faster, more predictable process'
      },
      {
        id: 'co-parenting-priority',
        title: 'Co-Parenting Priority',
        description: 'Preserving family relationships or effective co-parenting is a priority'
      },
      {
        id: 'ready-to-move-forward',
        title: 'Ready to Move Forward',
        description: 'The client has said, "I just want this over"'
      }
    ]
  },
  {
    id: 'case-suitability',
    title: 'Case Suitability',
    listeningCue:
      '"This case has been dragging on forever," or "We have some things we can\'t agree on."',
    criteria: [
      {
        id: 'spouse-participation-potential',
        title: 'Potential for Both Spouses to Participate',
        description:
          'There is evidence that the other spouse may be open to something other than litigation (for example, wants to save costs, time or embarrassment; has already indicated openness to alternatives).'
      },
      {
        id: 'specific-disagreements',
        title: 'Specific Disagreements',
        description: 'Parties have identifiable issues they can\'t resolve on their own'
      },
      {
        id: 'litigation-stuck',
        title: 'Litigation Stuck',
        description: 'Case is stuck in litigation and has had too many delays'
      }
    ]
  }
] as const satisfies readonly CaseQualifierCriterionGroupDefinition[]

const solagreeCaseQualifierCriteria = solagreeCaseQualifierCriterionGroups.reduce<CaseQualifierCriterionDefinition[]>(
  (criteria, group) => {
    criteria.push(...group.criteria)
    return criteria
  },
  []
)

export const solagreeCaseQualifierCriterionIds = solagreeCaseQualifierCriteria.map(
  criterion => criterion.id
) as readonly CaseQualifierCriterionId[]

export const solagreeCaseQualifierCriterionMap = Object.fromEntries(
  solagreeCaseQualifierCriteria.map(criterion => [criterion.id, criterion])
) as Record<CaseQualifierCriterionId, CaseQualifierCriterionDefinition>

/** Point value of one criterion. A definition without an explicit `weight` counts as 1. */
export const defaultCaseQualifierCriterionWeight = 1

export const solagreeCaseQualifierCriterionWeightMap = Object.fromEntries(
  solagreeCaseQualifierCriteria.map(criterion => [criterion.id, criterion.weight ?? defaultCaseQualifierCriterionWeight])
) as Record<CaseQualifierCriterionId, number>

/** Maximum score: the sum of every criterion weight (13 with 12 criteria and one double-weight item). */
export const solagreeCaseQualifierTotalWeight = solagreeCaseQualifierCriteria.reduce(
  (total, criterion) => total + (criterion.weight ?? defaultCaseQualifierCriterionWeight),
  0
)

/**
 * Criterion ids that were renamed. Saved browser sessions written before the
 * rename carry the old ids, so they are mapped to the current ones on parse.
 */
export const solagreeCaseQualifierLegacyCriterionIdMap: Readonly<Record<string, CaseQualifierCriterionId>> = {
  'integrity-deficit': 'cost-limitations',
  'willing-participants': 'spouse-participation-potential'
}
