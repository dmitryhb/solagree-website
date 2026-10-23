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

Independent QA must append actual generated-page and browser evidence before acceptance: full lint/typecheck, static generation, all three generated pricing sections, direct loads/hard refresh, actual client-side navigation in both directions, desktop/tablet/mobile wrapping and overflow, and desktop Best for alignment. Component rerender tests are supporting evidence, not a substitute for browser navigation.

## Separately authorized release

Coordinate the public website release with the ordinary Portal catalog change so advertised and newly created case prices agree at $3,500 / $4,800 / $5,990. Portal Military eligibility and discounts remain deferred pending Jill's eligibility rule. Historical case/payment snapshots are outside this change.

Before a separately authorized release, record the verified candidate commit, generated release manifest/version, browser/page evidence and matching Portal candidate. No deploy, merge, historical-data mutation or external messages are authorized by this report.
