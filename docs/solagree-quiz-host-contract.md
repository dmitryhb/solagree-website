# Solagree Quiz Host Contract

`HIR-40` keeps the quiz core reusable by separating host integration from the schema, session, navigation, and evaluator layers.

## Entry Points

- Standalone route: use `QuizSection` with no props. It resolves Nuxt runtime defaults automatically.
- Embedded module: use `SolagreeQuizEmbed`. It wraps `QuizSection` with embedded defaults and re-emits host events.
- Public iframe route: use `/quiz/embed?ref=<slug>`. The route renders `SolagreeQuizEmbed`, sets `noindex`, skips marketing chrome, and preserves the optional `ref` query value into same-site consult CTAs.

## Host Config

`QuizSection` and `SolagreeQuizEmbed` accept an optional `hostConfig` prop with these bounded concerns:

- `hostId`: host identifier attached to emitted events
- `mode`: `standalone` or `embedded`
- `display.showShellHeader`: show or hide the standalone heading/intro shell
- `display.showExplainer`: show or hide the explainer block under the card
- `analytics.enabled`: gate all emitted progression/completion/CTA events
- `analytics.namespace`: source string used for postMessage payloads
- `analytics.trackingId`: optional tracking id attached to all emitted events
- `bridge.postMessage`: mirror host events to `window.parent.postMessage`
- `bridge.targetOrigin`: target origin for postMessage
- `ctas[actionId]`: override CTA href, target, rel, and CTA-specific tracking id

## CTA Action IDs

CTA routing is keyed by stable action ids instead of hardcoded page checks:

- `solagree-consult`

Every result displays the Initial Consult action. The host layer decides its final destination URL.

## Host Events

When analytics is enabled, the quiz emits bounded integration events:

- `question_viewed`
- `question_answered`
- `progressed`
- `completed`
- `cta_clicked`
- `reset`

Vue hosts can listen via `@host-event`. Embedded iframe hosts can opt into `postMessage`.

## Intentional Boundaries

- No backend or CMS coupling
- No host-specific branching inside the evaluator
- No provider-specific analytics SDK in the quiz core
- No result-policy changes beyond resolving CTA destinations and event emission
