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
| HIR-605 | Shell metadata and legacy redirects | Terra/high | 602, 603 |
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

- Pages declare `appShell` metadata (`home`, `internal`, or `bare`); `app.vue` selects shared chrome from that metadata rather than route path sets.
- Production nginx owns direct HTTP redirects. The global client middleware mirrors redirects that resolve to application pages, including bare and trailing `/author` paths.
- `/site-map` remains nginx-only because its destination is the static `/sitemap.xml` server route. `/c/*` keeps its nginx regex redirect and its client page redirect for SPA and development navigation.

## Preflight evidence

Memory CLI fallback: `/Users/dmitry/work/dai/agent-knowledge`, repository `solagree-website`, domain `frontend`, limit 5. Searches for quiz persistence/restore/validation, form validation/busy/focus, test/build/npm and route status/slug errors returned no matches. Existing repository build-entrypoint memory was checked against `package.json`: use `npm run build` so resource-content validation executes.

Read-only Portal inspection found quiz-answer shape/text validation in `server/utils/consult-requests/validation.ts`, persistence in `server/utils/consult-requests/creation.ts`, and intake export in `server/utils/hubspot/form-submissions.ts`. None establishes a quiz completion or retention policy.

Baseline local screenshots are under `artifacts/hir-595/` in the integration worktree: homepage, military family landing and qualifier at 390, 768, 960, 980 and 1440 CSS pixels. External requests were blocked. These are comparison inputs, not final acceptance.

## Acceptance evidence

Pending implementation, independent review and integrated QA. Do not interpret this plan as a passing verification report.
