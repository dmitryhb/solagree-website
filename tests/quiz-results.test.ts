import { describe, expect, it } from 'vitest'
import { solagreeQuizCopy } from '../app/data/quiz'
import {
  solagreeQuizCriterionGroups,
  solagreeQuizCriterionIds
} from '../app/data/quiz-schema'
import {
  evaluateQuizAnswers,
  getQuizOutcome,
  getQuizResultViewModel
} from '../app/utils/quiz-results'

describe('case qualifier results', () => {
  it.each([
    [0, null],
    [1, 'possible-fit'],
    [2, 'possible-fit'],
    [3, 'good-fit'],
    [5, 'good-fit'],
    [6, 'ideal-fit'],
    [12, 'ideal-fit']
  ] as const)('maps score %i to %s', (score, outcome) => {
    expect(getQuizOutcome(score)).toBe(outcome)
    expect(evaluateQuizAnswers(solagreeQuizCriterionIds.slice(0, score))).toEqual({ score, outcome })
  })

  it('rejects scores outside the approved integer range', () => {
    expect(getQuizOutcome(-1)).toBeNull()
    expect(getQuizOutcome(1.5)).toBeNull()
    expect(getQuizOutcome(13)).toBeNull()
  })

  it('preserves the exact approved instructions, groups, listening cues, and criteria copy', () => {
    expect(solagreeQuizCopy.instructions).toBe(
      "Check each criterion your client meets during your initial consultation. If they match 3 or more, they're likely a strong candidate for Solagree. Your recommendation will update in real-time on the right."
    )
    expect(solagreeQuizCriterionGroups).toEqual([
      {
        id: 'financial-asset-alignment',
        title: 'Financial & Asset Alignment',
        listeningCue: '"I don\'t have $10,000 for a retainer," or "We\'re spending more fighting than the house is worth."',
        criteria: [
          { id: 'simple-estate', title: 'Simple Estate', description: 'Marital estate is approximately $500,000 or less' },
          { id: 'budget-constraints', title: 'Budget Constraints', description: 'Client is hesitant or unable to pay a $7,500+ litigation retainer' },
          { id: 'financial-transparency', title: 'Financial Transparency', description: 'Neither party is alleging hidden assets or significant financial misconduct' },
          { id: 'high-net-worth-exception', title: 'High-Net-Worth Exception', description: 'High-net-worth client seeking a private, confidential alternative to courtroom litigation' }
        ]
      },
      {
        id: 'client-mindset-goals',
        title: 'Client Mindset & Goals',
        listeningCue: '"Can we stay out of court?", "Our kids don\'t deserve this," or "I just want this over."',
        criteria: [
          { id: 'court-avoidance', title: 'Court Avoidance', description: 'Both parties want to avoid court if possible' },
          { id: 'resolution-focus', title: 'Resolution Focus', description: 'Client wants a faster, more predictable process' },
          { id: 'co-parenting-priority', title: 'Co-Parenting Priority', description: 'Preserving family relationships or effective co-parenting is a priority' },
          { id: 'ready-to-move-forward', title: 'Ready to Move Forward', description: 'The client has said, "I just want this over"' }
        ]
      },
      {
        id: 'case-suitability',
        title: 'Case Suitability',
        listeningCue: '"This case has been dragging on forever," or "We have some things we can\'t agree on."',
        criteria: [
          { id: 'willing-participants', title: 'Willing Participants', description: 'Both parties will engage in good faith (even if they disagree on outcomes)' },
          { id: 'specific-disagreements', title: 'Specific Disagreements', description: 'Parties have identifiable issues they can\'t resolve on their own' },
          { id: 'litigation-stuck', title: 'Litigation Stuck', description: 'Case is stuck in litigation and has had too many delays' },
          { id: 'integrity-deficit', title: 'Integrity Deficit', description: 'Client deserves a high-integrity process but can\'t afford the cost that comes with it' }
        ]
      }
    ])
  })

  it('uses the exact approved Possible Fit copy and action', () => {
    expect(getQuizResultViewModel(2)).toMatchObject({
      gaugeLabel: 'Possible Fit',
      title: 'Possible Fit',
      body:
        'This couple may be a fit for Solagree, but could also benefit from a more open-ended structure. Common reasons include: low likelihood of agreeing on an ADR process, shorter marriages with limited property, strong funding to sustain legal bills, or a high tolerance for a longer process.',
      actionLabel: 'Consider carefully',
      resetLabel: 'Start Over'
    })
  })

  it('uses the exact approved Good Fit copy and action', () => {
    expect(getQuizResultViewModel(3)).toMatchObject({
      gaugeLabel: 'Good Fit',
      title: 'Introduce the Solagree Track',
      body:
        'This client is a good candidate for Solagree. Introduce them to the structured, efficient resolution process during your consultation.',
      actionLabel: 'Good Fit — Move Forward',
      resetLabel: 'Start Over'
    })
  })

  it('uses the exact approved Ideal Fit copy, action, and Initial Consult destination', () => {
    expect(getQuizResultViewModel(6)).toMatchObject({
      gaugeLabel: 'Ideal Fit',
      title: 'Launch the Solagree Process',
      body:
        'This is an ideal Solagree candidate. Move forward with your Solagree package to deliver an efficient, structured resolution for your client.',
      actionLabel: 'Ideal Fit — Priority Case',
      primaryCta: {
        label: 'Book an Initial Consult',
        href: '/book-a-solagree-consult'
      },
      resetLabel: 'Start Over'
    })
  })
})
