# Initial Consult acceptance preparation — October 5, 2026

Latest controlled result: [early Stacie cancellation and full refund](initial-consult-cancellation-refund-2026-10-06.md).
The separately approved user final Cancel event canceled R1-R. Independent Stripe review verifies
one original-payment refund: $0.50 USD, status succeeded, exact original charge/intent association,
no additional payment/duplicate refund visible. Ledger now five records: three Succeeded,
one Refunded, one Incomplete. One Payment and one Refund receipt-send row are recorded; inbox
delivery and bank/card credit remain unconfirmed. Canceled slot restored; current logged-in guest
body canceled/no Zoom/active controls, but browser title still wrongly says confirmed. This early
Jill-admin case does not establish guest cutoff/equality/DST, Zoom deletion or calendar removal.

Earlier controlled change — before cancellation: [Stacie manual reschedule result](initial-consult-manual-reschedule-2026-10-06.md).
User-approved Jill-admin change was submitted by the user: October 9 00:30–01:00 → 02:00–02:30
Amsterdam. Same Stacie replacement record Confirmed/Paid; original Rescheduled with linked lineage.
Independent Stripe check retains original $0.50 intent/charge, five records unchanged, no new
charge/refund activity. Old slot reopened, new excluded; full Zoom reference retained against
pre-change evidence. Actual change email/calendar delivery, Zoom meeting-time update and own-Stacie
workflow remain open; one complimentary change is recorded in the controlled-test ledger.

Earlier controlled lifecycle result — before cancellation: [isolated Stacie abandon and same-record recovery](initial-consult-payment-lifecycle-preparation-2026-10-06.md).
After the approved no-card abandonment, user-approved recovery was completed by user final Pay.
The original intent succeeded for $0.50 USD to SOLAGREE with unchanged booking metadata and one
charge; at the October 6 post-recovery check, Stripe had five records: four Succeeded/one old
Incomplete. At that check the same Cal UID was Confirmed/Paid, actual Zoom link present, Accepted by Stripe / Source WEBHOOK. Rendered receipt
PASS; the initial **No receipts sent** view was superseded after root's fresh reload around
06:49 UTC by one Payment receipt sent-history row to the approved attendee. Inbox delivery
remains unverified. Confirmation and native calendar delivery for this recovery are not covered
by earlier T3 attestations. No manual send/resend was used.

Independent public QA found the slot/buffer absent at 06:20:58 UTC, enabled at 06:41:12 before
Pay while the record remained Pending, then excluded again at 06:45:02 after Pay. Exact release
TTL/cause remain unknown; reopening the original payment page may have contributed. The user
reports no link in the received native payment email; root recovered the actual earlier checkout
URL from Chrome history. This does not accept email-link recovery or expired-link invalidation.
Historical unpaid guest body awaited payment/no Zoom, but document title incorrectly said confirmed;
anonymous/server gating, deliberate decline and concurrency remain open. The approved support
question was sent to existing ticket 215476247361743; no answer is included here. Original Stacie
test reminders and records are preserved; no additional charge is authorized.

Latest actual test: [James Phone booking result](initial-consult-phone-booking-2026-10-05.md).
User Confirm completed. Independent actual host/time/confirmed record/phone in booking PASS;
manual Google/Office/ICS exports omit the phone location. On October 6 the user confirms the
number in the received invitation/calendar record; this is client-attested, with direct attachment,
exact host destination and native write pipeline still uninspected. Fresh James Zoom check still
shows Default with expired/revoked permissions. The user merged PR #10 into develop
`0e4051566a24814df1ad0f5c69d6ab81fe18d185`. The earlier
[approved Phone preparation](initial-consult-phone-preparation-2026-10-05.md) is historical.

Latest native test: [James free booking result and Zoom blocker](initial-consult-james-booking-2026-10-05.md).
User Confirm completed; host/time PASS, intended Zoom FAIL with invalid authorization. This
supersedes pending-Confirm snapshots; actual inbox/calendar delivery remains unconfirmed.

Latest update: [approved full staging refresh](initial-consult-staging-refresh-2026-10-05.md)
records the restored access, current build and deployment verification. Production and remaining
native lifecycle acceptance stay open; earlier staging observations below are historical.

Scope: HIR-246 → HIR-248 → HIR-249 → HIR-250; HIR-609 is the consultant-publication dependency.
This is a review/acceptance packet, **not a launch sign-off**. The user's later **мержи сам**
authorizes reviewed task PR merges; root merged PR #12 and #13 after independent checks.
Production deployment and Done remain unauthorized. Financial actions were completed by the user,
including the separately approved fourth $0.50 successful payment through same-record recovery.
No further charge, refund or cancellation is authorized. Outbound test/support actions are limited
to their specifically approved scenarios and recipients.
Saved non-financial workflow isolation and hidden-event assignment changes are recorded below.

## Recovery and source of truth

- `origin/develop` after fetch: `0864ab4`. HIR-609 `86b8bf3` is its ancestor. The working checkout
  had unrelated local/untracked files; these were preserved. Existing clean `hir-249` worktree
  was reused for PR [#1](https://github.com/dmitryhb/solagree-website/pull/1), base `develop`.
- HIR-246 branch `8d8524b` retains the September 15/29 configuration and duplicate-phone evidence.
  HIR-248 branch `d576811` retains the September 29 native payment ledger. PR #1 head at recovery
  was `846d9f9`, including the policy change, focused expectations and dated operational runbook.
- During the later Stripe resumption, PR #1 was found already merged outside this agent run,
  with merge commit `9951295` in fetched `origin/develop`. The Stripe evidence supplement is
  prepared separately on the reused `hir-249` branch rebased onto that current develop. No
  merge or production deployment was performed by this agent.
- All five issue descriptions, relations and complete available comment lists were read. They
  belong to Hirebrains/HIR, project SOL — Solagree. HIR-246/248/249 are In Progress, HIR-250 was
  Todo and is now In Progress for acceptance preparation; HIR-609 remains In Review. HIR-247 is Done and is not reopened.
- User decisions on October 5 supersede stale four-active-host, exact-48h, sandbox-only and
  SMS-launch-blocker text: 30 minutes / $60 USD; active Taj, Stacie and James; Jessica paused;
  native two-calendar-day refunds; one manual complimentary reschedule; email sufficient.
- Memory preflight: agent-memory MCP unavailable; fallback bounded CLI search in
  `/Users/dmitry/work/dai/agent-knowledge` for repository `solagree-website`, domain
  `initial-consult`, limit 5 returned no entries. No lesson was assumed from that result.

## Approved separate-method preparation — later October 5

PR #5 was merged by the user into develop d994f69. The user now approved site Phone/Zoom choice,
existing links retained for Zoom, and four new Phone counterparts (eight active method routes).
The new events are Hidden/closed September16; old mixed public links and deployed runtime remain
unchanged. Independent isolated Phone/Zoom field QA confirms saved exactly-one visible required
phone and blank browser constraints; actual submission/number propagation remains unproved.
Code and configuration preparation in hir-246 passed independent review/full source QA and
fresh saved-setting provider QA; [dedicated packet and matrix](initial-consult-method-routing-2026-10-05.md)
records paths, checks and coordinated release/rollback. Current production reminders intentionally
expand to nine links (old five + four closed Phone); earlier five-link snapshots remain dated evidence.
No new payment, booking, sends, public method conversion, deployment or Done occurred.

## Later October 5 support and policy implementation

The user merged PR #4 into develop (`36ed4ed`) at October5 15:09:52 UTC. The existing
hir-249 worktree was synchronized; unrelated local changes and untracked evidence remain preserved.

The user subsequently reports that the client confirmed all immediate emails received and the
calendar entry added for the current Stacie test. Record confirmation/receipt delivery and calendar
addition as **client-confirmed**, separately from independent direct inbox/calendar inspection.
Message content/count/header timestamps and exact host-calendar destination/event details were
not supplied or inspected; arbitrary busy conflicts are not proved by an added entry. This does
not cover other hosts, historical tests or future24h/1h reminders. Target mailbox/calendar access
is no longer a blocker to this client-attested result, while detailed rendering evidence remains open.

Support ticket215476247361743 now has a reply from Milos. The following distinguishes
the reply's assertions from observed hosted behavior:

- Phone: Support confirms no editor mapping or conditional field visibility for the two phone
  inputs. Making the universal question optional would remove the Zoom requirement and is not
  an accepted solution. Separate Phone/Zoom routing is being scoped; no alternate events or
  source routing have been implemented in this pass.
- Reschedule: Support identifies a role selector under Disable rescheduling. Actual hosted
  6.9.11-h UI confirms Host and attendee / Attendee only, revealed when that switch is on.
  Saved/reloaded hidden7253414 as ON / Attendee only / Always, then saved the same role policy
  on all five production events. Cancellation remains enabled and past/cancelled rebooking
  remain off. All six now preserve the original RR host: ON / Always reschedule with the same
  host. The T3 canonical
  public confirmation now shows Cancel only, with paid status and Zoom intact. This is a saved
  guest-restriction setting, not actual organizer reschedule/payment-retention acceptance.
  The earlier blanket interpretation of the Help article is superseded by this role-specific UI.
- Support says payment is retained without cancellation/refund/recharge when the booking's
  own organizer reschedules; one free change is an internal manual rule, not a provider count
  limit. A pre-submit picker alone does not prove this lifecycle. No actual change or notices
  were sent, and no financial cleanup was performed.
- Refund: Support asserts UTC start minus two days, an inclusive equality boundary and no DST
  shift (therefore 48 elapsed hours). These are **support assertions**, not live threshold/refund
  acceptance. Preserve the approved two-calendar-day setting/copy until deployed behavior is
  independently reconciled; do not silently reinstate the earlier exact-48-hour promise.

T3 and its hidden-only reminder bindings remain intact for scheduled email inspection. No
appointments were rescheduled; event price/refund/hours/host assignments were not changed.
The client-attested delivery/calendar result above supersedes the earlier waiting-for-access status;
direct evidence of message rendering/host destination and future reminders remains open.

Independent hidden-policy verification PASS: own fresh saved-setting check, guest Cancel-only
confirmation and pre-submit picker access in both Jill admin and Stacie own-host views. No new
date/slot selected or lifecycle form submitted; Jill restored after inspection. This proves access,
not payment retention, old-slot release, notices or rejection of old guest email links.

All-six saved rollout independent QA (GPT-6.1-Sol, medium): PASS from fresh views, with
Save disabled and the role/same-host values above. Payments still $60 USD for all five production
events and $0.50 hidden, Stripe / collect on booking / refund2 calendar days. Jessica remains
Hidden with September16-only window and no available preview dates. Hidden test24h/1h ON,
production24h/1h OFF for hidden, all four SMS OFF. Early hydration showed temporary incomplete
payment controls; fully loaded views confirmed saved values, not a persisted failure. Own tab
closed, no saves, transactions or booking changes. Actual paid lifecycle remains untested.

### Native production description copy

The five production descriptions were empty in the loaded editor. Saved the approved website
terms and common Phone/Zoom instructions into each; hidden T3 description was not touched.
Independent copy review (GPT-6.1-Sol, high) PASS: no new cutoff/lifecycle interpretation.
Independent fresh saved-description/public-render QA PASS: all five descriptions persisted exactly
with Save disabled; First Available and Stacie public views display the approved copy. Cal.com
uses a 180px internally scrollable description panel (about 420px of text), without a Read more button.

> 30-minute Initial Consult — $60 USD. Choose Phone or Zoom.
>
> Phone: your consultant calls the number you provide. Zoom: use the meeting link in your confirmation.
>
> Request one complimentary reschedule from Solagree up to 2 calendar days before your appointment.
>
> Cancel 2 calendar days before your appointment for a full refund. Less than 2 calendar days: non-refundable.
>
> Missed appointments are non-refundable and must be rebooked.

This is customer-facing copy/configuration, not proof of actual automatic refunds or successful
paid reschedule. Public rendering was checked separately from website copy; users must scroll
the native description panel to reach the later policy paragraphs.

### Current hosted desktop/mobile/timezone pre-submit QA — before description copy

Independent live provider QA (GPT-6.1-Sol, medium): all four active public paths render 30m/$60,
Phone and Zoom. Every desktop Phone form has required attendeePhoneNumber plus required
location optionField: **FAIL exactly once**. Zoom has one required phone input. Name/Email/Phone/
State are marked required; Notes/SMS optional, SMS unchecked, no attribution field. Actual
blank-field rejection was not established by labels alone.

No horizontal overflow on all four Phone forms at1440 or Zoom forms at390; supplemental James
Phone/calendar390 also passed. Same First Available October7 17:00 UTC slot renders19:00
Amsterdam /13:00 New York /10:00 Los Angeles. Zoom→Tab reached Notes and Back returned to
calendar; this is not full accessibility acceptance. Native form shows provider terms/privacy,
not Solagree's refund/manual-reschedule copy; website policy is a separate source surface.
Viewer Amsterdam/overlayON restored, viewport reset and own tab closed. No contacts entered,
submissions, charges, sends or calendar writes. Overall external acceptance remains NOT ACCEPTED.

### Earlier isolated free James preparation — superseded by completed booking

This is the earlier pre-approval snapshot. The user later approved and pressed Confirm;
[actual James result](initial-consult-james-booking-2026-10-05.md) records host/time PASS,
Cal Video instead of Zoom and expired/revoked Zoom authorization. Pending statements below
are historical; reminder scope was later expanded to nine production/closed Phone links.

Created hidden event7352395, `initial-consults/test-james-calendar-zoom-20261005`, without
modifying paid T3. Independent fresh provider QA PASS: Hidden,30m, Zoom-only organizer default
app, James-only medium priority, Maximize availability, no fixed hosts/weights/future members;
payment OFF, two-hour notice,15-minute post-buffer,14-calendar-day horizon, attendee-only/same-host
policy inherited. All eight event workflows OFF. Test473280/473288 remain active only on original
7253414; production450309/450313 retain exactly five production links; all SMS inactive.

The prepared public slot is October6 14:30–15:00 UTC (16:30–17:00 Amsterdam,10:30–11:00 New York).
It shows Confirm, not Pay to book, one required empty phone field, required State and optional
unchecked SMS. No contacts entered or submission made. Proposed recipient roles are the same
controlled test attendee and James organizer; exact contacts are confined to the user approval
request/provider views. Technical copy says $0/no consultation, confirmation/calendar invitation
only, no reminders/SMS. Recipient/scenario approval and user final Confirm remain pending.

This can establish actual James calendar/Zoom and native confirmation behavior without another
charge. It cannot establish production $60 payment, receipt or payment-dependent lifecycle. No
cancellation/cleanup notices are authorized; inspect the original destination, Zoom record and
slot exclusion after submission before proposing cleanup. Preserve T3's future reminders.

### Earlier Phone-only scope preparation — superseded by separate-method packet

Current [hosted update contract](https://cal.com/docs/api-reference/v2/event-types/update-an-event-type)
and [OpenAPI](https://cal.com/docs/api-reference/v2/openapi.json) support universal system phone
`required:false, hidden:true` while email stays visible/required. A Phone-only event would keep
native attendee-phone location; a Zoom-only event would keep Zoom plus visible required universal
phone. This is a documented candidate, not a hosted save/render acceptance result.

Do not merely omit phone: the update contract restores omitted default fields, and bookingFields
replacement must preserve Name/Email/State/optional Notes/unchecked voluntary SMS. An optional
but visible second phone input does not satisfy exactly once. Certification requires an isolated
Phone-only save/reload and exactly one required public phone input, plus equivalent Zoom-only
rendering and blank-number rejection without booking submission. No change to T3 for this probe.

An unsaved editor visibility probe on hidden7253414 hid the universal phone and left one visible
required location phone in the Phone preview. The hidden universal DOM input still had required=true,
so visibility alone is not the proposed ready configuration: the Phone variant must also make that
universal question non-required. Reload restored visible required universal Phone and Save disabled;
no field settings were saved. This preview is not the isolated Phone-only public acceptance gate.

Smallest active inventory would be four choices × two methods = eight events, with Jessica
paused. It needs method selection before the calendar, paired runtime paths and preserved native
Stripe/Zoom/calendar/workflow settings. Existing mixed URLs need an explicit mapping decision;
leaving them mixed keeps the defect reachable. This earlier candidate was subsequently approved for preparation; saved Phone probes/counterparts
and source preparation are recorded in the later method-routing packet. No hosted API mutation or
new booking submission occurred.

### Final verification of this policy/preparation supplement

Independent review (GPT-6.1-Sol, high) PASS after reconciling every current T3 summary/matrix
with client-attested immediate mail/calendar addition and replacing the stale paid James proposal
with the prepared free scenario. No blocking finding; reusable memory: none. Independent provider
QA (GPT-6.1-Sol, medium) PASS for all-six role/same-host settings, all-five saved native descriptions,
bounded live form/layout/timezone checks and free James preparation with original paid-test/production
scope preserved. Phone duplication remains a recorded failure and overall external acceptance is
NOT ACCEPTED. `git diff --check` PASS. Actual diff is operational/evidence documentation only;
no source behavior changed, so existing source checks below were not rerun.

### Refund clarification bounds

Independent investigation found the [public cal.diy fork's refund processor](https://github.com/calcom/cal.diy/blob/main/packages/features/bookings/lib/payment/processPaymentRefund.ts)
subtracts calendar
days from start and rejects only processing times after the deadline. It does not explicitly
select UTC; [default Day.js is local time](https://day.js.org/docs/en/plugin/utc).
Equality reaches a refund attempt, not Stripe success;
processing time is not necessarily the instant the user clicked. The fork is not proof of hosted
6.9.11-h or its runtime timezone. Support's UTC/inclusive/48h assertion therefore remains
unverified by an actual hosted cancellation/refund or DST boundary. Approved calendar-day copy
and saved settings remain; no financial boundary test occurred.

## User-completed Stacie paid test — T3, October 5, earlier payment pass

PR #3 was merged by the user into develop (`989827a`); the existing hir-249 worktree was
synchronized before this evidence supplement. Root local changes and untracked test artifacts
remain preserved. No production deployment or Done occurred.

The user filled the remaining fields and completed the specifically approved Stacie checkout.
This is the third separately approved $0.50 test, **not authorization for James, further charges
or refunds**. Public/admin/Stripe identifiers are correlated only in restricted provider views;
shareable evidence uses T3 and omits attendee contacts, booking/payment IDs and Zoom tokens.

| T3 criterion | Observed evidence | Acceptance limit |
| --- | --- | --- |
| Paid booking / routing | One current Upcoming record, Confirmed/Paid; assigned Stacie; technical-only notes; $0.50; 30 minutes, October7 22:30–23:00 UTC | Hidden one-host test, not production Direct Choice/RR or $60 acceptance |
| Timezone | Attendee zone recorded Europe/Amsterdam; appointment equals October8 00:30–01:00 Amsterdam and October7 18:30–19:00 New York. Viewer confirmation/admin display British Summer Time, October7 23:30–00:00 | Same instant corroborated by public calendar-link UTC dates; email timezone output still unverified |
| Payment | SOLAGREE live Stripe All1–4of4: exactly one new Succeeded $0.50 USD intent, one latest charge, one charge-success event, payment-success event; metadata references Stacie/test event/numeric booking ID | No duplicate new successful charge in visible dataset; future retry/concurrency protection and strict numeric-ID↔Cal UID bridge remain unaccepted |
| Provider acceptance | Cal history Accepted, actor Stripe, Source WEBHOOK, PENDING→ACCEPTED | Native webhook acceptance, not email/calendar-delivery proof |
| Zoom | Generated Zoom Video URL appears in admin Where and canonical public confirmation; same link is included in public add-to-calendar URL | Initial payment redirect showed generic conferencing placeholder; canonical confirmation resolves it. No Zoom join or native Zoom-console record checked |
| Receipt | Exactly one receipt-sent row to approved attendee, October5 10:50 in Stripe UI timezone; rendered SOLAGREE/$0.50. Later client confirms immediate mail received through user | Client-attested inbox delivery; contents/count/header timestamps and Stripe display timezone not directly inspected. No resend action used |
| Calendar | Public confirmation offers matching UTC time/Zoom; later user reports client confirmed calendar entry added | Client-attested addition, not independent inspection of Stacie destination/event details or arbitrary busy conflicts |
| Hosted slot exclusion | Independent public TEST/$0.50 and Stacie/$60 availability on October8 Amsterdam exclude booked00:30 and post-buffer01:00; adjacent01:30/02:00/02:30 remain. Viewer calendar overlay turned off for checks and restored | Cal.com exclusion only, not native Google calendar write or arbitrary external busy conflict |
| Email reminders | Test473280/473288 active only on hidden; production450309/450313 off for hidden | Native timers and inbox delivery not accepted yet |
| SMS | Prepared checkbox was unchecked. Actual user-completed record contains consentYes; independent current event-workflow check confirms all four SMS workflowsOFF | User changed consent during completion; default is not inferred from finalYes. No SMS delivery claim or activation |
| Refund / lifecycle | T3 currently Paid/Confirmed and StripeSucceeded; no agent cancellation, reschedule or refund | User alone performs financial cleanup; native cutoff and manual-reschedule gaps remain |

Independent fresh provider QA PASS for this bounded T3 scope: paid Stacie booking/time, Zoom
URL, Stripe webhook, one new successful intent/charge/receipt-sent row, and hidden email-only
workflow scope with all SMS off. A second independent public check confirmed canonical Zoom
confirmation and hosted slot/post-buffer exclusion on hidden and Stacie direct, with viewer
calendar overlay off during observation and restored afterward. The later client attestation confirms
T3 immediate email receipt and calendar addition. Direct inbox content/count/timestamp and host-calendar
destination/details inspection, external busy conflicts, future reminders, Zoom join, refunds and
production paths remain unaccepted. QA made no booking, payment or provider-configuration
changes and sent no messages; the temporary viewer overlay change was restored.

Expected reminder trigger instants for T3: 24h at October6 22:30 UTC (October7 00:30 Amsterdam),
1h at October7 21:30 UTC (October7 23:30 Amsterdam). These are planned trigger times, not
observed dispatch/delivery timestamps. Keep this paid test and its test workflow bindings until
inspection; then disable test reminders and restore hidden hosts. Do not initiate cancellation
that could auto-refund, delete Zoom or modify the booking as cleanup without the applicable
user instruction. Timed follow-up and recipient/host-calendar evidence remain external actions.

Independent review of this T3 documentation diff (GPT-6.1-Sol, high): PASS after updating
stale payment counts, pre-T3 Upcoming/refund snapshots and merged PR context. `git diff --check`
passed. Reusable memory: none. This supplement changes only evidence/runbook documentation;
source checks below were not rerun because no source behavior changed.

## Saved configuration implementation — earlier October 5 configuration pass

PR #2 was merged by the user into `origin/develop` (`aa24ff8`). The existing `hir-249` worktree
was rebased onto that develop before this supplement; unrelated files remain preserved.
The refreshed Cal.com UI identifies itself as `6.9.11-h`, superseding the earlier version snapshot.

- Production attendee-email reminders 450309 (24h) and 450313 (1h): removed only hidden test
  7253414. Saved and reloaded; exactly five production links retained, future-event application
  off, one email action each, existing 30-minute/$60 copy unchanged.
- Created test reminders 473280 (24h) and 473288 (1h), saved/reloaded with **no active links**.
  Subject starts `[TEST]`; body explicitly describes a 30-minute/$0.50 USD technical test and
  says no consultation is requested. Native attendee/event/date/end/timezone/organizer/location/
  meeting-URL tokens retained. Calendar attachment and auto-translation off; no SMS action.
  These templates have not executed or sent anything. Activate only after recipient/scenario
  approval and only for the hidden event; disable after the approved test.
- Hidden 7253414 assignment changed from Taj/James/Stacie to **Stacie only**, medium priority,
  Maximize availability, no fixed hosts/weights/automatic future members. Saved/reloaded.
  Phone and Organizer default app labeled Zoom remain; 30m/$0.50 USD/ON_BOOKING/native
  two-calendar-day refund rechecked. No booking submitted. Restore the original three-host
  hidden pool after the controlled sequence; production assignments remain unchanged.
- Independent provider QA reloaded all four workflows in its own authenticated tab: PASS for
  persisted timing, scope, action count, price copy and retained tokens. Test exclusion was
  independently visible by title, not a numeric-ID bridge. Delivery, token output and timer
  execution remain unaccepted. A subsequent independent fresh-tab QA also confirmed Stacie-only assignment, 30m, original
  attendee-phone/Zoom choices, $0.50 USD ON_BOOKING and two-calendar-day refund. PASS for
  saved configuration; no booking, calendar write, Zoom generation, delivery or refund claim.
  Header status was Hidden with its visibility switch off; this is not access control—direct URL remains bookable.

## Approved Stacie test handoff — earlier October 5, superseded by T3 result above

The user approved the specifically presented Stacie Zoom/$0.50 USD/SOLAGREE scenario and
controlled attendee/host recipients, and approved sending the prepared technical support question.
This approval covers this Stacie scenario only; it does not authorize James, new financial tests
or refunds. The user still performs the final payment and any real refund.

- Test reminders 473280/473288 now saved/reloaded **active only on hidden 7253414**, one test
  link each, no production links and no future-event application. Independent fresh-tab QA
  PASS for these saved scopes, 24h/1h triggers, $0.50 technical copy, native tokens and no SMS.
  Earlier inactive-template observations remain historical. No scheduler/delivery claim.
- The public form is prepared for Stacie/Zoom at October 8, 00:30–01:00 Amsterdam (October 7,
  18:30–19:00 New York), 30m/$0.50 USD. Approved attendee identity and technical-only notes
  filled; phone and State left to the user, SMS unchecked. Pay to book not pressed by the
  agent. No new booking, PaymentIntent, charge, calendar write or Zoom meeting is accepted yet.
  Reconcile user-completed checkout before any further submission; do not create duplicates.
- Cal.com Support message submitted via authenticated Help messenger. Ticket
  `215476247361743`, status Submitted, message initially Not seen yet. It asks about phone reuse,
  organizer-only manual changes preserving payment, and cutoff timezone/equality/DST. No
  client details or payment identifiers included. Creation is not a provider resolution.
- Keep test reminder scope only for the approved test. After delivery inspection, disable both
  templates and restore hidden host scope; do not cancel/refund a paid booking automatically.
  If the user declines checkout, disable the templates without submitting a booking.

## Evidence matrix

“Code” means repository behavior/fixtures. “Services” records the observation date and extent.
Historical configuration evidence is not current saved state, delivery, calendar or payment acceptance.

| Criterion | Verified by code | Confirmed in services | Required external action / acceptance |
| --- | --- | --- | --- |
| Active roster / pause | HIR-609 filters before event validation; Jessica profile retained; in develop | Oct 5 admin: Maximize availability; three medium-priority hosts, weights off; direct one-host assignments visible. Jessica Hidden, ended Sep 16 window; old direct URL blocked | Real booking host reconciliation; later approved release must retain Jessica pause |
| First Available / Direct Choice | Selector resolves four visible paths and mounts one selected embed | Oct 5 public event titles/price; prior Sep 28 staging iframe paths matched | Real RR union/routing and direct booking host reconciliation |
| Duration, price, payment mode | Site states 30 min / $60; provider owns checkout | Oct 5: all five $60 USD, Stripe Initial Consults, ON_BOOKING, Save disabled; hidden event $0.50; public duration 30m | Existing $0.50 dashboard reconciliation below; controlled $60/direct-routing acceptance remains |
| Rules / hours / timezones | Website delegates availability to Cal.com | Oct 5: five rules rechecked (Jessica has closed range); RR common/restriction schedule off; Taj Mon–Fri09–17 PT, James Mon–Fri09–17 ET, Stacie Mon–Thu18:30–21 and Sat12–14 ET | Confirm approved hours and intended Taj destination; actual notice/buffer/horizon boundaries, calendar conflicts, concurrency |
| Phone exactly once, required for both methods | Prepared separate mode/path validation/explicit method gate passed independent source QA; default remains mixed | Old four public mixed routes still duplicate Phone; isolated Phone-only/Zoom-only render and browser constraints PASS; four new closed Phone saved-field QA PASS. Free James Phone submitted after one required input; actual supplied number appears in Who/Where and confirmed admin record. October 6 invitation/calendar number client-confirmed; manual Google/Office/ICS still omit phone location | Authorized coordinated old-route Zoom conversion/new Phone opening/runtime deployment. Direct attachment/destination details, known manual export limitation, actual blank rejection and broader paid lifecycle remain open. Failed Custom attendee experiment not repeated |
| Required Name/Email/State, optional Notes/SMS | Website does not add a duplicate contact form | Sep 15 approved fields; Oct 5 public form recheck; SMS unchecked | Confirm provider validation, no attribution field, current forms and consent on all five |
| Calendar / Zoom | No website-side meeting generation | Taj Sep28 and Stacie T3 paid tests generated Zoom URLs; T3 calendar addition client-attested. Free James Zoom-intended Confirm completed: correct host/time, actual Cal Video; fresh October 6 check still shows Zoom Default with expired/revoked permissions. Free James Phone correct phone Where; received invitation/calendar number now client-confirmed. Manual exports omit phone location; configuration does not prove native write pipeline | James/client reauthorizes Zoom, warning clears, then separately approved retest. Earlier free James Cal Video inbox/calendar attestation, direct destination/event-detail inspection and arbitrary busy conflicts remain open. Existing bookings remain intact |
| Historical T1/T2 and new T3 $0.50 tests | No fixture claims live-payment success | Earlier Oct5: T1/T2 succeeded and A1Incomplete, no refunds. After userT3: All4records, three Succeeded$0.50 with one charge/receipt per test and A1Incomplete | T3 immediate delivery client-attested; historical inbox/direct content and strict numeric-ID↔UID bridge if needed; later separate R1 refund does not refund T1/T2/T3; broad retry/concurrency/$60 acceptance remains |
| Decline / abandon / retry / duplicate protection | Website invokes native checkout, no custom payments | Sep 28 cancel checkout left Pending payment/Unconfirmed; redirect to admin's empty public profile; rejected in cleanup. Error collecting card is T1 rescheduled original, not independent decline evidence; Oct 5 Stripe abandoned intent Incomplete, no payment method/charge/receipt | Slot-hold expiry and retry/concurrency acceptance; no usable unpaid confirmation; no duplicate charge/booking |
| October 6 isolated Stacie abandon + recovery | No custom payments or new source change; fixtures do not accept native lifecycle | Same original intent recovered via observed history URL/user Pay: at the October6 post-recovery check All5 were4Succeeded/1Incomplete, one $0.50 charge; same UID Confirmed/Paid/Zoom/Stripe WEBHOOK. Slot/buffer released by06:41:12 then re-excluded06:45:02. Rendered receipt and one sent-history row PASS; inbox delivery unverified | Exact release TTL/cause, expired-link invalidation, historical unpaid-title inconsistency, anonymous/server gating/direct delivery/host-calendar evidence, decline/concurrency/double-click |
| Confirmation / receipt / reminders | Site copy stays 30 min / $60 | Earlier Oct5: 450309/450313 active on five production links; later method prep nine (original five + four closed Phone), fresh QA PASS. Hidden test excluded with one attendee action, 24h/1h, event/date/end/timezone/organizer/LOCATION/MEETING_URL, hard-coded30m/$60. Oct 5 guest notifications enabled, including confirmation/cancel/change/payment pending; Stripe shows one sent receipt per T1/T2/T3 paid test, each rendered at $0.50; client attests T3 immediate emails received | Direct message content/count/header timestamps; historical/other-host delivery; future 24h/1h reminders; matching host/timezone/Phone or Zoom and no broken Zoom links in Phone mail |
| Hidden test reminder accuracy | Not website controlled | Oct 5 resumed: hidden excluded from production templates; 473280/473288 saved with $0.50 copy, now active only on hidden after specific Stacie approval; independent config QA PASS | T3 user checkout complete; actual reminder token rendering and 24h/1h dispatch/inbox delivery pending |
| Refund | Site copy now says 2 calendar days | Saved rule retained; October6 early Jill-admin cancellation of R1-R after separate approval/user final action: one full original-charge $0.50 USD refund, object status succeeded, no duplicate; one Refund sent row. T3 preserved | Customer threshold before/equal/after/DST, refund inbox/bank credit, actual native calendar/Zoom removal; current early admin result does not establish guest boundary enforcement |
| One manual reschedule | Site directs request to Solagree | Saved Attendee only/Always and same-host/Always. October6 approved Jill-admin test: original Rescheduled → same-Stacie replacement Confirmed/Paid/new time; same $0.50 charge retained, no new charge/refund; old slot available/new excluded; full Zoom reference retained; guest self-reschedule absent; one controlled complimentary change recorded | Own-Stacie workflow, actual Zoom meeting-time update, notices/native calendar update, anonymous/old guest-URL enforcement and production allowance ledger/second/late requests |
| SMS | No requirement to enable SMS for email launch | Oct 5 all four SMS workflows show No active links; First Available switches off; prior zero credits not revalidated | Keep inactive; optional future sender/credits/predicate/mapping/consent acceptance. Not a blocker for email acceptance |
| Desktop/mobile, keyboard, fallback/privacy | Reviewed separate-method implementation and focused source/browser QA PASS; fixture tests do not prove native paid lifecycle | Approved full staging refresh from d4f344e: independent direct and Home/About client navigation, four correct single embeds, Jessica absent, desktop 1728/mobile 390 with no overflow PASS. Runtime remains mixed. Production remains legacy | Coordinated separated-method activation and production release require separate authorization; remaining screen-reader/provider empty/error and native lifecycle checks stay open |

## Public read-only recheck — earlier October 5, before role-policy implementation

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

## Host integrations and notification configuration — earlier October 5 snapshot

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
request, location change and guest-added notices are checked. At this earlier read-only snapshot, both attendee email workflows
450309/450313 listed all five production events plus hidden 7253414, with one attendee action each.
The resumed saved isolation above supersedes that scope: hidden excluded, five production links retained.
All four SMS workflows (450318/450324/450327/450330) currently show No active links. No notification
setting or workflow was saved during that earlier inspection. The later workflow saves are recorded
above; no test message has been sent in either pass.

## Existing Cal.com booking reconciliation — earlier October 5, pre-T3 snapshot

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

## Authenticated Stripe reconciliation — earlier October 5 T1/T2/A1 snapshot

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

## Earlier Phone correction investigation — HIR-246, before Support reply

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
calendar or map presentation. On the refreshed 6.9.11-h editor, an unsaved inspection of organizer Phone call exposed a
required organizer telephone; Organizer Address exposed an address control and no Phone label.
Both fail the intended consultant-calls-attendee semantics. Reload restored the original attendee
phone/Zoom configuration with Save disabled; no address-as-phone change was saved or rolled out.
The required system phone identifier remains fixed as attendeePhoneNumber with no conditional controls.

Minimal scope-preserving next action is a provider correction/reuse mapping; the unresolved
question should include the failed Custom attendee location evidence. An alternative is separate
native Phone and Zoom events/routing: Phone collects its location phone once, Zoom requires the
universal phone. This changes event inventory/selection, requires SMS mapping and all native
payment/lifecycle acceptance again, and remains a proposed scope decision rather than an implemented fix.

## Controlled test plan — historical before James Confirm

The proposals below predate the completed free James test. Stacie T3 is completed; James
host/time is confirmed, but intended Zoom failed with Cal Video. The later free Phone scenario
is approved and prepared, awaiting user Confirm. Remaining paid lifecycle scenarios still need
their own specific approvals; this historical plan authorizes no new submissions or sends.

The existing tests now have the bounded dashboard reconciliation above. Before any new test,
finish any required strict ID bridge and receipt inbox verification in Stripe/Cal.com. Label them T1/T2 in shareable
evidence; retain booking/payment IDs and recipient details only in restricted provider/operations views.
For each record compare date/time, host, event, amount $0.50 USD, successful PaymentIntent/charge,
booking confirmation, receipt recipient/status, duplicate objects and refund timeline. Record whether
both charges remain paid, have refunds, or failed; never infer refund from Cal.com's banner.

Before a new submission, approve **the specific attendee and host recipients plus scenario**, and
verify the hidden event's host/location, amount, refund settings and notification scope. Production
price/payment amounts remain $60. No invalid Stripe test-card numbers are used in the live tenant.

| Proposed scenario | Environment / amount / payee | Proposed recipients and user handoff | Evidence and cleanup |
| --- | --- | --- | --- |
| Guest-link vs organizer reschedule | Existing hidden T3; no new payment; a new booking needs separate $0.50 approval/user payment | Original authenticated Stacie organizer and approved controlled attendee/host; obtain specific change-notice approval before submitting | Use saved Attendee only/Always and Always same host. Preserve reminder bindings; choose timing after initial mailbox/calendar evidence. One authorized change, payment retention, slot release, UID lineage/notices; old guest URL rejection and second/late request handling still untested. No cancel/request-reschedule/rebook substitute; user performs financial cleanup |
| Stacie calendar/conflict/Zoom | Hidden one-host scope matching Stacie settings; $0.50 USD to SOLAGREE | Exact controlled attendee inbox + Stacie host inbox approved before submit; user pays | Single booking/payment, Solagree destination entry, busy-time exclusion, valid Zoom meeting, confirmation/receipt; user handles financial cleanup |
| James calendar/conflict/Zoom | Free hidden7352395; user Confirm completed; no payment | Specific controlled attendee/James scenario approved and completed by user | Correct host/time, actual Cal Video instead of Zoom. James/client reauthorization and separately approved retest; native destination/inbox/conflict evidence remains open. Cleanup notices and paid lifecycle are not authorized |
| Email 24h and 1h, Phone/Zoom | Hidden event with price-correct isolated workflow templates; $0.50 USD to SOLAGREE if new booking required | Approved attendee + explicit host; no SMS; user pays | Scheduled event >24h ahead, receive both reminders at correct times/timezone; inspect Phone instructions vs Zoom URL, actual confirmation/receipt/cancel/change emails; requires timed follow-up separately requested by user |
| Abandon / failed / retry / concurrency | Hidden event; no charge for abandoned checkout; any successful retry $0.50 USD to SOLAGREE | Approve recipient/host side effects before booking form submission; final successful payment by user | Record hold start/expiry, no usable unpaid booking, safe return/retry, exactly one successful charge/booking. A deliberate live decline needs a provider-approved scenario first |
| Refund boundaries | Hidden event; each proposed new booking $0.50 USD to SOLAGREE | Approve each scenario/recipient separately; user pays and performs any real refund | Before/equal/after native threshold and DST; hosted version/timezone and exact decision, Stripe refund object/status, mailbox evidence. Clarify if Cal cancellation itself auto-refunds before acting |

A $0.50 hidden test proves integration behavior only; it does not prove a $60 charge or every direct
production event. Public $60 settings plus hidden results must be explicitly accepted as sufficient,
or a separately approved $60 scenario remains. The specific first Stacie Zoom test and exact attendee/host recipients were approved by the
user; checkout is now completed by the user and reconciled as T3 above. No agent financial
action occurred. The prepared-form details below describe the earlier handoff, not current booking state.
The unsubmitted public form is prepared for October 8, 00:30–01:00 Europe/Amsterdam
(October 7, 18:30–19:00 America/New_York), more than 24 hours ahead of preparation. Zoom
selected, approved attendee identity/notes filled, required phone and State still empty, SMS unchecked. Revalidate availability before submission; the
preview does not reserve a slot. Required phone and State must be supplied by the controlled
attendee/user before checkout, not invented by the agent.
Original hidden7253414 retains Stacie/T3 and its reminders. James free7352395 was subsequently
approved and completed; its [actual result](initial-consult-james-booking-2026-10-05.md) supersedes
the earlier pending handoff. The approved Phone preparation is a separate unsubmitted scenario.

## Earlier configuration decisions and provider question — superseded by later reply above

The reminder isolation and test templates above are saved; templates were initially inactive
and are now active only on the hidden event after specific Stacie approval. No test submission is
authorized merely by their creation. Phone/Zoom output still needs actual confirmation/ICS/mail
inspection. The proposed reschedule switch rollout is withdrawn following fresh independent
provider investigation.

[Official hosted Help](https://cal.com/help/event-types/disable-canceling-rescheduling) explicitly
says Disable rescheduling prevents both guest and organizer changes, including dashboard/calendar.
The [reschedule API](https://cal.com/docs/api-reference/v2/bookings/reschedule-a-booking) exposes
conflict/window/limit exceptions, but no documented bypass of that flag. Its rescheduledBy field
is not a policy override. The [request-reschedule endpoint](https://cal.com/docs/api-reference/v2/bookings/request-to-reschedule-a-booking)
cancels the booking and emails a guest link; it is not a safe replacement preserving the agreed
manual paid-booking lifecycle. Temporary event-wide re-enabling would reopen guest changes
and has no demonstrated atomic organizer-only guarantee. No reschedule/cancellation flags or
existing booking lifecycle were changed. Support clarification or an explicitly accepted product
alternative remains necessary; hiding a website link alone cannot enforce the policy.

Cal.com support question — submitted October 5 after specific user approval (ticket 215476247361743):

> On hosted 6.9.11-h, our paid 30-minute event offers Attendee phone number and Zoom.
> We require one phone number for both choices. With the required attendeePhoneNumber field,
> Phone also requires a separate location optionField, so attendees enter the same number twice.
> Custom attendee location was already tested on a hidden event and did not resolve this.
> Is there a supported canonical reuse/mapping or conditional input setting that collects the
> number once and preserves the native phone location, Zoom creation and native Stripe payment?
> Your Help says Disable rescheduling also blocks organizers. What supported method prevents
> guest self-service while letting an organizer make one manual change to a paid booking without
> cancellation, refund, a second payment or reopening guest access? Please also clarify the precise two-calendar-day refund cutoff, including timezone, equality
> and DST. We have no hosted payment sandbox; we will not use live test-card numbers.

The user authorized this technical message and it was submitted through authenticated Help.
The messenger confirms ticket creation/Submitted, not a support answer or resolved behavior.

Independent review of this configuration-documentation diff: PASS after correcting two stale
snapshots/proposals and a support-question typo. Independent provider QA: PASS for saved
workflow and hidden-event settings only. `git diff --check` passed. No source change in this
supplement; previous source/fixture checks below were not rerun. Reusable memory: none.

## Launch gates and rollback

1. Release the prepared separate-method solution only with explicit coordinated provider/website
   authorization, then finish actual field/number acceptance; old mixed Phone still duplicates.
   Saved guest-only role restriction and own-host picker access are
   verified within the stated bounds; finish actual paid manual-reschedule lifecycle and old-link enforcement.
2. Historical T1/T2 dashboard reconciliation is complete within the stated bounds; finish receipt
   inbox/strict ID bridge and active-host calendar/Zoom, payment failures/retry/slot release and email delivery.
3. Obtain the provider-boundary decision and prove Stripe refund handling, not just Cal copy.
4. Source review/code QA passed as documented below; finish current integrated browser acceptance and maintain explicit gaps.
5. Reviewed task PR merges are authorized by the user's later instruction; production deployment and Done still need separate authorization. HIR-609 is already in develop,
   PR #1 policy copy is now in develop after an external merge; production release remains unverified. Verify generated output has exactly
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
