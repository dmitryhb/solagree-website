# Solagree Case Qualifier Host Contract

`HIR-253` keeps the approved Case Qualifier reusable by separating its typed schema, v3 session, evaluator, presentation, and host integrations.

## Entry Points

- Homepage: `HomeQuizSection` configures `SolagreeQuizEmbed` for the existing marketing-page heading hierarchy.
- Standalone route: `/quiz` renders `QuizSection` with runtime defaults.
- Public iframe route: `/quiz/embed?ref=<slug>` renders `SolagreeQuizEmbed`, sets `noindex`, and preserves the optional referral slug in the same-site Initial Consult CTA.

All three surfaces use `app/data/quiz-schema.ts`, `useQuizSession`, and `useQuizHost`. There is no route-specific scoring or copy.

## Host Config

`QuizSection` and `SolagreeQuizEmbed` accept an optional `hostConfig` prop:

- `hostId`: stable host identifier attached to emitted events
- `mode`: `standalone` or `embedded`
- `display.showShellHeader`: show or hide the logo/contact shell
- `display.showInstructions`: show or hide the approved instruction panel
- `display.headingLevel`: qualifier title heading level (`1`, `2`, or `3`)
- `analytics.enabled`: enable Google Analytics events
- `analytics.namespace`: source string used for postMessage payloads
- `analytics.trackingId`: optional tracking ID attached to emitted events
- `bridge.postMessage`: mirror host events to `window.parent.postMessage`
- `bridge.targetOrigin`: target origin for postMessage
- `ctas[actionId]`: override CTA href, target, rel, and CTA-specific tracking ID

## CTA Action IDs

- `solagree-consult` defaults to `/book-a-solagree-consult`, the canonical Initial Consult page.

## Privacy-Safe Host Events

Vue hosts can listen through `@host-event`. Iframe hosts can opt into `postMessage`.

- `started`
- `criterion_toggled`
- `completed`
- `outcome_changed`
- `cta_clicked`
- `reset`

Events contain stable criterion/action/outcome IDs, selection booleans, counts, progress, and host context. They never contain criterion labels, arbitrary text, names, email addresses, or phone numbers. CTA events do not emit the destination URL.

Google Analytics mirrors these lifecycle points as `quiz_started`, `quiz_criterion_toggled`, `quiz_completed`, `quiz_outcome_changed`, `quiz_cta_clicked`, and `quiz_reset` with the same bounded ID/count fields.

## Local Restoration

The qualifier stores only `{ version: 3, selectedCriterionIds }` under `solagree.quiz.session.v3`. Restore rejects stale versions, unknown IDs, duplicate IDs, and malformed data. Legacy v1/v2 keys are removed when the qualifier mounts.

## Intentional Boundaries

- No backend or CMS coupling
- No free-text quiz input
- No host-specific scoring
- No route-specific result copy
- No answer labels in analytics or host events
