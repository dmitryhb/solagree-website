import { describe, expect, it } from 'vitest'
import { solagreeCaseQualifierCopy } from '../app/data/case-qualifier'
import {
  solagreeCaseQualifierCriterionGroups,
  solagreeCaseQualifierCriterionIds,
  solagreeCaseQualifierCriterionWeightMap,
  solagreeCaseQualifierTotalWeight
} from '../app/data/case-qualifier-schema'
import type { CaseQualifierCriterionId } from '../app/data/case-qualifier-types'
import {
  evaluateCaseQualifierAnswers,
  getCaseQualifierOutcome,
  getCaseQualifierProgressValue,
  getCaseQualifierResultViewModel
} from '../app/utils/case-qualifier-results'

describe('case qualifier results', () => {
  it.each([
    [0, null],
    [1, 'possible-fit'],
    [2, 'possible-fit'],
    [3, 'good-fit'],
    [5, 'good-fit'],
    [6, 'ideal-fit'],
    [13, 'ideal-fit']
  ] as const)('maps weighted score %i to %s', (score, outcome) => {
    expect(getCaseQualifierOutcome(score)).toBe(outcome)
  })

  it('rejects scores outside the approved integer range', () => {
    expect(getCaseQualifierOutcome(-1)).toBeNull()
    expect(getCaseQualifierOutcome(1.5)).toBeNull()
    expect(getCaseQualifierOutcome(14)).toBeNull()
  })

  it('preserves the exact approved instructions, groups, listening cues, and criteria copy', () => {
    expect(solagreeCaseQualifierCopy.instructions).toBe(
      "Check each criterion your client meets during your initial consultation. If they match 3 or more, they're likely a strong candidate for Solagree. Your recommendation will update in real-time on the right."
    )
    expect(solagreeCaseQualifierCriterionGroups).toEqual([
      {
        id: 'financial-asset-alignment',
        title: 'Financial & Asset Alignment',
        listeningCue: '"I don\'t have $10,000 for a retainer," or "We\'re spending more fighting than the house is worth."',
        criteria: [
          { id: 'cost-limitations', title: 'Cost Limitations', description: 'Client wants a fair, high-integrity process but can\'t afford the cost that comes with it.', weight: 2 },
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
          { id: 'spouse-participation-potential', title: 'Potential for Both Spouses to Participate', description: 'There is evidence that the other spouse may be open to something other than litigation (for example, wants to save costs, time or embarrassment; has already indicated openness to alternatives).' },
          { id: 'specific-disagreements', title: 'Specific Disagreements', description: 'Parties have identifiable issues they can\'t resolve on their own' },
          { id: 'litigation-stuck', title: 'Litigation Stuck', description: 'Case is stuck in litigation and has had too many delays' }
        ]
      }
    ])
  })

  it('orders Cost Limitations first in Section 1 and the participation criterion first in Section 3', () => {
    const [financial, , suitability] = solagreeCaseQualifierCriterionGroups
    expect(financial.criteria.map(criterion => criterion.title)).toEqual([
      'Cost Limitations',
      'Simple Estate',
      'Budget Constraints',
      'Financial Transparency',
      'High-Net-Worth Exception'
    ])
    expect(suitability.criteria.map(criterion => criterion.title)).toEqual([
      'Potential for Both Spouses to Participate',
      'Specific Disagreements',
      'Litigation Stuck'
    ])
  })

  it('uses the exact approved Possible Fit copy and action', () => {
    expect(getCaseQualifierResultViewModel(2)).toMatchObject({
      gaugeLabel: 'Possible Fit',
      title: 'Possible Fit',
      body:
        'This couple may be a fit for Solagree, but could also benefit from a more open-ended structure. Common reasons include: low likelihood of agreeing on an ADR process, shorter marriages with limited property, strong funding to sustain legal bills, or a high tolerance for a longer process.',
      actionLabel: 'Consider carefully',
      resetLabel: 'Start Over'
    })
  })

  it('uses the exact approved Good Fit copy and action', () => {
    expect(getCaseQualifierResultViewModel(3)).toMatchObject({
      gaugeLabel: 'Good Fit',
      title: 'Introduce the Solagree Track',
      body:
        'This client is a good candidate for Solagree. Introduce them to the structured, efficient resolution process during your consultation.',
      actionLabel: 'Good Fit — Move Forward',
      resetLabel: 'Start Over'
    })
  })

  it('uses the exact approved Ideal Fit copy, action, and Initial Consult destination', () => {
    expect(getCaseQualifierResultViewModel(6)).toMatchObject({
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

  describe('weighted scoring', () => {
    const evaluate = (ids: CaseQualifierCriterionId[]) => evaluateCaseQualifierAnswers(ids)

    it('gives Cost Limitations a weight of 2 and every other criterion a weight of 1', () => {
      expect(solagreeCaseQualifierCriterionWeightMap['cost-limitations']).toBe(2)
      expect(
        solagreeCaseQualifierCriterionIds.filter(id => id !== 'cost-limitations')
          .every(id => solagreeCaseQualifierCriterionWeightMap[id] === 1)
      ).toBe(true)
      expect(solagreeCaseQualifierCriterionIds).toHaveLength(12)
      expect(solagreeCaseQualifierTotalWeight).toBe(13)
    })

    it('treats no selection as no outcome', () => {
      expect(evaluate([])).toEqual({ score: 0, outcome: null })
      expect(getCaseQualifierProgressValue(0)).toBe(0)
    })

    it('scores Cost Limitations alone as 2 (Possible Fit)', () => {
      expect(evaluate(['cost-limitations'])).toEqual({ score: 2, outcome: 'possible-fit' })
    })

    it('scores Cost Limitations plus one other criterion as 3 (Good Fit)', () => {
      expect(evaluate(['cost-limitations', 'budget-constraints'])).toEqual({ score: 3, outcome: 'good-fit' })
    })

    it('scores one regular criterion as 1 and two as 2 (Possible Fit)', () => {
      expect(evaluate(['simple-estate'])).toEqual({ score: 1, outcome: 'possible-fit' })
      expect(evaluate(['simple-estate', 'court-avoidance'])).toEqual({ score: 2, outcome: 'possible-fit' })
    })

    it('keeps the 5 and 6 boundaries on the weighted score', () => {
      expect(evaluate(['cost-limitations', 'simple-estate', 'court-avoidance', 'resolution-focus'])).toEqual({
        score: 5,
        outcome: 'good-fit'
      })
      expect(evaluate(['cost-limitations', 'simple-estate', 'court-avoidance', 'resolution-focus', 'litigation-stuck'])).toEqual({
        score: 6,
        outcome: 'ideal-fit'
      })
    })

    it('scores all 12 criteria as 13 (Ideal Fit) without rejection and at 100% progress', () => {
      const evaluation = evaluate([...solagreeCaseQualifierCriterionIds])

      expect(evaluation).toEqual({ score: 13, outcome: 'ideal-fit' })
      expect(getCaseQualifierProgressValue(evaluation.score)).toBe(100)
      expect(getCaseQualifierResultViewModel(evaluation.score)).not.toBeNull()
    })

    it('bounds progress by the total weight', () => {
      expect(getCaseQualifierProgressValue(2)).toBe(15)
      expect(getCaseQualifierProgressValue(6)).toBe(46)
      expect(getCaseQualifierProgressValue(99)).toBe(100)
      expect(getCaseQualifierProgressValue(-3)).toBe(0)
    })
  })
})
