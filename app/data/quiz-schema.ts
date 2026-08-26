import type {
  QuizCriterionDefinition,
  QuizCriterionGroupDefinition,
  QuizCriterionId
} from '~/data/quiz-types'

export const solagreeQuizCriterionGroups = [
  {
    id: 'financial-asset-alignment',
    title: 'Financial & Asset Alignment',
    listeningCue:
      '"I don\'t have $10,000 for a retainer," or "We\'re spending more fighting than the house is worth."',
    criteria: [
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
        id: 'willing-participants',
        title: 'Willing Participants',
        description: 'Both parties will engage in good faith (even if they disagree on outcomes)'
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
      },
      {
        id: 'integrity-deficit',
        title: 'Integrity Deficit',
        description: 'Client deserves a high-integrity process but can\'t afford the cost that comes with it'
      }
    ]
  }
] as const satisfies readonly QuizCriterionGroupDefinition[]

const solagreeQuizCriteria = solagreeQuizCriterionGroups.reduce<QuizCriterionDefinition[]>(
  (criteria, group) => {
    criteria.push(...group.criteria)
    return criteria
  },
  []
)

export const solagreeQuizCriterionIds = solagreeQuizCriteria.map(
  criterion => criterion.id
) as readonly QuizCriterionId[]

export const solagreeQuizCriterionMap = Object.fromEntries(
  solagreeQuizCriteria.map(criterion => [criterion.id, criterion])
) as Record<QuizCriterionId, QuizCriterionDefinition>
