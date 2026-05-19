# Code Review — Cleanup & Refactor Backlog

Findings from a pass over `app/` and `shared/` on 2026-05-19, after the CDFA + webinar registration work landed. Each item is scoped so it can be picked up independently. The current API/composable patterns in [api-patterns.md](api-patterns.md) and [code-style.md](code-style.md) are respected — items here are duplication *on top of* those patterns, not changes to them.

## High — clear duplication

### 1. `AttorneySelectOption` and `ConsultSelectOption` are the same type

Two identical generic option interfaces live in different files and are used cross-domain:

- [app/types/attorney-application.ts:34](app/types/attorney-application.ts) — `AttorneySelectOption<TValue>`
- [app/types/consult-request.ts:15](app/types/consult-request.ts) — `ConsultSelectOption<TValue>`

`AttorneySelectOption` is already imported by CDFA data ([app/data/cdfa-application.ts:8](app/data/cdfa-application.ts)) and used to type 5 option arrays — so the "attorney" prefix is misleading.

**Refactor:** extract a single `SelectOption<TValue>` (e.g. `app/types/form-options.ts`), remove both duplicates, update imports in `data/` and `components/attorney/AttorneyApplicationSelectField.vue`.

### 2. `AttorneyApplicationTextField` / `AttorneyApplicationSelectField` are generic but live under `attorney/`

`CdfaApplicationForm.vue` uses these components 11 times (text field × 8, select × 3 — see [app/components/cdfa/CdfaApplicationForm.vue:37-153](app/components/cdfa/CdfaApplicationForm.vue)). The components contain no attorney-specific logic.

**Refactor:** move to `app/components/form/` (or `app/components/application/`) and rename to `ApplicationTextField.vue` / `ApplicationSelectField.vue`. Update imports in attorney + cdfa form components.

### 3. `*ApplicationSentPage.vue` are 90% identical

- [app/components/cdfa/CdfaApplicationSentPage.vue](app/components/cdfa/CdfaApplicationSentPage.vue) (24 lines)
- [app/components/attorney/AttorneyApplicationSentPage.vue](app/components/attorney/AttorneyApplicationSentPage.vue) (24 lines)

Only differences: the heading `id`/`aria-labelledby` slug and one sentence of body copy ("CDFA® Network application" vs. "application").

**Refactor:** single `ApplicationSentPage.vue` accepting `slug` (for the aria id) and `description` (or a slot) props. Move under `app/components/application/` alongside the field components.

### 4. `*ApplicationResult` form-state types are structurally identical

- [app/types/cdfa-application.ts:34-38](app/types/cdfa-application.ts) — `CdfaApplicationResult { kind, title, message }`
- [app/types/attorney-application.ts:39-43](app/types/attorney-application.ts) — `AttorneyApplicationResult { kind, title, message }`

Same shape, same usage (display submission feedback).

**Refactor:** a single `ApplicationResult` (next to the shared `SelectOption` from item 1). Keep domain-specific types for actual form state and payloads — only consolidate the truly generic pieces.

## Medium — same structure, diverging details

### 5. Three submission service modules repeat the same skeleton

[`submitCdfaApplication`](app/services/cdfa-application-api.ts), [`submitAttorneyApplication`](app/services/attorney-application-api.ts), [`submitWebinarRegistration`](app/services/webinar-registration-api.ts), [`submitConsultRequest`](app/services/consult-request-api.ts), [`submitContactSubmission`](app/services/contact-submission-api.ts) all duplicate:

- `normalizePortalApiBaseUrl` (1 line each)
- `*ApiResult = Response | ErrorResponse` discriminated union
- `*FetchOptions`, `*Fetcher` typed contract
- `Submit*Options { portalApiBaseUrl, fetcher }`
- generic error-message helper (`get*SubmissionErrorMessage`)

The existing `api-patterns.md` doc says one module per domain — that's fine. But the **boilerplate** (URL normalization, error-message helper, fetcher contract, options shape) can be lifted without violating that pattern.

**Refactor:** a small `app/services/portal-api.ts` with:
- `normalizePortalApiBaseUrl(base): string`
- `getPortalSubmissionErrorMessage(error, fallback): string`
- shared `PortalFetcher<TBody>` / `PortalSubmitOptions` types

Each domain service keeps its payload builder, endpoint constant, narrowing predicates, and `submit*` function — but reaches into the shared helpers instead of redefining them.

Skip a "generic factory" — that fights the codebase's explicit one-module-per-domain convention.

### 6. Narrowing predicates inside service modules duplicate the literal unions

Examples: `isAttorneyYesNoAnswer`, `isAttorneyMediationExperienceValue`, `isCdfaCertificationStatusValue`, `isCdfaClientExperienceValue`, `isCdfaClientSourceValue`, `isCdfaConsultationInterestValue`. Each enumerates the same literals already defined in the corresponding `shared/types/*` union.

**Refactor:** export the literal arrays alongside the unions in `shared/types/*-application.ts`:

```ts
export const CDFA_CERTIFICATION_STATUS_VALUES = ['active_cdfa', 'divorce_financial_advisor', 'pursuing_certification'] as const
export type CdfaCertificationStatusValue = (typeof CDFA_CERTIFICATION_STATUS_VALUES)[number]
```

Then the service uses a generic `isMember(arr, value)` predicate. This removes ~30 lines from each application API module and makes the union the single source of truth.

### 7. `useCdfaApplicationForm` and `useAttorneyApplicationForm` share submission flow

[app/composables/useCdfaApplicationForm.ts](app/composables/useCdfaApplicationForm.ts) and [app/composables/useAttorneyApplicationForm.ts](app/composables/useAttorneyApplicationForm.ts) both implement: `submitting` ref, `submissionResult` ref, success/error result tracking, `getSubmissionErrorMessage` integration, redirect-on-success.

The form *state* differs legitimately (CDFA has `specializations: []`, attorney has `licenseNumbers: AttorneyLicenseNumberRow[]`). The *submission orchestration* doesn't.

**Refactor:** extract `useApplicationSubmission<TForm, TResponse>({ submit, onSuccess })` returning `{ submitting, submissionResult, handleSubmit }`. Each domain composable keeps its own state factory and validation, but delegates the submit lifecycle.

## Low — nice-to-have

### 8. Page-level wrappers under `app/pages/webinar/` repeat boilerplate

- [app/pages/webinar/index.vue](app/pages/webinar/index.vue), [app/pages/webinar/cdfa/index.vue](app/pages/webinar/cdfa/index.vue) (registration entry)
- [app/pages/webinar/view.vue](app/pages/webinar/view.vue), [app/pages/webinar/cdfa/view.vue](app/pages/webinar/cdfa/view.vue) (post-registration view)

Each is ~15-20 lines: import the page component, call `useSolagreeSeo`, render. Variation is purely SEO metadata + which content object is passed in.

**Refactor (optional):** keep as-is. The duplication is shallow and the explicit per-route SEO call is readable. Only revisit if a third webinar variant lands.

### 9. `app/data/*-application.ts` files follow the same export shape

[app/data/cdfa-application.ts](app/data/cdfa-application.ts) (62 lines) and [app/data/attorney-application.ts](app/data/attorney-application.ts) (36 lines) both export `as const satisfies readonly SelectOption<TValue>[]` arrays plus an `initial*FormState` constant. Pattern is consistent; no factory needed. Worth keeping the convention documented in `code-style.md` instead.

## Out of scope (deliberately not flagged)

- `app/types/*` vs `shared/types/*` split — the form-state types accept `''` for unselected; the shared payload types don't. That's a real, useful distinction.
- One-module-per-API-domain in `services/` — documented and intentional per `api-patterns.md`. Items 5–6 work within that, not against it.
- `app/pages/review/*` — these are intentional preview pages, not production code paths.

## Suggested order

1. Items **1, 3, 4** — pure type/component moves, no logic changes. ~1-2 hours.
2. Item **2** — component rename + import sweep. ~30 min.
3. Item **6** — export literal arrays from `shared/types/*`, simplify predicates. ~1 hour, touches all 5 service modules.
4. Item **5** — extract `portal-api.ts` helpers. ~1-2 hours.
5. Item **7** — extract `useApplicationSubmission`. ~1-2 hours.
