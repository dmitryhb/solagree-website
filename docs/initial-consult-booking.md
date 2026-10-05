# Initial Consult booking operations

This runbook records the non-secret Cal.com configuration used by the Initial Consult booking page. Keep credentials, OAuth tokens, recovery codes, and 2FA codes out of this file and out of Linear.

## Current acceptance contract — October 5, 2026

This section and [the current acceptance matrix](initial-consult-acceptance-2026-10-05.md)
supersede the dated snapshots below. Implementation order is HIR-246 → HIR-248 → HIR-249 →
HIR-250. HIR-609 is already an ancestor of current `develop`; it provides reversible publication
of Taj, Stacie and James, with Jessica paused and her profile retained.

- Consultation: 30 minutes, $60 USD paid to Solagree, Phone or Zoom.
- Refund configuration: native `If cancelled 2 calendar days before`, saved on all five events
  September 29. October 5 admin recheck confirms this setting on all five events and hidden test 7253414.
  The actual threshold and Stripe refunds still require acceptance.
  Do not promise exactly 48 elapsed hours, midnight, a specific timezone or equality/DST behavior.
- One complimentary reschedule is requested from Solagree and processed by an operator.
  The Host and attendee scope blocks both roles. Later October5 the hosted selector was configured as
  Attendee only / Always; own-host picker access passed. Paid lifecycle acceptance remains open.
- Email is sufficient for launch. SMS is a separate optional channel, remains inactive, and does
  not block email acceptance. Preserve voluntary, unchecked consent on every event.
- Cal.com Support reports no hosted sandbox for native paid bookings. The two earlier separately approved
  $0.50 tests are historical evidence; on October5 the user separately approved/completed one
  Stacie Zoom/$0.50 test (T3). None authorizes another payment or refund. The user completes
  every new payment and real refund. Obtain scenario/recipient approval before a test submission
  that can send mail, create calendar entries or generate conferencing links.
- PR #1 policy copy is now in develop after an external merge (`9951295`) discovered during
  the later October 5 Stripe resumption. This agent performed no merge or production deployment.
  The user also merged Stripe evidence PR #2 (`aa24ff8`) and configuration PR #3 (`989827a`).
  T3 evidence PR #4 is also merged (`36ed4ed`); this later policy/QA supplement is prepared
  separately. Merge, production deployment and Done
  require separate user instruction. The historical HIR-609 staging deployment is not production acceptance.

Historical observations are dated evidence, not proof that today's saved configuration or delivery
is correct. The user restored Cal.com admin access on October 5 and current configuration rechecks are recorded
in the matrix. Stripe access was restored later the same day: after user-completed T3 the matrix records
three successful $0.50 payments, one incomplete checkout and one sent receipt per paid test.
The earlier pre-T3 refund list was empty; T3 detail shows no refund activity. No refund is accepted.
T3 immediate email receipt and calendar addition are now client-attested. Direct content/count/
header timestamps, historical delivery, future reminders and the broader payment/lifecycle matrix remain open.

## Later October 5 policy verification

PR #4 was merged by the user into develop36ed4ed. Support215476247361743 now replied:
no phone-field mapping/conditional editor visibility; making the universal phone optional does
not satisfy Zoom-required. Separate Phone/Zoom routing is under scope review, not implemented.

The user now reports client confirmation that all immediate emails were received and the
calendar entry added for Stacie T3. Record these as client-attested results; no direct inbox/
host-destination inspection, exact message counts/content/timestamps or arbitrary busy conflict
was supplied. This does not prove other hosts, historical tests or future24h/1h reminders.
Awaiting access is no longer the status for the reported delivery/calendar addition.

Hidden7253414 and all five production rescheduling settings now saved ON / Attendee only /
Always, plus same RR host ON / Always reschedule with the same host. Cancellation remains
enabled; past/cancelled rebooking remain off. T3 canonical confirmation
has Cancel only, retains paid status/Zoom. The selector exists in hosted6.9.11-h; the prior
blanket no-organizer interpretation of the Help article is superseded for this role setting.
Support's own-organizer no-recharge claim and manual one-change handling still need lifecycle
acceptance; no booking was changed or lifecycle email sent. Independent hidden saved-policy and
Stacie-own-host/admin pre-submit access PASS; independent all-six saved rollout QA PASS.
Fully loaded price/refund views still show five$60USD/hidden$0.50USD on booking /2calendar days.
Jessica remains Hidden/closedSep16; hidden test email24h/1hON, productionremindersOFFforhidden,
allSMSOFF. No paid booking was changed.
Support's UTC/inclusive/48h refund explanation is not actual threshold/refund evidence. Retain
approved two-calendar-day wording/setting pending reconciliation.

All five production descriptions were empty; the approved30m/$60, Phone/Zoom instructions,
manual one-free request up to2calendar days, cancellation2calendar/full refund/late non-refundable
and no-show/new paid booking copy is now saved. Independent copy review PASS; persistence and
public rendering QA PASS: all five persisted exactly with Save disabled; public First Available/Stacie
show the copy in a 180px scrollable description panel without Read more. Hidden T3 description was not touched. Source behavior is unchanged.

Independent live public desktop/mobile/timezone QA: all4 paths30m/$60/Phone+Zoom, required
labels Name/Email/Phone/State, optional Notes/SMSunchecked/noattribution. Zoom phone-once PASS;
Phone exactlyonce FAIL (two required inputs). Bounded1440/390 layouts and one equivalent UTC
slot across Amsterdam/NewYork/LosAngeles passed; no production payment/validation/delivery
inference. Native form lacked Solagree policy copy in that earlier pass; the later native
description implementation above is checked separately from website copy.

Separate Phone/Zoom candidate is documented, not implemented: eight active events, method
selection before calendar, hidden optional universal phone on Phone-only plus native required
location number; visible required universal phone on Zoom-only. Hosted save/render and blank
validation probe must pass before rollout; preserve all existing fields/settings/workflows.
Omitted default fields are restored and bookingFields replaces the field array. Await product
direction, preserve T3, and never change meeting method by assumed cancel/rebook migration.

Manual operation checklist (not an executed-test record):

1. Use the original consultant's authenticated organizer account. Verify Paid status, original
   host, approved request timing and zero prior complimentary changes in the restricted operations
   ledger; guest self-service is disabled and provider does not count free changes.
2. Prepare a same-host target slot. Obtain approval for controlled test attendee/host notices
   before submitting a test change; do not use request-reschedule/cancel/rebook as a substitute.
3. After one authorized change, verify paid amount/charge retained, old slot release/new slot
   reservation, booking lineage, calendar/Zoom changes and exactly one change notice per recipient.
   Stop if payment, cancellation or refund is requested. No new payment/refund is authorized.
4. Record request/change timestamps, prior/new slot, original host, change-used and verification
   result only in restricted operations views. A second/late request follows approved policy;
   do not grant another free change automatically. No actual ledger entries are published here.

## Current saved test isolation — October 5, resumed

Production reminders 450309/450313 now select exactly five production events; hidden 7253414
was removed and future-event application stays off. Their 30-minute/$60 copy is unchanged.
Test reminders 473280/473288 are saved for 24h/1h, use explicit $0.50 technical-test copy and
native tokens, and were initially inactive. After specific Stacie scenario/recipient approval, both are now
**active only on hidden 7253414**; independent fresh-tab configuration QA passed. No mail
execution or delivery is claimed. Disable after the approved test; if checkout is declined,
disable without submitting a booking. SMS remains inactive.

Hidden 7253414 is temporarily Stacie-only for the first proposed Zoom test, with 30m/$0.50 USD,
Stripe ON_BOOKING and two-calendar-day refund settings rechecked. The user approved the specific Stacie test; checkout is handed to the user with phone/State
required and SMS unchecked. The user has now completed checkout as T3 below; no agent booking submission, payment or refund. Cal.com Support
ticket 215476247361743 was submitted after specific user approval; its later reply is recorded above.
The original hidden pool was Taj/James/Stacie; restore it after the controlled test sequence.
Production host assignments and existing bookings were not changed. Unsaved Phone call/
Organizer Address alternatives were rejected for incorrect meeting semantics and restored.
Cal.com UI version for this resumed configuration pass is 6.9.11-h.

## Current user-completed Stacie test — October 5

T3 is one Confirmed/Paid Stacie booking, 30m/$0.50 USD, October7 22:30–23:00 UTC
(October8 00:30 Amsterdam / October7 18:30 New York). Stripe shows one new Succeeded
intent, one charge event and one receipt-sent row; rendered receipt matches SOLAGREE/$0.50.
Cal Accepted history identifies Stripe/WEBHOOK. Generated Zoom URL is visible in admin and
canonical public confirmation; the initial redirect placeholder is superseded. Independent
provider QA PASS for this bounded scope. Independent public hidden/Stacie direct checks
exclude the booked slot and 15-minute post-buffer while adjacent slots remain, with viewer
overlay off during verification and restored. Later client attestation confirms T3 immediate emails
and calendar addition. Direct host-destination/event details, inbox content/count/header timestamps,
external busy conflicts, Zoom join, future reminder dispatch, refund/manual lifecycle and
production$60 paths remain open.

The final booking records SMS consentYes after user completion; all four SMS workflows are
OFF for hidden, independently checked. No SMS activation/delivery claimed. Test24h/1h
email workflows remain hidden-only for this test. Planned triggers October6 22:30 UTC and
October7 21:30 UTC are not observed delivery. After inspection disable templates/restore
host pool; cancellation may refund, so user financial cleanup remains required. PR #3 is
merged in develop989827a; no agent deploy/Done or new financial action.

## Isolated James free test — prepared, not submitted

Hidden event7352395 (`initial-consults/test-james-calendar-zoom-20261005`) is James-only, Zoom-only,
30 minutes, payment OFF, with technical $0/no-consultation copy. Independent fresh QA PASS for
saved assignment, rules, inherited guest/same-host restrictions and all eight workflows OFF;
original T3 and five-production reminder scopes/payment settings remain intact.

Prepared October6 14:30–15:00 UTC slot (16:30 Amsterdam /10:30 New York) shows Confirm, one
required empty phone, required State and unchecked optional SMS. Exact controlled attendee/James
recipients and confirmation/calendar-invitation scenario await user approval; user final Confirm
is proposed. No submission, calendar write, Zoom generation or sends occurred. This is a free
integration check, not paid $60/receipt acceptance. No cancellation notices/cleanup are authorized;
preserve T3 paid booking and future reminder bindings.

## Runtime event paths

The Nuxt runtime configuration uses paths relative to `https://solagree.cal.com`, never full URLs.

| Selection | Cal.com event ID | Event path | Host assignment |
| --- | ---: | --- | --- |
| First Available | `6658910` | `initial-consults/initial-consult` | Round robin: Taj, Stacie, James (Jessica paused September 17) |
| Taj Chiu | `6658975` | `initial-consults/initial-consult-taj` | Taj only |
| Stacie Sanders | `6658981` | `initial-consults/initial-consult-stacie` | Stacie only |
| Jessica Urash | `6659009` | `initial-consults/initial-consult-jessica` | Jessica only |
| James Traub | `6659015` | `initial-consults/initial-consult-james` | James only |

The matching environment variables are documented in `.env.example` and `README.md`.

## Verified Cal.com state

Verified through August 28, 2026:

- Organization: `SOLAGREE®`; team: `Initial Consults` (`388743`).
- All five events are enabled, 30 minutes, and priced at $60 USD with `Pay to book` on the public flow.
- Stripe account activation is complete: Stripe confirms that the SOLAGREE account can make live transactions. Live end-to-end payment acceptance is still required before production sign-off.
- Each event offers `Attendee phone number` and `Zoom` as the two public location choices.
- The approved shared Zoom account is installed in the Cal.com profiles for Taj, Stacie, Jessica, and James, and Zoom is the default conferencing app for each profile.
- The Zoom event location is stored as Cal.com's `Organizer's default app`; the public custom label is `Zoom`.
- No personal meeting types were changed through Cal.com's optional bulk-update step.
- Public First Available QA reached the attendee/payment form and displayed Phone, Zoom, 30 minutes, $60.00, and `Pay to book`. No booking or payment was submitted.

The scheduling rules configured for the five events are a 15-minute post-event buffer, no pre-event buffer, two-hour minimum notice, a rolling 14-day booking horizon, and no per-host daily cap. Host profile and default-schedule timezones are `America/Los_Angeles` for Taj and `America/New_York` for Stacie, Jessica, and James.

## Host identities

| Host | Solagree email | Timezone |
| --- | --- | --- |
| Taj Chiu | `taj.chiu@solagree.com` | `America/Los_Angeles` |
| Stacie Sanders | `stacie.sanders@solagree.com` | `America/New_York` |
| Jessica Urash | `jessica.urash@solagree.com` | `America/New_York` |
| James Traub | `james.traub@solagree.com` | `America/New_York` |

Stacie's previous `stacie.martin@solagree.com` identity is obsolete. Her Cal.com membership/profile and Google Calendar and Zoom connections must be verified against `stacie.sanders@solagree.com`.

## Approved booking form

The client confirmed the following requirements on August 28, 2026. Cal.com owns and renders these fields inside the embedded booking flow.

| Field | Requirement |
| --- | --- |
| Name | Required |
| Email | Required |
| How do you want to meet? | Required choice between Zoom and Phone Call |
| Phone | Required for every booking, including Zoom, so SMS reminders can be sent |
| State | Required |
| SMS opt-in | Present as an explicit, voluntary opt-in; do not preselect it or make consent a condition of booking |
| Notes | Present and optional |
| How did you hear about us? | Proposed optional attribution field; awaiting explicit client approval before configuration |

## Remaining acceptance work

Use the current matrix for per-criterion status and controlled test preparation. Prioritize:

1. Collect Phone exactly once while requiring it for Phone and Zoom. The public First Available
   form still duplicates `attendeePhoneNumber` and `optionField` for Phone on October 5; removing
   the universal field breaks Zoom requirements. The already failed Custom attendee location
   experiment is not a new hypothesis.
2. Recheck event rules, hours, timezones, destinations/conflict calendars and Zoom. Stacie's saved
   hours differ from the old Mon–Fri default; James's `Inner State` destination was explicitly
   retained by the owner. Preserve these mappings pending actual provider acceptance.
3. Use the October 5 bounded Stripe reconciliation before requesting more paid tests: three successful
   $0.50 payments, no duplicate successful charge in the visible dataset, one sent receipt each,
   one incomplete unpaid intent, earlier pre-T3 refund list empty and no T3 refund activity observed.
   T3 immediate emails/calendar addition are client-attested; finish direct content and historical
   delivery evidence/strict ID bridging if required; no historical payment authorizes another charge or refund.
4. Verify delivered email confirmation/receipt, 24h/1h reminders, Phone/Zoom instructions,
   cancellation and operator-managed reschedule, including slot release and payment retention.
5. Complete negative-payment, calendar conflict/concurrency, timezone/DST and policy-boundary
   acceptance. Code fixtures and prior config inspections do not satisfy these provider checks.

## Temporarily unpublishing consultants

The website setting `NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_UNPUBLISHED_CONSULTANTS` accepts comma-separated consultant ids: `taj`, `stacie`, `james`, `jessica`. It defaults to `jessica`. An explicitly empty value publishes everyone. Profiles and event paths are retained for restoration; unpublished event paths are not required. Invalid ids or unpublishing the entire team disable the booking UI.

Rebuild and deploy the static website after changing this setting. This is an environment setting, not a Portal admin draft control.

Website visibility does not change Cal.com assignment. Before completing a pause, separately exclude the consultant from the First Available round-robin event and disable their direct event's booking availability. Verify that an old direct URL cannot accept new bookings; hiding a Cal.com link alone may not prevent direct-link bookings. Preserve existing appointments and the member account. Restore Cal.com availability and host assignment before removing the id from the website setting and redeploying.

September 17: website code defaults Jessica to unpublished. HIR-609 was merged into develop and deployed to staging on September 17 under the user’s earlier authorization; production publication remains pending. Cal.com First Available now contains only Taj, Stacie, and James. Jessica’s direct event is Hidden and its booking window is restricted to September 16, 2026–September 16, 2026 (past), preventing new slots. To restore it, return Limits & buffers to 14 calendar days, retain the existing unchecked “Always 14 days available” setting unless separately approved, enable visibility, and re-add Jessica to First Available. Her previous two-hour notice and 15-minute post-event buffer are retained. The former sandbox-only prerequisite was superseded only for two individually approved $0.50 tests; it does not authorize additional charges. Cal.com Support subsequently confirmed no hosted native-payment sandbox. Client confirmation that the other three connected their calendars and Zoom is a readiness signal, not completed acceptance evidence.

## September 14, 2026 operational update

The observations below supersede the older August snapshot where stated. HIR-246, HIR-248,
HIR-249 and HIR-263 were resumed with user authorization; HIR-250 remains queued for integrated
acceptance. Provider configuration is not evidence of successful payment or delivered messages.

### Email reminders (HIR-249)

| Workflow | ID | Trigger | Scope |
| --- | --- | --- | --- |
| Initial Consult — 24-hour email reminder | `450309` | 24 hours before event | All five Initial Consult events |
| Initial Consult — 1-hour email reminder | `450313` | 1 hour before event | All five Initial Consult events |

Both workflows contain one attendee-email action, use sender name `Solagree`, and explicitly select
the five event types above; automatic application to future event types is off. Each message states
30 minutes and $60 USD, with Cal.com's native attendee, event date/end time, timezone, organizer,
location and meeting-URL variables. Cal.com reported `Workflow saved` for both. Delivery, timezone
rendering and Phone-versus-Zoom output still require controlled booking acceptance.

In the live SOLAGREE Stripe account, Customer emails had both `Successful payments` and `Refunds`
disabled. Both were enabled during HIR-249 configuration. These settings apply account-wide, use the
existing English language and support configuration, and do not constitute an actual receipt/refund
delivery test. Stripe notes that an API-provided `receipt_email` overrides the successful-payment
setting. No refund or payment was initiated by changing these settings.

First Available's standard attendee and host booking emails remain enabled; an extra confirmation
workflow was not added. Cancellation/reschedule links remained enabled at this September 14
checkpoint. Automatic refund policy was then `Never`; the September 29 update below supersedes
that setting. One-reschedule enforcement remains unverified.

### Prepared SMS reminders (HIR-249)

| Workflow ID | Trigger | Intended event group | Consent filter |
| --- | --- | --- | --- |
| `450318` | 24 hours before event | First Available, Taj, Jessica, James | `smsConsent` equals `Yes` |
| `450324` | 1 hour before event | First Available, Taj, Jessica, James | `smsConsent` equals `Yes` |
| `450327` | 24 hours before event | Stacie | `sms_opt_in` equals `Yes` |
| `450330` | 1 hour before event | Stacie | `sms_opt_in` equals `Yes` |

These workflows are prepared for separate consent-field groups. Each uses a filter before one native
attendee SMS action, Cal.com's Reminder template and default sender `Calcom`, without an email action.
Automatic application to future event types is off. Existing required system Phone fields and the
native `smsReminderNumber` field are visible, but actual recipient mapping/delivery is not accepted.

The team's Billing > Credits page reports current balance **0**. Event scopes were removed and independent QA confirmed all four display
`Not active on any booking link`; email workflows remain active on five links. Do not activate without
verifying sufficient provider credits/entitlement and applicable sender requirements; then reselect
only the matching event group above and test explicit, unchecked and declined consent. No credits
were purchased and no SMS was sent as a test. The two email workflows remain independent of SMS.
Independent QA verified the original group predicates before deactivation. With no active links, the
filter editor hides predicate fields, so Stacie's exact saved predicate is implementer-verified only;
recheck it independently after selecting the intended scope and before activation.

### September 29 refund and reschedule update (HIR-249)

The client accepted Cal.com's native `If cancelled 2 calendar days before` threshold in place of
an exact elapsed 48-hour rule. On September 29, the refund policy was changed from `Never` to
`If cancelled 2 calendar days before` on the five $60 production event types (`6658910`,
`6658975`, `6658981`, `6659009`, `6659015`) and the hidden $0.50 test event (`7253414`). Each
setting was reload-verified. The Stripe connection, amount, currency and `Collect payment on
booking` setting remained in place. Jessica's event remains paused. This confirms configuration
only: no cancellation under the new rule, automatic Stripe refund, boundary case, or delivered
refund email has yet been observed. Cal.com Support ticket `215476139006847` described the
calendar-day boundary ambiguously; do not promise an exact elapsed-hour cutoff or claim a
particular DST/equality behavior without a controlled provider test.

Cal.com Support confirmed that hosted Teams has no native one-reschedule counter or UID-chain
tracker, and no separately configurable 2-day reschedule notice while new-booking notice stays
at 2 hours. The manual operation policy, with later role enforcement recorded above, is:

1. Direct the client to request a reschedule from Solagree rather than using a self-service link.
2. An operator checks the original paid booking, appointment start, calendar-day policy window,
   and whether a complimentary reschedule was already used. Record the original and replacement
   booking UIDs and the one-reschedule decision in the restricted operations record, not in the
   public website repository.
3. For an eligible first request, the organizer changes the booking in Cal.com, confirms that
   payment remains attached and the old slot is released, and checks the new calendar and
   meeting-location details. Send the reschedule confirmation through Cal.com.
4. For a late or second request, do not promise a complimentary change; route it to Solagree's
   cancellation/no-show decision and, when applicable, a new paid booking.

The earlier blanket-switch proposal was withdrawn because the default Host and attendee scope
blocks both roles. Later October5 Support identified the hosted Attendee only selector; that
role/Always policy and Always same host are now saved on all five production events plus hidden,
independently QA verified. Guest confirmation hides Reschedule and own-host picker access passed;
actual paid-change retention, old-link rejection and delivery still need acceptance.
The one-reschedule limit remains an internal operational policy, not an enforced
booking rule. The site's customer-facing copy should request contact with
Solagree and state `2 calendar days` without an exact 48-hour promise.

Email delivery still needs inspection in a controlled attendee inbox and the host inboxes.
Stripe customer receipt/refund email switches and Cal.com email workflows are enabled, but their
saved state is not delivery evidence. SMS workflows remain inactive while the team credit balance
is zero; do not activate them or claim SMS delivery.

### Stacie's connections (HIR-246)

The administrator inspected Stacie's current profile and returned to the administrator account.
Google Calendar `stacie.sanders@solagree.com` is selected both as the destination calendar and for
conflict checks. Zoom Video is installed and marked default. Her default schedule `2340081`,
`Stacie's Hours`, is America/New_York: Monday–Thursday 18:30–21:00 and Saturday 12:00–14:00.
These replace the historical default-hours and email-identity assumptions for Stacie. Actual calendar
write/conflict behavior and generated Zoom URLs still require a controlled booking.

An independent administrator inspection also found Zoom installed/default for James, Jessica and
Taj. Their selected booking destinations are external Google calendars; Taj additionally has the
Solagree calendar enabled for conflicts. The intended destination mapping requires host confirmation;
an external domain alone does not establish an incorrect configuration. Confirm before changing it. External calendar addresses are intentionally not
recorded here. James's default schedule `2219808` is Monday–Friday 09:00–17:00 America/New_York;
Taj's `2219811` is Monday–Friday 09:00–17:00 America/Los_Angeles. Jessica's `2219809` is
America/New_York: Sunday 12:00–17:00, Monday 09:00–17:00, Tuesday 09:00–19:00,
Wednesday–Thursday 09:00–16:00 and Friday 10:00–14:00. The administrator session was restored after
inspection. These observations do not prove calendar conflict handling or approved host hours.

Independent read-only QA confirmed both saved email workflows' names, timings, five selected event
names, single email action, sender and native variables. The workflow selector does not expose numeric
event IDs, so that pass verified names/count rather than independently proving the ID mapping.

### Separate case-payment sandbox (HIR-263)

The portal's existing Stripe implementation is available at commit
`6297202bf43c8094aafc01a74680df5fd4e4b1aa`; see the portal repository's `docs/case-payments.md`.
A destination named `Solagree Portal staging — case payments` was created in the existing SOLAGREE
Stripe sandbox, with ID `we_1UFfZ2L3EvUvp66binpzyJ8i`, snapshot payloads, API version
`2026-06-24.dahlia`, and the nine events documented by the portal. Its URL is
`https://solagree-portal.qamachine.com/api/webhooks/stripe`.

At preflight, the deployed portal release was `20260828133653`, health returned 200, and this webhook
returned 404. The payment migration was not applied. The protected staging environment now contains
the staging success/cancel URLs and tolerance 300, but requires the sandbox API secret and endpoint
signing secret before the normal deployment gate can pass. No Stripe test events were sent. This
separate portal sandbox does not switch the live Cal.com payment connection to test mode.

Fresh portal code QA at the above commit passed lint, typecheck, build, 167 unit tests, 97 PostgreSQL
integration tests, 76 component tests, 15 real-server API tests and 18 email fixtures. The disposable
PostgreSQL container was removed afterward. Those tests make no real Stripe/email deliveries and do
not replace the external acceptance gate.
