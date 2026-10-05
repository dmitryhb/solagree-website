# Initial Consult acceptance preparation — October 5, 2026

Scope: HIR-246 → HIR-248 → HIR-249 → HIR-250; HIR-609 is the consultant-publication dependency.
This is a review/acceptance packet, **not a launch sign-off**. No merge, production deployment,
Done, new payment, refund or outbound test submission was performed in this pass.

## Recovery and source of truth

- `origin/develop` after fetch: `0864ab4`. HIR-609 `86b8bf3` is its ancestor. The working checkout
  had unrelated local/untracked files; these were preserved. Existing clean `hir-249` worktree
  was reused for PR [#1](https://github.com/dmitryhb/solagree-website/pull/1), base `develop`.
- HIR-246 branch `8d8524b` retains the September 15/29 configuration and duplicate-phone evidence.
  HIR-248 branch `d576811` retains the September 29 native payment ledger. PR #1 head at recovery
  was `846d9f9`, including the policy change, focused expectations and dated operational runbook.
- All five issue descriptions, relations and complete available comment lists were read. They
  belong to Hirebrains/HIR, project SOL — Solagree. HIR-246/248/249 are In Progress, HIR-250 was
  Todo and is now In Progress for acceptance preparation; HIR-609 remains In Review. HIR-247 is Done and is not reopened.
- User decisions on October 5 supersede stale four-active-host, exact-48h, sandbox-only and
  SMS-launch-blocker text: 30 minutes / $60 USD; active Taj, Stacie and James; Jessica paused;
  native two-calendar-day refunds; one manual complimentary reschedule; email sufficient.
- Memory preflight: agent-memory MCP unavailable; fallback bounded CLI search in
  `/Users/dmitry/work/dai/agent-knowledge` for repository `solagree-website`, domain
  `initial-consult`, limit 5 returned no entries. No lesson was assumed from that result.

## Evidence matrix

“Code” means repository behavior/fixtures. “Services” records the observation date and extent.
Historical configuration evidence is not current saved state, delivery, calendar or payment acceptance.

| Criterion | Verified by code | Confirmed in services | Required external action / acceptance |
| --- | --- | --- | --- |
| Active roster / pause | HIR-609 filters before event validation; Jessica profile retained; in develop | Oct 5 admin: Maximize availability; three medium-priority hosts, weights off; direct one-host assignments visible. Jessica Hidden, ended Sep 16 window; old direct URL blocked | Real booking host reconciliation; later approved release must retain Jessica pause |
| First Available / Direct Choice | Selector resolves four visible paths and mounts one selected embed | Oct 5 public event titles/price; prior Sep 28 staging iframe paths matched | Real RR union/routing and direct booking host reconciliation |
| Duration, price, payment mode | Site states 30 min / $60; provider owns checkout | Oct 5: all five $60 USD, Stripe Initial Consults, ON_BOOKING, Save disabled; hidden event $0.50; public duration 30m | Existing $0.50 dashboard reconciliation below; controlled $60/direct-routing acceptance remains |
| Rules / hours / timezones | Website delegates availability to Cal.com | Oct 5: five rules rechecked (Jessica has closed range); RR common/restriction schedule off; Taj Mon–Fri09–17 PT, James Mon–Fri09–17 ET, Stacie Mon–Thu18:30–21 and Sat12–14 ET | Confirm approved hours and intended Taj destination; actual notice/buffer/horizon boundaries, calendar conflicts, concurrency |
| Phone exactly once, required for both methods | Native provider fields are inside cross-origin embed | Oct 5 First Available/Taj/Stacie/James: Phone still renders required attendeePhoneNumber + optionField; First Available/Stacie Zoom remove location input. Hidden editor has no conditional/mapping controls | Supported conditional/mapping/location correction; recheck all five forms. Failed Custom attendee location experiment is not repeated |
| Required Name/Email/State, optional Notes/SMS | Website does not add a duplicate contact form | Sep 15 approved fields; Oct 5 public form recheck; SMS unchecked | Confirm provider validation, no attribution field, current forms and consent on all five |
| Calendar / Zoom | No website-side meeting generation | Oct 5 all three destination/conflict settings and Zoom default rechecked; Taj Sep 28 paid test generated actual Zoom URL | Actual writes/conflict exclusion for all active hosts; generated Zoom and cleanup for Stacie/James; Taj calendar and Zoom deletion |
| Existing two $0.50 tests | No fixture claims live-payment success | Oct 5 Stripe: two Succeeded $0.50 USD payments, one charge event and one sent receipt each; third intent Incomplete; current refund view empty | Inbox delivery, strict numeric-ID↔UID bridge if needed; no refund has been accepted; broad retry/concurrency/$60 acceptance remains |
| Decline / abandon / retry / duplicate protection | Website invokes native checkout, no custom payments | Sep 28 cancel checkout left Pending payment/Unconfirmed; redirect to admin's empty public profile; rejected in cleanup. Error collecting card is T1 rescheduled original, not independent decline evidence; Oct 5 Stripe abandoned intent Incomplete, no payment method/charge/receipt | Slot-hold expiry and retry/concurrency acceptance; no usable unpaid confirmation; no duplicate charge/booking |
| Confirmation / receipt / reminders | Site copy stays 30 min / $60 | Oct 5 450309/450313 active on six links with one attendee action, 24h/1h, event/date/end/timezone/organizer/LOCATION/MEETING_URL, hard-coded30m/$60. Oct 5 guest notifications enabled, including confirmation/cancel/change/payment pending; Stripe shows one sent receipt per historical paid test, each rendered at $0.50 | Actual inbox delivery and one message each, matching host/timezone/Phone or Zoom; no broken Zoom links in Phone mail |
| Hidden test reminder accuracy | Not website controlled | Oct 5 active templates still hard-code $60 but hidden event is $0.50 | Before any new timed test: exclude hidden event from production templates and prepare isolated $0.50-specific reminder templates; do not send misleading $60 reminders |
| Refund | Site copy now says 2 calendar days | Oct 5 all five + hidden event rechecked as If cancelled 2 calendar days before; Stripe paid tests remain Succeeded, full/pending/partial refund list empty | Hosted threshold before/equal/after, DST; user performs actual refund; confirm Stripe refund object/status and email. Cal “refund on the way” text is insufficient |
| One manual reschedule | Site directs request to Solagree | Oct 5: guest cancellation and rescheduling enabled on all five; native preview shows Reschedule/Cancel; hidden event same. Past/cancelled rebooking off; RR same-host switch off | Hidden check: guest reschedule blocked while organizer change works, original/replacement UID ledger, payment retained, old slot released; then production configuration and second/late-request handling |
| SMS | No requirement to enable SMS for email launch | Oct 5 all four SMS workflows show No active links; First Available switches off; prior zero credits not revalidated | Keep inactive; optional future sender/credits/predicate/mapping/consent acceptance. Not a blocker for email acceptance |
| Desktop/mobile, keyboard, fallback/privacy | Existing selector, focus, embed retry/fallback and tracking tests; independent result below | Sep 28 staging smoke at 390/768/1440; no overflow, selection worked; legacy production form was still served | Actual current build iframe desktop/mobile/keyboard/screen-reader verification; provider empty/error behavior; authorized production release later |

## Public read-only recheck — October 5

Chrome jill initially had no authenticated Cal.com or Stripe session. The user restored Cal.com
admin access; hosted version is `6.9.10-hotfix2-h`. No credentials were extracted and no new
OAuth/calendar permission was granted. Later on October 5 the user restored Stripe SOLAGREE access;
the bounded historical-payment reconciliation below replaces the initial login blocker.

Authenticated read-only checks confirmed five $60 USD ON_BOOKING settings with two-calendar-day
refunds; hidden 7253414 is $0.50 with the same refund setting. All five keep two-hour new-booking
notice, no pre-buffer and 15-minute post-buffer, no frequency/duration caps. Four active paths use
14 calendar days; Jessica uses the closed September16 range. First Available has Maximize
availability, only Taj/James/Stacie at medium priority, weights off, each default host schedule,
no common/restriction schedule. Taj and James retain Mon–Fri09–17 PT/ET; Stacie retains
Mon–Thu18:30–21 and Sat12–14 ET. Guest cancel/reschedule links are enabled on every event.
The hidden phone editor exposes label/placeholder/required/disable-if-prefilled only; no conditional
visibility or location mapping. No saved event settings were changed by these inspections.

First Available exposes 30 minutes / $60 and dates through October 19 in Europe/Amsterdam. Selected
a slot without entering attendee data or pressing Pay to book. Phone showed two required tel inputs
(`attendeePhoneNumber`, `optionField`); Zoom removed only the location input. Name/email were required,
Notes optional, State present, SMS unchecked. Taj, Stacie and James direct events independently showed the same Phone duplication and
30 minutes / $60. Stacie's consent identifier is sms_opt_in; the others inspected use smsConsent.
Jessica's old direct URL says it stopped taking bookings on September16. This verifies rendering,
not paid host assignment or validation.

## Host integrations and notification configuration — October 5

All three host profiles were inspected through administrator impersonation and returned to Jill
before continuing. Stacie's destination is the Solagree Google calendar, also selected for conflicts.
James retains the owner-confirmed Inner State destination and three selected conflict calendars.
Taj retains the existing external Google destination and several selected conflict calendars,
including Solagree. Its intended destination still needs owner confirmation; do not infer a wrong
mapping from a calendar's domain or change it without that confirmation. Private account addresses and unapproved calendar
names are omitted. Every profile shows Zoom as its default conferencing app, with no visible
connection error. This proves configuration, not a new calendar write, busy-time exclusion or
meeting creation. Stacie/James still need actual Zoom acceptance; Taj's historical Zoom success
must not be extrapolated to them.

Organization guest notifications are enabled (Disable all booking emails off). Confirmation,
cancellation, rescheduled, booking request, host reassignment, awaiting payment, reschedule
request, location change and guest-added notices are checked. Both attendee email workflows
450309/450313 list all five production events plus hidden 7253414, with one attendee action each.
All four SMS workflows (450318/450324/450327/450330) currently show No active links. No notification
setting or workflow was saved, and no test message was sent.

## Existing Cal.com booking reconciliation — October 5

The administrator booking views expose two canceled paid $0.50 Taj test records, one rejected
unpaid checkout record and the first test's rescheduled original. The first test has an explicit
original→replacement UID link and a Rescheduled history entry; its replacement retains Paid/$0.50
and the historical Daily fallback location. The second test retains Paid/$0.50, the real Zoom URL
and an Accepted history entry attributed to Stripe (source WEBHOOK), followed by cancellation.
Both paid records show the “refund on the way” banner. Neither inspected history has a refund
entry. Do not use these views as proof of a Stripe refund or receipt delivery.

**Negative-payment evidence correction:** the original record labeled “Error collecting card”
is the rescheduled original of the first paid test, with a prior Accepted-by-Stripe history entry.
It is not an independent failed/declined card attempt and must not count as decline acceptance or
a third charge. The subsequent Stripe audit confirms two succeeded payment objects and one incomplete intent;
strict numeric Cal.com ID-to-UID verification is bounded as documented below. The rejected checkout remains Pending payment in Cal.com, not Paid; its
explicit rejection does not prove natural hold expiry or safe retry. No booking was changed.

No upcoming booking is shown in the current administrator booking view. This is the visible
view's result, not proof that every calendar or organization scope is empty. Recipient details,
phone numbers, booking UIDs and conferencing secrets were read only inside provider views and
are deliberately absent from this document.

## Authenticated Stripe reconciliation — October 5, resumed

The user restored the live SOLAGREE dashboard. The unfiltered All payment view has exactly three
results (no further page): T1, T2 and abandoned A1. This resolves the access blocker. No payment,
refund, receipt resend, note, metadata or settings mutation was performed.

| Label | Current Stripe state | Cal.com correlation | Receipt / refund evidence |
| --- | --- | --- | --- |
| T1, first historical paid test | Succeeded, $0.50 USD; one latest charge and one charge-success event; cal.com identifier, test event and Taj username metadata | Metadata contains the original numeric booking ID; title still says “between Nameless”, matching the Cal.com rescheduled original. Host metadata is Taj. Cal.com replacement remains Canceled/Paid and links to that original | One Payment receipt marked sent to the controlled test inbox; rendered receipt is SOLAGREE / $0.50. Current status remains Succeeded, no refund activity shown |
| T2, second historical paid test | Succeeded, $0.50 USD; one latest charge and one charge-success event; numeric booking ID present in metadata, with Taj title/username, test event and controlled attendee metadata | Cal.com record remains Canceled/Paid with the actual Zoom location and Stripe Accepted WEBHOOK history | One Payment receipt marked sent to the same controlled inbox; rendered receipt is SOLAGREE / $0.50. Current status remains Succeeded, no refund activity shown |
| A1, abandoned checkout | Incomplete, $0.50 USD; payment method Missing/None; only intent-created activity/log; no latest charge or receipt section | Matching test-event/Taj/controlled-attendee metadata with its own numeric booking ID; Cal.com rejected record remains Pending payment, not Paid | No charge or receipt observed; not a declined-card test and not proof of natural slot-hold expiry |

The current Refunded view explicitly covers `refunded`, `refund_pending` and `partially_refunded`
and shows No results. Both paid details show success/start activity only, last updated September28.
There is no current refund evidenced in this account for either test. This contradicts treating
Cal.com's “refund on the way” banner as completed or pending Stripe-refund proof. The historical
charge.succeeded event for T2 also contains captured/paid true, live mode true, amount50 USD cents,
amount_refunded0 and refunded false, but that is an event snapshot at charge time, **not a current
refund object**. Current dashboard views, not that snapshot, establish the current status above.

Each paid record has one receipt send-history entry, with the same recipient as booking metadata.
Rendered receipts match merchant/amount. Stripe marks T1 sent September28 09:52 and T2 11:10 in
its displayed timezone; that display timezone was not independently verified and is not asserted
as Amsterdam time. A Sent entry proves recorded sending, not mailbox delivery or duplicate-free
inbox receipt. No Send receipt action was used.

The two distinct successful intents and two charge events support no duplicate successful charge
in the visible account dataset for these historical tests. T1's original and replacement are a
booking lineage, not a third payment. This does not accept future double-click/retry/concurrency,
all direct $60 event paths, decline handling or slot-release behavior. Numeric booking IDs are
visible in Stripe metadata; Cal.com's drawer exposes UIDs, host/event/attendee/amount and history.
The audit correlates those visible attributes and T1 lineage, but does not independently expose a
strict numeric-ID↔UID bridge in Cal.com's UI. That limitation remains explicit; identifiers and
receipt permalink tokens are retained only in provider views, not in this shareable packet.

Independent provider QA (GPT-6.1-Sol, medium) repeated the Stripe inspection in its own browser
session and confirmed All1–3of3, two Succeeded $0.50 USD, A1 Incomplete without payment method,
one charge event and one sent receipt row per paid record, metadata references, and no results in
the current full/pending/partial refund view. Its initial attempt could not claim the parent-owned
tab, so that attempt supplied no verdict; the subsequent independent-tab check succeeded and
its temporary tab was closed. No sends, financial actions, settings or Workbench commands were
performed. Verdict: bounded historical dashboard reconciliation PASS; overall external acceptance
remains NOT ACCEPTED. Strict numeric-ID↔UID and inbox-delivery limits remain unchanged.

A bounded independent review of this financial documentation passed after two corrections:
IDs are described as present in Stripe metadata rather than proven matching UIDs, and independent
QA was explicitly pending until the separate-tab result arrived. Reusable memory: none.
The available mail connector profile differs from the controlled test recipient; its mailbox was
not searched as a substitute for that recipient's inbox. Actual receipt delivery remains external.

## Phone correction investigation — HIR-246

Fresh independent investigation checked [official prefill documentation](https://cal.com/help/bookings/prefill-fields),
[hosted event-type contract](https://cal.com/docs/api-reference/v2/event-types/update-an-event-type)
and [hosted OpenAPI](https://cal.com/docs/api-reference/v2/openapi.json). Location phone
`optionValue` and `attendeePhoneNumber` remain distinct. No documented conditional visibility,
canonical phone reuse or location-input suppression was found. The actual hidden-event editor
also lacks these controls. Cal.diy source explains the two fields but is a separate public fork,
not proof of hosted implementation. The failed Custom attendee location experiment was not repeated.

The current hosted picker has attendee/organizer address, Custom attendee location, Link meeting,
Attendee phone number and organizer Phone call, plus conferencing. It has no static custom
organizer-text location. Repurposing organizer address for “we call you” could avoid the extra
field but would classify a phone meeting as an address/in-person event and risks incorrect mail,
calendar or map presentation. No address-as-phone change was saved or rolled out.

Minimal scope-preserving next action is a provider correction/reuse mapping; the unresolved
question should include the failed Custom attendee location evidence. An alternative is separate
native Phone and Zoom events/routing: Phone collects its location phone once, Zoom requires the
universal phone. This changes event inventory/selection, requires SMS mapping and all native
payment/lifecycle acceptance again, and remains a proposed scope decision rather than an implemented fix.

## Controlled test plan — prepared, not submitted

The existing tests now have the bounded dashboard reconciliation above. Before any new test,
finish any required strict ID bridge and receipt inbox verification in Stripe/Cal.com. Label them T1/T2 in shareable
evidence; retain booking/payment IDs and recipient details only in restricted provider/operations views.
For each record compare date/time, host, event, amount $0.50 USD, successful PaymentIntent/charge,
booking confirmation, receipt recipient/status, duplicate objects and refund timeline. Record whether
both charges remain paid, have refunds, or failed; never infer refund from Cal.com's banner.

Before a new submission, approve **the specific attendee and host recipients plus scenario**, and
verify the hidden event's host/location, amount, refund settings and notification scope. Production
$60 event types remain unchanged. No invalid Stripe test-card numbers are used in the live tenant.

| Proposed scenario | Environment / amount / payee | Proposed recipients and user handoff | Evidence and cleanup |
| --- | --- | --- | --- |
| Guest-link vs organizer reschedule | Hidden 7253414; $0.50 USD to SOLAGREE Stripe only if a new paid booking is needed | Attendee: Jill's controlled inbox, exact address to be confirmed; host: explicitly selected Taj/Stacie/James. Approval required before submit; user pays | Disable guest rescheduling on hidden event; inspect confirmation/email links and old URL; organizer must retain change action. One change, payment retention, slot release, UID lineage; second request refused manually. Restore test config afterward |
| Stacie calendar/conflict/Zoom | Hidden one-host scope matching Stacie settings; $0.50 USD to SOLAGREE | Exact controlled attendee inbox + Stacie host inbox approved before submit; user pays | Single booking/payment, Solagree destination entry, busy-time exclusion, valid Zoom meeting, confirmation/receipt; user handles financial cleanup |
| James calendar/conflict/Zoom | Hidden one-host scope matching James settings; $0.50 USD to SOLAGREE | Exact controlled attendee inbox + James host inbox approved before submit; user pays | Same checks, owner-approved Inner State destination, selected conflict calendars; Zoom cleanup |
| Email 24h and 1h, Phone/Zoom | Hidden event with price-correct isolated workflow templates; $0.50 USD to SOLAGREE if new booking required | Approved attendee + explicit host; no SMS; user pays | Scheduled event >24h ahead, receive both reminders at correct times/timezone; inspect Phone instructions vs Zoom URL, actual confirmation/receipt/cancel/change emails; requires timed follow-up separately requested by user |
| Abandon / failed / retry / concurrency | Hidden event; no charge for abandoned checkout; any successful retry $0.50 USD to SOLAGREE | Approve recipient/host side effects before booking form submission; final successful payment by user | Record hold start/expiry, no usable unpaid booking, safe return/retry, exactly one successful charge/booking. A deliberate live decline needs a provider-approved scenario first |
| Refund boundaries | Hidden event; each proposed new booking $0.50 USD to SOLAGREE | Approve each scenario/recipient separately; user pays and performs any real refund | Before/equal/after native threshold and DST; hosted version/timezone and exact decision, Stripe refund object/status, mailbox evidence. Clarify if Cal cancellation itself auto-refunds before acting |

A $0.50 hidden test proves integration behavior only; it does not prove a $60 charge or every direct
production event. Public $60 settings plus hidden results must be explicitly accepted as sufficient,
or a separately approved $60 scenario remains. No request to perform a new payment has been issued yet:
temporary reschedule/reminder isolation and recipient prerequisites have not been accepted.

## Prepared configuration changes and unsent provider question

These are reviewable changes to perform before approved test submissions; they have not been
saved because their lifecycle and send behavior need controlled acceptance.

- Hidden reschedule test: set `Disable rescheduling = true` only on 7253414. Retain cancellation,
  required host reason, existing price/refund settings and no past/cancelled-link rebooking. Check
  an existing valid customer link, confirmation email link and organizer action; accept only if
  the guest cannot initiate a change and the organizer can make the single approved change.
  Restore the hidden switch after the test, recording before/after. Then apply the accepted guest
  restriction to all five production events. Hiding reschedule in website copy alone is insufficient.
- Reminder isolation: remove only hidden 7253414 from production workflows 450309 and 450313;
  preserve all five production bindings and current booked-customer behavior. Prepare two
  separate hidden-only attendee workflows at 24h/1h using the same variables and `$0.50 USD`.
  Keep them inactive until recipient/scenario approval. Reconfirm the hidden price and absence
  of unrelated future bookings before activating; record scope and restore/disable afterward.
- Organizer Phone instruction must state that the consultant calls the supplied number; Zoom
  instruction must expose the actual meeting URL. Inspect rendered confirmation/ICS/reminder
  content rather than accepting variable names as proof. Keep current approved recipient scope.

Unsent Cal.com support question:

> On hosted 6.9.10-hotfix2-h, our paid 30-minute event offers Attendee phone number and Zoom.
> We require one phone number for both choices. With the required attendeePhoneNumber field,
> Phone also requires a separate location optionField, so attendees enter the same number twice.
> Custom attendee location was already tested on a hidden event and did not resolve this.
> Is there a supported canonical reuse/mapping or conditional input setting that collects the
> number once and preserves the native phone location, Zoom creation and native Stripe payment?
> Please also confirm whether disabling guest rescheduling leaves the organizer able to change
> a paid booking, and the precise two-calendar-day refund cutoff, including timezone, equality
> and DST. We have no hosted payment sandbox; we will not use live test-card numbers.

Sending this question to support needs a separate user instruction. No support message was sent.

## Launch gates and rollback

1. Resolve phone-once defect, current provider configuration and guest/organizer reschedule behavior.
2. Historical T1/T2 dashboard reconciliation is complete within the stated bounds; finish receipt
   inbox/strict ID bridge and active-host calendar/Zoom, payment failures/retry/slot release and email delivery.
3. Obtain the provider-boundary decision and prove Stripe refund handling, not just Cal copy.
4. Source review/code QA passed as documented below; finish current integrated browser acceptance and maintain explicit gaps.
5. User separately authorizes merge, production deployment and Done. HIR-609 is already in develop,
   while PR #1 policy copy still needs merge/release. Verify generated output has exactly
   First Available/Taj/Stacie/James and no legacy primary request form at the booking route.
6. Record approved production artifact and known-good rollback artifact. To disable paid booking,
   remove public CTA exposure/use the website unavailable state **and** pause Cal.com booking windows
   for active direct/RR links; hiding alone does not stop old direct links. Preserve all existing
   appointments and accounts. Disable future email workflow scope only after considering scheduled
   appointments; never cancel bookings, remove Stripe, refund, or revoke host integrations as rollback.

## Client draft — not sent

> Initial Consults are 30 minutes and cost $60 USD, with Phone or Zoom and Taj, Stacie or James.
> We have aligned the cancellation wording with Cal.com's native “2 calendar days before” refund
> setting. This replaces the previous promise of exactly 48 elapsed hours. We are validating the
> provider's precise cutoff, including timezone and daylight-saving edge cases, before launch.
> One complimentary reschedule is requested through Solagree and handled manually. Email
> confirmations and reminders are the launch channel; SMS remains optional and requires separate
> consent. We will confirm launch readiness after the remaining payment, calendar and email checks.

## Independent verification

Fresh independent review (GPT-6.1-Sol, high) found no blocking source finding in the actual PR #1
policy-copy diff and operational documentation. Component suite: 8 passed; diff whitespace check
passed; HIR-609 ancestry verified. Reusable memory: none. Final documentation reconciliation also passed a bounded independent review with no blocking
findings; its two precision suggestions were incorporated.

Independent QA (GPT-6.1-Sol, medium) reports **source PASS, external NOT ACCEPTED**:

- `npm run lint` and `npm run typecheck`: exit 0.
- `npm run test:initial-consult-booking`: 5 passed.
- `npm run test:initial-consult-booking-lifecycle`: 1 passed.
- Isolated Playwright: final 8 passed, including 3 existing checks and 5 supplemental checks;
  keyboard focus, four active choices, Jessica absent, no overflow at 390/768/1440, policy copy,
  loading/timeout/retry and privacy allowlist behavior.

The stock Vite fixture leaves Nuxt `import.meta.client` undefined. Its existing 3 tests passed,
but they assert the mount DIV, not a real Cal.com iframe. The first supplemental run failed its
error/retry check (7/8) because the client mount branch never ran. A temporary, untracked Vite
post-transform for CalComBookingEmbed enabled that branch; final run passed 8/8. All provider
traffic was aborted. The standalone lifecycle unit does not mount the Vue component. Thus these
results prove source/fixture behavior and do not prove hosted native availability. Durable tracked
coverage of this client gate/failure/retry is a follow-up, not a provider-acceptance substitute.
The optional QA memory suggestion was not promoted: no reviewer-backed durable memory candidate
was supplied; the actual coverage limitation is recorded here.

No full build was run for the narrow policy-copy/documentation revision; SSR/generated artifact
acceptance is not claimed. QA did not alter tracked source, create bookings, send messages or
perform financial actions. The orchestrator owns all Linear state and merge decisions. Source
PASS cannot close any external row above.
