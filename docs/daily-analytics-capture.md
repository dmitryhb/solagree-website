# Versioned daily analytics capture (HIR-274)

The existing Website GA/host event behavior is preserved. A separate versioned
behavior capture is disabled by default. It requires
`NUXT_PUBLIC_ANALYTICS_CAPTURE_ENABLED=true`, the existing production deployment
environment, and the host analytics setting. Staging stays disabled under HIR-619.
No configuration was activated during implementation.

Capture has stable UUID attempt/event IDs, an instrument and schema version,
occurred time, a whitelisted non-PII outcome/action and optional existing journey
context. It contains no quiz answers, criterion selections, names, email, URLs,
notes or tags. Journey proof is an existing browser-only possession credential,
sent in the private capture envelope; never add it to analytics/URL/provider data.

Refresh/Back/result rerender/restoration keep the attempt. Explicit Reset starts a
new ID. Existing quiz/qualifier answer keys, schema versions, TTL and restoration
are unchanged. Legacy restored snapshots receive no invented milestone times.
Qualifier result events mean a result was shown after interaction, not completing
a questionnaire. Later qualifier edits retain latest outcome while each CTA keeps
its own outcome. Quiz first-completion outcome is retained.

A bounded retry queue retains up to 100 exact events per instrument locally.
A successful acceptance removes its event. Disabled capture sends nothing.
Storage failures fall back to page-lifetime memory through HIR-620's safe adapter.
No cross-device/person identity is inferred after storage loss. Portal strictly
validates envelopes and existing journey proof. A public behavior event alone
cannot create a booked/paid/signed/activated event.

The reporting source/runbook is in Portal `docs/analytics.md`. Production enablement,
coverage start, actual GA4/Cal/Zoom acceptance and scheduler activation remain
separate authorized operations.

A completed pre-capture quiz is excluded from new first-completion capture across
Back/Next, answer edits and reloads until explicit Reset creates a new attempt.
A partially restored legacy attempt may record a genuinely new explicit result,
with no invented start. This distinction is separate from the existing host
completion events and storage restoration behavior.
