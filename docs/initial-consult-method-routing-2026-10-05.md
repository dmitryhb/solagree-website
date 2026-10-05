# Initial Consult method routing — October 5 preparation

HIR-246 → HIR-248 → HIR-249 → HIR-250; HIR-609 publication dependency remains in develop.
The user approved preparation of site Phone/Zoom selection and eight active native events:
First Available/Taj/Stacie/James × two methods. Existing paths will serve Zoom; four new paths
serve Phone. Public event conversion, production deployment, merge and Done require their
separate applicable user instructions. No payments, bookings or test sends occurred in this pass.

PR #5 was merged by the user into develop `d994f69`; existing hir-246 was rebased onto it.
Old conflicting September runbook snapshots were superseded by the current develop runbook,
with original history preserved in `backup/hir-246-pre-method-routing`; the September acceptance
record remains on the rebased branch. Other worktrees/uncommitted files were preserved.

## Native configuration prepared

| Choice | Existing path planned for Zoom | New Phone event / path | Prepared host assignment |
| --- | --- | --- | --- |
| First Available | initial-consults/initial-consult | 7352991 / initial-consults/initial-consult-phone | Taj, Stacie, James |
| Taj | initial-consults/initial-consult-taj | 7353022 / initial-consults/initial-consult-taj-phone | Taj |
| Stacie | initial-consults/initial-consult-stacie | 7353030 / initial-consults/initial-consult-stacie-phone | Stacie |
| James | initial-consults/initial-consult-james | 7353046 / initial-consults/initial-consult-james-phone | James |

Four new events were prepared from the closed Jessica template, then the configured First
Available Phone template. Jessica's original event/account/availability were not changed. New
Phone events remain Hidden with a September16-only past range, so no available public dates.
Their release target is the existing 14-calendar-day horizon, not this temporary closed range.

Saved Phone configuration: native Attendee phone number is the sole location; universal
attendeePhoneNumber is hidden and not required; location question is required and labeled Phone
number. Existing Name/Email/State requirements, optional Notes and voluntary unchecked SMS
question remain. Description states 30m/$60 and consultant-calls-attendee instructions, plus
approved two-calendar-day/manual-reschedule/no-show copy. Maximize availability, correct medium
priority host assignments, fixed/weights/future members off. Existing native Stripe $60 USD
collect-on-booking/two-calendar-day refunds and attendee-only/same-host policy were retained.
Independent fresh saved-setting provider QA (GPT-6.1-Sol, medium) PASS for all four;
public views independently show stopped taking bookings on September16/no available dates.

Production email reminders 450309/450313 inherit the four new production Phone links; intended
scope is nine links (original five including paused Jessica + four closed Phone), future-event
application off. Original hidden T3 alone retains test473280/473288. Free James7352395 and free
Phone probe7352910 have all eight workflows OFF; all SMS inactive. Older five-link snapshots in
other evidence describe the state before this preparation. No templates were rewritten here.
New Stacie Phone retains standard smsConsent; old Stacie mixed/Zoom uses sms_opt_in. SMS remains
OFF; any future SMS release must reconcile the predicates per event rather than assume one field.

## Independent four-event provider verification

Fresh own-tab QA PASS for each new ID:30m/Hidden, exact approved Phone description, native Phone
only, Stripe Initial Consults/$60USD/collect on booking/refund2 calendar days. Universal-phone
RequiredOFF independently opened on each; Hidden row/page Save disabled. Location question labeled
Phone number/Required/1Location; Name/Email/State Required; Notes/SMS optional and preview SMS
unchecked. All attendee-only Always reschedule restriction, same-host Always, cancellation enabled,
past/cancelled rebooking off. Notice2h/buffer0before15after/closedSep16 range confirmed; public routes
show no availability and stopped taking bookings on September16. No provider writes or submissions.

Assignments independently match the table; all Maximize availability/medium priority, fixed/weights/
future membersOFF. Default hours retained: Taj Mon–Fri09–17 America/Los_Angeles; James Mon–Fri09–17
America/New_York; Stacie Mon–Thu18:30–21 and Sat12–14 America/New_York. Common/restriction schedules
OFF. Both production workflows have exactly nine intended links/futureOFF; test473280/473288 one
original paid test only/futureOFF; all four SMS inactive; free James and free Phone probe all eight
workflow togglesOFF. Own tab closed and temporary viewer/viewport state left unchanged.

Safe closed-calendar and local method-selection screenshots are retained outside tracked source,
without attendee contacts or
booking/payment/Zoom tokens. It proves preparation closure, not a successful paid Phone booking.
For later E2E verification use --output=/tmp/solagree-hir246-playwright-QA: the default test-results
folder also contains provider artifacts and must not be cleared by the runner.

## Isolated hosted Phone/Zoom field evidence

Hidden free7352910, initial-consults/test-phone-once-20261005, was prepared separately with
Phone-only native location and hidden optional universal phone. Independent QA PASS: saved
Hidden/30m/James-only/paymentOFF/all eight workflowsOFF; Required unchecked in universal-phone
editor, Hidden row, page Save disabled after reload. Public form has exactly one visible required
optionField. Empty native input has willValidate=true/valueMissing=true; hidden universal has
required=false/valueMissing=false. Focus/blur emitted no inline error. **Actual submit rejection
is not proved**: no Confirm, contacts, booking or legally binding acceptance was submitted.
Public native location label is Attendee phone number; no custom Phone label persisted there.
This label does not change the organizer-calls-attendee semantics.

Free Zoom7352395 independently retains one visible required attendeePhoneNumber, blank
valueMissing=true. This proves saved/rendered field separation and browser constraints, not
phone propagation into booking/ICS/email/Stripe metadata or actual integration. No safe form
screenshot was retained from that pass, avoiding prefilled contact disclosure.

## Website preparation

Runtime mode NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_MEETING_METHOD_MODE stays mixed when unset.
Separate mode uses existing *_EVENT_PATH as Zoom and new *_PHONE_EVENT_PATH keys for Phone;
Jessica is excluded before both sets are validated. Published pairs must be complete, valid and
distinct; no fallback to a mixed event on malformed configuration. The customer chooses a
consultant and Phone/Zoom before any calendar mounts. Changing method preserves consultant;
changing consultant retains method; eventPath remounts the native embed. Summary states the
selected method. No duplicate website contact form or custom payment engine is introduced.

Implementation focused checks PASS: Node9, component11, E2E5 (eight-route switching, explicit
method gate, native radio keyboard navigation and390px pointer/no-overflow), changed-file lint and
diff check. Independent integrated code review (GPT-6.1-Sol, high) PASS with no actionable finding;
reusable memory:none. Independent full source QA (GPT-6.1-Sol, medium) PASS: full lint/typecheck, resolver8/8,
lifecycle1/1, component11/11 and browser fixture5/5. Cal.com network is aborted in the fixture;
frame attributes/transitions are asserted, not actual native iframe load or paid lifecycle.
The existing plain-Vite import.meta.client mount-coverage limitation remains unchanged. The added selector originally
overflowed the100%-height summary on mobile; moving it inside the summary grid fixed the observed
overlap and the full focused E2E rerun passed.
Provider prep does not enable this mode in a deployed environment.

## Matrix and release gates

| Criterion | Code | Services | External/release action |
| --- | --- | --- | --- |
| Pair routing, explicit method choice, pause filtering | Implementation/focused tests and independent review PASS; independent full lint/typecheck and focused source/browser QA PASS | Four Phone counterparts fresh saved-config QA PASS, closed; old four remain mixed | Authorized coordinated mode/provider conversion, then public iframe/path checks |
| Phone exactly once and required | Cross-origin fields remain provider-owned | Isolated Phone and Zoom render/blank browser constraints PASS | All four saved-field QA PASS; actual blank rejection/number propagation after specifically approved controlled submit |
| Native price/refund/policy/reminders | 30m/$60/calendar-day policy retained | All four fresh saved-setting QA PASS; nine production reminder links confirmed; original test-only scopes/SMS off preserved | Paid/manual lifecycle and refund-boundary acceptance still open |
| Calendar/Zoom/delivery | No website meeting generation | Prior Taj/Stacie paid evidence; client attests Stacie immediate mail/calendar addition | James free test recipient/scenario approval + user Confirm; future T3 24h/1h, conflicts/native details remain open |

Before an authorized release:

1. Complete independent source/provider QA and remaining service acceptance or explicitly record
   the user's accepted exceptions. Merge permission alone does not authorize production deployment.
2. Snapshot all four existing mixed event fields/locations/descriptions and current release artifact.
   Plan a brief coordinated maintenance window; provider and static-site changes are not atomic.
   Preserve every existing paid appointment and notification binding.
3. At release, change only four existing active mixed events to Zoom-only: retain required visible
   universal phone, Name/Email/State/optional Notes/unchecked SMS; remove native attendee-phone
   location and align descriptions to Zoom instructions. Jessica stays paused. Never change existing
   bookings or cancel/rebook to migrate a meeting method.
4. Restore new Phone booking horizon to14 calendar days, Always14 unchecked; preserve two-hour
   notice/15-minute post-buffer/default host schedules, verify assignments/payment/refunds/roles.
   Publish only in the approved window. Hidden alone is not access control; closed range is the
   current safeguard. Separate event types do not necessarily share distribution counters/limits.
5. Set mode=separate with all eight published relative paths, rebuild/deploy the approved artifact,
   verify four consultant choices/two methods/one iframe, desktop/mobile/timezones and service forms.
   Old shared native links will intentionally show Zoom only; website offers both methods.
6. Rollback must restore both runtime/artifact and old mixed provider settings, then close new Phone
   windows. A mode-only rollback would leave Phone unavailable on old Zoom-only events. Preserve
   any new Phone appointments and their scheduled notices; do not cancel, refund, revoke integrations
   or globally remove reminder bindings as rollback.

Client/calendar-day explanation remains in the unsent draft in the main acceptance packet.
