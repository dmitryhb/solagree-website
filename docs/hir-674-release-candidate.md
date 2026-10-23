# HIR-674 pricing release candidate

- Candidate: HIR-674 RC1, branch `hir-674`; identify the candidate by the commit containing this report.
- Base: `develop` at `eb4c9dbe3c4de3a5bbe2e56026705c72d316cbcd`.
- Issue: https://linear.app/hirebrains-io/issue/HIR-674/website-apply-final-core-prices-and-military-pricing-display
- Implementation date: 2026-10-23.
- This document records a candidate only. It does not authorize release, deployment or merge.

## Expected page evidence

| Page | Parenting per person | Financial per person | Combined per person | Combined badge |
| --- | --- | --- | --- | --- |
| `/` | $3,500 | $4,800 | $5,990 | Save $2,000 Each |
| `/divorce-special-needs-children` | $3,500 | $4,800 | $5,990 | Save $2,000 Each |
| `/military-divorce` | $3,150 (regular $3,500) | $4,320 (regular $4,800) | $5,390 (regular $5,990) | Save $2,000 Each |

Military amounts are literal approved final prices. Combined is $1 below an exact 10% reduction. The introduction states "at least 10%" and explains the extra $1 per person. Ordinary bundle savings are $2,310 and Military savings are $2,080; both retain the approved conservative badge.

Military cards label regular and Military prices for assistive technology, including per-person units. The regular price uses the same text color and a 1px strike. Price groups can wrap between regular and final amounts while keeping final amount and per-person cadence together. The existing shared card and Best for desktop subgrid remain in use.

## Implementation verification

Passed in the isolated candidate checkout with its own `npm ci` installation:

- `npx vitest run tests/pricing.component.test.ts`: 5 tests, including home defaults, explicit Military values, repeated ordinary/Military prop changes, independent simultaneous sections, family theme changes, accessible comparison text and preserved benefits/CTA/Best for content.
- Targeted ESLint for all touched TypeScript/Vue files: passed.
- `git diff --check`: passed.
- Source audit across `app` and `public`: no remaining $2,250/$2,995 Core prices or old $1,000 savings badge. The only quantified current Core discount claim is the corrected Military introduction. The separate One Case Challenge discount is unquantified and unchanged.
- Consultation amounts $60/$250/$50, track descriptions, benefits and CTA destinations are unchanged.

Independent acceptance on application commit `3d1020184d1ebe0f11bb06f608e78c80b0dbc742`:

- Fresh independent Sol review: no actionable findings; reviewer independently passed all 5 pricing component/data tests. Reusable memory: none.
- Full `npm run lint` and `npm run typecheck`: passed.
- Full `npm test`: 376 Vitest and 151 Node tests passed, zero failures/skips.
- Fresh `npm run generate`: passed. This local verification build has no deployment environment configured, so the deployment manifest is deliberately omitted; it is not a deployable release artifact.
- Generated HTML checks passed for all three pages, including exact ordinary/Military prices, comparisons, per-person units and Combined badge; no obsolete Parenting price or savings badge in current pricing sections.
- Independent headless Chrome: 33 page/viewport checks passed with zero runtime errors. Direct load and hard refresh passed for all three pages at 1440, 1024, 768, 390 and 320px. Actual footer Nuxt navigation home -> Military -> Special Needs -> Military retained a same-document marker, rendered the expected page and showed correct prices each time. Card/price/document overflow checks and desktop Best for alignment passed. External network requests were blocked during local browser QA.
- Reviewed screenshots at desktop, tablet and 320px confirm readable prices, thin same-color strikes and narrow-width wrapping. Section screenshots use document-coordinate capture to avoid fixed-header capture artifacts.
- Browser assertions wait for the target page to render after URL changes; the initial immediate assertion observed the outgoing page during a transition and was corrected in the QA harness. No application fix was needed.

Evidence is retained locally under `.codex-artifacts/hir-674-675-20261023/website/` in the owner's Website workspace: reproducible QA scripts, `results.json`, generated-page hashes and viewport screenshots. Generated HTML SHA-256:

| Page | SHA-256 |
| --- | --- |
| `/` | `b698e44ceaf2392f8bd1c446bda3137dfd94ff81c503e21f06bb64d00f039401` |
| `/military-divorce` | `7fa12193892f2592e3b28cd273ca95f65aed19a056db11a8a3a97de214c425bb` |
| `/divorce-special-needs-children` | `50fd68a542fb20b3d1044b84512fbc196c4e81cdfee6fec479a1d1087253c61a` |

## Separately authorized release

Coordinate the public website release with the ordinary Portal catalog change so advertised and newly created case prices agree at $3,500 / $4,800 / $5,990. Portal Military eligibility and discounts remain deferred pending Jill's eligibility rule. Historical case/payment snapshots are outside this change.

Before a separately authorized release, record the verified candidate commit, generated release manifest/version, browser/page evidence and matching Portal candidate. No deploy, merge, historical-data mutation or external messages are authorized by this report.
