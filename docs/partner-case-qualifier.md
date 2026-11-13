# Partner Case Qualifier

The Case Qualifier is an approved-partner tool and is intentionally separate
from the public Solagree consumer quiz.

- Route: `/partner-tools/case-qualifier-7h3m9k`
- Indexing: `noindex, nofollow`
- Discovery: no homepage, navigation, footer, or sitemap link
- Static hosting: explicitly prerendered because the crawler cannot discover it
- State: stored under `solagree.case-qualifier.session.v1`, independently from
  the public quiz
- Figma: https://www.figma.com/design/AbFRWs6JeFsD6LNGIYdAmG?node-id=19-3

The unlisted URL is not an authentication boundary. If access must be
restricted beyond link sharing, add a portal-authenticated route instead of
relying on obscurity.

## Host integration

The qualifier keeps its own scoring, persistence, and event union (`started`,
`criterion_toggled`, `completed`, `outcome_changed`, `cta_clicked`, and
`reset`). It shares only host config merging, event context, callback/iframe
dispatch, and CTA override mechanics with the public quiz.

The iframe bridge is disabled by default. When `bridge.postMessage` is enabled,
`bridge.targetOrigin` must be one explicit `http` or `https` origin such as
`https://partner.example`. Missing, wildcard (`*`), malformed, non-web, and
path-bearing values send no parent-window message while local Vue callbacks
continue to receive qualifier events.

## Scoring

Each criterion carries a `weight` in `app/data/case-qualifier-schema.ts`
(default 1 when omitted). The score is the sum of the weights of the checked
criteria, so it is not the same as the number of checked boxes.

- Cost Limitations (Section 1, first item) has weight 2; the other 11 criteria
  have weight 1. The maximum score is 13.
- Outcome thresholds are unchanged: 1-2 Possible Fit, 3-5 Good Fit,
  6 and above Ideal Fit. Cost Limitations alone therefore scores 2 (Possible
  Fit).
- Progress is the score divided by the total weight (13), not by the number of
  criteria.
- Analytics events (`criterion_toggled`, `completed`, `outcome_changed`,
  `cta_clicked`) carry the weighted `score` and `progress`, and the
  `criteria_met` analytics parameter carries the weighted score too. Figures
  from before the weighting change are not comparable with later ones.

## Saved sessions and renamed criteria

Criterion ids are stable storage keys. Two criteria were renamed with new ids:

| Previous id | Current id | Current label |
| --- | --- | --- |
| `integrity-deficit` | `cost-limitations` | Cost Limitations |
| `willing-participants` | `spouse-participation-potential` | Potential for Both Spouses to Participate |

Snapshots saved under `solagree.case-qualifier.session.v1` with the previous
ids are mapped to the current ids when parsed
(`solagreeCaseQualifierLegacyCriterionIdMap`), so an in-progress selection is
kept. The schema version stays at 1.
