# Solagree Case Qualifier Results Matrix

This document describes the approved Phase 2 Case Qualifier implemented by `HIR-253`.

Source files:

- `app/data/quiz-schema.ts` defines the three groups and 12 approved criteria.
- `app/utils/quiz-results.ts` defines deterministic score thresholds.
- `app/data/quiz-results.ts` defines exact approved result copy and the Initial Consult CTA.
- `app/composables/useQuizSession.ts` owns selection and v3 local restoration.

## Score Thresholds

| Criteria met | Gauge label | Result title | Action label |
| --- | --- | --- | --- |
| 0 | Awaiting Assessment | None | None |
| 1–2 | Possible Fit | Possible Fit | Consider carefully |
| 3–5 | Good Fit | Introduce the Solagree Track | Good Fit — Move Forward |
| 6–12 | Ideal Fit | Launch the Solagree Process | Ideal Fit — Priority Case |

Every non-zero tier offers `Book an Initial Consult`, routed through host action ID `solagree-consult` to `/book-a-solagree-consult` by default.

## Criterion Matrix

| Group | Criterion | Description |
| --- | --- | --- |
| Financial & Asset Alignment | Simple Estate | Marital estate is approximately $500,000 or less |
| Financial & Asset Alignment | Budget Constraints | Client is hesitant or unable to pay a $7,500+ litigation retainer |
| Financial & Asset Alignment | Financial Transparency | Neither party is alleging hidden assets or significant financial misconduct |
| Financial & Asset Alignment | High-Net-Worth Exception | High-net-worth client seeking a private, confidential alternative to courtroom litigation |
| Client Mindset & Goals | Court Avoidance | Both parties want to avoid court if possible |
| Client Mindset & Goals | Resolution Focus | Client wants a faster, more predictable process |
| Client Mindset & Goals | Co-Parenting Priority | Preserving family relationships or effective co-parenting is a priority |
| Client Mindset & Goals | Ready to Move Forward | The client has said, “I just want this over” |
| Case Suitability | Willing Participants | Both parties will engage in good faith (even if they disagree on outcomes) |
| Case Suitability | Specific Disagreements | Parties have identifiable issues they can’t resolve on their own |
| Case Suitability | Litigation Stuck | Case is stuck in litigation and has had too many delays |
| Case Suitability | Integrity Deficit | Client deserves a high-integrity process but can’t afford the cost that comes with it |

## Interaction Rules

- All criteria remain visible. There are no conditional branches or hidden answers.
- Each checked criterion contributes exactly one point.
- Results update immediately as criteria are checked or unchecked.
- `Start Over` clears the v3 snapshot, returns the assessment to zero, focuses the first criterion, and respects reduced-motion preferences.
- Homepage, standalone, and iframe modes use the same schema, session, evaluator, and result content.
