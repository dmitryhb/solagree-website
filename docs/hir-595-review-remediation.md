# HIR-595 review remediation

## Scope and integration

Baseline: `develop` at `fa8132d488c456cea74a22e7433e3c2f2c35edcb`.
Parent: https://linear.app/hirebrains-io/issue/HIR-595.

Implementation branches start from that current develop baseline with bare issue IDs. Dependent changes are cherry-picked into child branches and the `hir-595` integration branch for review; `develop` remains subject to explicit merge approval.

| Issue | Work | Implementation route | Dependencies |
| --- | --- | --- | --- |
| HIR-596 | Quiz persistence and completion events | Terra/high | — |
| HIR-597 | Stored consult answer validation | Sol/xhigh | 596 |
| HIR-598 | npm test entrypoints | Terra/high | — |
| HIR-599 | Form focus and busy semantics | Terra/high | — |
| HIR-600 | Shared form fields | Sol/xhigh | 597, 599 |
| HIR-601 | Vue co-branded renderer | Sol/xhigh | 598, 600, 602 |
| HIR-602 | Route/service error mapping | Terra/high | — |
| HIR-603 | Shared host infrastructure | Sol/xhigh | 596, 597 |
| HIR-604 | Qualifier tokens and shared section styles | Terra/high | 601 |
| HIR-605 | Shell metadata and legacy redirects | Terra/high → Sol/xhigh for SPA diagnosis | 602, 603 |
| HIR-606 | Unused scaffolding cleanup | Luna/medium | 603 |
| HIR-607 | Analytics title investigation | Terra/high | — |
| HIR-608 | Independent integrated acceptance | Sol/xhigh | All above |

Review and QA use independent agents. Public-contract changes and the full integrated diff require at least Sol review. No production deployment, merge, or Done transition is part of this execution authorization.

## Compatibility contracts

- Preserve approved copy, pricing, public paths, API payloads, noindex behavior, variant precedence, URL allowlists and logo restrictions.
- Preserve disabled-by-default quiz embedding and separate quiz/qualifier engines and storage.
- Keep valid partial consult answers. Existing snapshots and the Portal payload do not encode a retention limit. A future retention duration or completed-only policy requires a product decision.
- Preserve HTTP and client legacy redirects, including the documented server-only sitemap exception.
- Live booking/payment/provider acceptance remains separate from local stubbed checks and HIR-250.

## Route shell and legacy redirect contract

- Pages declare `appShell` metadata (`home`, `internal`, or `bare`); `app.vue` initializes from Vue Router's current route and applies metadata after each successful committed navigation rather than maintaining route path sets. The single router hook lives for the app component lifetime and ignores cancelled or failed navigations.
- Browser history coverage waits until the URL, Vue Router route, destination page component and `page-appear` transition agree before it drives another history action. This verifies settled Back/Forward behavior without overlapping Nuxt's existing `out-in` transitions.
- Production nginx owns direct HTTP redirects. The global client middleware mirrors redirects that resolve to application pages, including bare and trailing `/author` paths.
- `/site-map` remains nginx-only because its destination is the static `/sitemap.xml` server route. `/c/*` keeps its nginx regex redirect and its client page redirect for SPA and development navigation.

## Preflight evidence

Memory CLI fallback: `/Users/dmitry/work/dai/agent-knowledge`, repository `solagree-website`, domain `frontend`, limit 5. Searches for quiz persistence/restore/validation, form validation/busy/focus, test/build/npm and route status/slug errors returned no matches. Existing repository build-entrypoint memory was checked against `package.json`: use `npm run build` so resource-content validation executes.

Read-only Portal inspection found quiz-answer shape/text validation in `server/utils/consult-requests/validation.ts`, persistence in `server/utils/consult-requests/creation.ts`, and intake export in `server/utils/hubspot/form-submissions.ts`. None establishes a quiz completion or retention policy.

Baseline and final local screenshots are under `artifacts/hir-595/` in the integration worktree: homepage, military family landing and qualifier at 390, 768, 960, 980 and 1440 CSS pixels. External requests were blocked.

## Acceptance evidence

### Reviewed revisions

Verification date: 2026-09-15. Integration branch: `hir-595`.

- Independent Sol integrated review covered `fa8132d..bc5d762` and found no additional production-code defects after the individual reviews and corrections.
- The remaining test-environment finding was resolved by reviewed supplemental commit `fef116e`, integrated as `032ed23`: bare Vue tests now provide Nuxt's `definePageMeta` macro. Final `npm test` passes at `032ed23`.
- Production build and static generation ran in the isolated `hir-608` checkout at `7646081`, whose tracked tree was identical to `bc5d762`. The later supplement changes only test setup.
- All independent reviewers returned **reusable memory: none**; there was nothing to promote. The authoritative `origin/develop` was fetched again and remained `fa8132d`.

### Repository gates

| Check | Result | Local evidence under `artifacts/hir-595/` |
| --- | --- | --- |
| `npm test` | 344 Vitest tests across 34 files + 35 Node tests passed | `final-unit-tests.log` |
| `npm run lint` | Passed; supplemental test setup also passed focused ESLint | `final-lint.log` |
| `npm run typecheck` | Passed | `final-typecheck.log` |
| `npm run build` | Passed, including resource-content validation | `final-build.log` |
| `npm run generate` | Passed, 79 routes prerendered | `final-generate.log` |
| `npm run verify:sitemap` | Passed | `final-sitemap.log` |
| `npm run verify:co-branded-noindex-nginx` | Passed configuration check | `final-noindex.log` |
| Generated HTML | One `main-content` anchor on sampled routes; quiz/embed, qualifier and review retain noindex | `static-html-checks.json` |
| Full diff and corrections | `git diff --check` passed | Independent review comments in HIR-595 children |

No knip entrypoint is configured in this repository.

### Browser and visual acceptance

- Independent six-form QA passed: connected labels and exact baseline control contracts, native/custom invalid focus with zero requests, pending/disabled state, focused error/success states, destinations and exact payloads. Attorney missing bar states focuses its first checkbox. All POSTs were intercepted locally. See [forms QA report](../artifacts/hir-595/forms-qa-report.md) and its reproducible runner/results.
- Independent interactive QA passed **63/63 browser checks**, plus 100 focused Vitest and 10 Node tests: representative quiz branches, restoration/reset/back/reload and once-per-attempt completion; separate qualifier storage/events; bridge off and explicit trusted-origin delivery with unsafe origins rejected; four co-branded variants; FAQ/modal keyboard behavior; optional configuration and attorney/CDFA form lifecycle/payloads. All four page/embed variants include held error and success responses, with eight POSTs intercepted locally. See [interactive QA report](../artifacts/hir-595/interactive-qa-report.md).
- Analytics was reproduced and verified with a fake local GA identifier and blocked external traffic. Seven browser scenarios cover direct, SPA, query-only, hash-only, cancelled rapid navigation, error-route and disabled-function behavior, including rendered-title accuracy and one final page view for the cancelled-navigation case. See [analytics verification](analytics-page-view-verification.md).
- HIR-605 independent re-review passed its three Chrome scenarios, nine component tests and two metadata tests. Ordinary navigation, settled repeated history, cancelled navigation and direct embed are covered. Broader independent route QA passed 10/10 direct entries and 9/9 SPA destinations after hydration, with expected header, robots metadata and single main anchor; see [route QA matrix](../artifacts/hir-595/route-qa-results.json). Separately, 10 redirect/noindex Node tests passed, and a hydrated Chrome run verified six client redirects including `/author`, `/author/`, trailing slashes, category slug and `/c/*`; see [redirect results](../artifacts/hir-595/route-qa-redirects.json).
- Attorney/CDFA standalone/embed semantic text and link arrays match the baseline exactly; all eight screenshot dimensions match. Vue's removal of whitespace-only nodes between blocks changes raw concatenated `textContent`, without changing visible copy or links.
- Homepage and qualifier dimensions match at all five widths. Corrected family screenshot dimensions match exactly at all five widths; threshold-30 pixel differences are at most 0.00105%, consistent with the development overlay. See `after604-visual-comparison.json` and `corrected604-visual-comparison.json`.
- All seven forms retain desktop/mobile geometry. The co-branded optional-label separator and 21px label line height were corrected and re-reviewed; native control contracts match exactly. See `corrected600-form-check.json` and `corrected600-visual-comparison.json`.

### Remaining external acceptance and existing limitations

- No deployment, merge, real customer submission, payment or production analytics event was performed. Live booking/payment/provider acceptance remains HIR-250.
- nginx is not installed locally. Its redirect/noindex configuration and client equivalents are checked; actual deployed HTTP redirects and `X-Robots-Tag` headers still require the deployment environment. `/site-map` remains an intentional server-only redirect.
- Chrome rejects the pre-existing `[-.\s]` phone patterns in attorney, CDFA, consult and co-branded forms under its HTML `v`-mode grammar. QA explicitly verified malformed phone submissions for attorney, CDFA and consult; co-branded browser logs show the same invalid-pattern warning, but malformed co-branded submission was not probed. Baseline source and DOM confirm the patterns were unchanged. Portal-side rejection/delivery was not tested. This is a separate existing validation issue, not a migration regression.
- Valid partial quiz answers remain eligible for consult payloads. No existing contract establishes a TTL or completed-only rule; this execution does not invent one.

Raw browser screenshots, fixture runners and logs are local acceptance artifacts, not tracked production files. No designated Notion mirror was found for these repository documents.
