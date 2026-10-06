# Initial Consult paid lifecycle preparation and abandon observation — October 6, 2026

Latest [early admin cancellation/full refund result](initial-consult-cancellation-refund-2026-10-06.md):
R1-R is Canceled after separately approved user final action. Independent Stripe review verifies
one full $0.50 USD original-charge refund, succeeded; ledger now three Succeeded/one Refunded/
one Incomplete. Slot restored; logged-in guest canceled/no Zoom; exact customer cutoff, bank
credit, delivery and native calendar/meeting deletion remain unaccepted. This supersedes the
active post-reschedule state below; no additional financial or notification action is authorized.

Later approved [manual reschedule result](initial-consult-manual-reschedule-2026-10-06.md):
R1 was moved by user final Reschedule through the Jill-admin path. Original record is Rescheduled;
linked replacement R1-R is Confirmed/Paid at October 9 02:00–02:30 Amsterdam with Stacie.
Independent Stripe review retains original $0.50 intent/charge and unchanged five-record ledger,
without new charge/refund activity. This supersedes the post-recovery record state below;
no further change/financial action is authorized. Own-Stacie path, delivery and actual Zoom-time
update remain unaccepted.

HIR-248, coordinated with HIR-246 → HIR-249 → HIR-250 and HIR-609 publication dependency.
This records controlled preparation and one abandoned native checkout; full lifecycle acceptance remains open.
No attendee contacts, phone values, booking/payment identifiers or secrets are recorded.

## Isolated hidden event

The user authorized preparation of controlled tests on hidden events, with separate exact
recipient/scenario approval before submissions and user final payment/refunds. Existing paid
Stacie T3 and free James Cal Video/Phone records remain intact. James Zoom still requires
account-holder reauthorization; this Stacie preparation does not depend on that repair.

Separate event **7357581**, path `initial-consults/test-stacie-payment-lifecycle-20261006`,
was initially Hidden and closed on the historical September 16–16 window. The authorized
October 6 window opening below supersedes that initial closed-window state.
It was duplicated from the existing hidden paid test without modifying that source event.
Title: **TEST — Stacie payment lifecycle — no consultation**.
It is a technical 30-minute / $0.50 USD test paid to SOLAGREE, with no consultation or live call.

Saved payment settings: Stripe Initial Consults, USD 0.50, ON_BOOKING and native refund cutoff
If cancelled 2 calendar days before. Stacie-only medium-priority assignment, Maximize availability,
no fixed hosts/weights/Add all team members including future members. A transient unhydrated
setup view initially appeared to have no hosts; fully loaded Assignment confirmed the retained
Stacie host. No host edit was needed. Closing the inherited fourteen-day horizon was intentional.

Independent fresh native preparation review (GPT-6.1-Sol high) PASS and preparation QA
(GPT-6.1-Sol medium) PASS. Fully loaded saved settings confirm sole Organizer's default app
labelled Zoom; Name/Email/universal Phone/State required, Notes optional and smsConsent
optional/Required OFF with unchecked synthetic admin preview. The synthetic preview is not
an actual booking or public submitted-form validation.

All eight new-event workflows are OFF. Two cloned test-reminder associations were disabled
on the new event only. Independent preservation readbacks confirm original 7253414 retains
$0.50 USD ON_BOOKING and both test reminders ON; global 473280/473288 each show the original
payment-check event as their one active link. Production 450309/450313 retain nine active links
each; all four global SMS workflows have no active links. New saved settings retain two-hour
notice, zero pre / fifteen-minute post buffer, Attendee only / Always rescheduling restriction,
Always same host, cancellation enabled and past/cancelled-link rebooking OFF. Reload Save disabled.
The initial closed-window public check reported booking ended September 16.

No actual Zoom creation, payment, pending notice, slot hold/release, retry, decline, refund or
manual-change behavior is accepted by these saved configuration checks. Existing source QA
is retained; no code changed or equivalent source checks repeated. Diff/local-link checks PASS.

## October 6 authorized abandon preparation

The user approved the exact abandon-without-payment scenario and controlled attendee/host
recipients, including reuse of the previously supplied phone and State. Only event 7357581's
fixed date range changed to October 8–9, 2026. Hidden is retained; it is not access control or
an exact-slot restriction. Reload confirmed Save disabled. Fresh independent native QA PASS
confirms the retained $0.50 USD ON_BOOKING / two-calendar-day refund settings and all eight
workflows OFF. Independent artifact review PASS within its bounded scope.

The approved public slot is October 9, 00:30–01:00 Europe/Amsterdam, bound to
`2026-10-08T22:30:00.000Z`. Fresh public-form QA confirms one blank required universal phone,
State selector and optional unchecked SMS. Required State is retained in saved configuration;
server-side rejection of an omitted State was not tested. Root selected that same slot and
filled only the approved contacts/phone/State; SMS remains unchecked and no guests were added.
The prepared form is handed to the user at **Pay to book**. The agent did not accept Terms,
click Pay to book, open payment, submit, enter card data or make a payment.

At this preparation handoff the user still had to open the step and close it without entering
a card or paying. Native pending notices for the approved recipients are within this scenario;
event reminder workflows and SMS are OFF. This does not prove native pending-payment emails
are disabled. At handoff no actual booking, intent, charge, receipt, hold expiry or release was accepted.
Successful retry, financial cleanup and cancellation/change notices remain separately gated.
Private contact values are confined to approved provider views; safe configuration artifacts
are under the local payment-lifecycle-preparation evidence directory.

## Actual approved abandon — October 6

The user reported completion after the requested payment-step opening/closing without card
entry or payment. Root's fresh live SOLAGREE Stripe All view shows five records: the original
three Succeeded $0.50 tests and original Incomplete remain, plus one new Incomplete $0.50.
Independent financial review confirms current Incomplete / no payment method. The visible
payment_intent.created event at **05:53:20 UTC** records amount 50 cents, amount_received 0,
requires_payment_method, payment_method null, latest_charge null and live mode true. These JSON
fields are the creation-event snapshot; current UI remains Incomplete. Metadata identifies
Stacie, the technical test title and a numeric booking ID. No new successful charge or
charge-success activity is shown. No receipt-success flow was observed; direct inbox absence
and a strict numeric booking ID-to-Cal UID bridge are not established.

Independent Cal QA confirms one matching Stacie technical test entry as **Pending payment /
Unconfirmed**, with details Pending and $0.50. Its October 8, 23:30–October 9, 00:00 British
Summer Time display matches October 8, 22:30–23:00 UTC / October 9, 00:30–01:00 Amsterdam.
Where says conferencing details will follow in a confirmation email; an actual confirmed
Zoom meeting is not established. The visible history's booking-created entry is not payment
acceptance. Rendered details did not expose the numeric ID, so matching title/host/time does
not establish the strict ID bridge. Public guest confirmation/server gating had not yet been inspected
at this initial observation; the later guest-page check below supersedes that part.

At **05:56:40 UTC**, public approved-slot UTC 22:30 and following 23:00 slot were absent with
Overlay my calendar OFF; adjacent 23:30 UTC / 01:30 Amsterdam remained available. QA restored
overlay ON and Europe/Amsterdam. No expiry or hold timer was displayed. This proves continued
exclusion at that observation, not automatic release or a timeout. It does not prove a native
host-calendar write or arbitrary conflict handling. No rejection/cancellation/manual release,
retry, refund or payment was performed by the agent; original test records/reminders are preserved.

Root rechecked once at **05:59:31 UTC** with overlay OFF: approved UTC 22:30 and following
23:00 were still absent, while 23:30 / 00:00 / 00:30 UTC were available. This is approximately
six minutes after intent creation, not proof of any particular expiry policy. A privacy-safe
DOM-derived availability record is retained locally as `abandon-slot-exclusion-055931.json`.
Overlay ON was restored and the research tab closed.

Bounded no-charge/pending-state evidence is accepted. The later pending-email attestation and
guest-page check below supersede those initial pending gates in their stated scope. Natural
release, anonymous/server payment gating, deliberate decline, paid retry/concurrency and financial
cleanup remain external gates. Event workflows OFF does not suppress all provider-level notices.

## Later October 6 follow-up: continued exclusion, guest page and native email

Fresh independent Cal QA at **06:20:58 UTC**, 27 minutes 38 seconds after intent creation,
still finds the matching Pending payment / Unconfirmed record and no expiry timer. With personal
overlay OFF, approved UTC 22:30 and following 23:00 remain absent; UTC 23:30 / 00:00 / 00:30
remain available (October 9 Amsterdam 01:30 / 02:00 / 02:30). Viewer settings were restored and
the research tab closed. Continued exclusion is observed; indefinite holding and eventual expiry
are not established. Root's subsequent fresh Stripe detail remains Incomplete / no payment method,
with only the visible payment-created activity; no financial action was taken.

Root opened the known Cal.com canonical booking route using the UID exposed by the matching
admin record. Fresh independent guest-page QA confirms the **logged-in Jill view**: body heading
**Your meeting is awaiting payment**, same Stacie technical event/$0.50/approved UTC interval,
no Paid badge and no rendered Zoom/Cal Video link. Where says conferencing details will follow
in a confirmation email. No visible Pay/Complete payment control was shown. Body pending-state
messaging PASS is bounded to this view; anonymous access/server-side payment enforcement was
not exercised. Private UID and contact values are excluded from evidence.

Provider UI inconsistency: document title is **Your booking has been confirmed | Cal.com**
despite the body's awaiting-payment state. Google/Office/Outlook/Other calendar-export controls,
Cancel and Report booking remain visible. None were used. Their presence proves neither a paid
confirmed booking nor a completed export/native host-calendar write. The title inconsistency is
an open hosted-provider finding; website source cannot establish its correction.

The user confirms receipt of a Cal.com email offering payment after abandonment. Mark native
pending-email delivery **client-attested**. Later, the user reports there is no link in that email;
its actual contents/headers remain uninspected. Do not claim email-link recovery.
This demonstrates such an email can arrive with event workflows OFF; exact timing, headers, message count and host notice remain
uninspected. The public fork's fifteen-minute default below is still not a verified hosted timer.
The approved abandon scenario included possible native pending notices for the controlled recipients.

The next same-record recovery scenario was subsequently approved: $0.50 USD to SOLAGREE,
same controlled attendee/host and date, confirmation/calendar/receipt notices, with user final Pay.
The actual result below supersedes the earlier pending-approval preparation. No new booking,
cancellation/refund or cleanup notices were included; original T3's timed reminders are preserved.

## Same-record recovery — user paid October 6

At the user's request, root used one focused Chrome jill history lookup and found the actual
original Payment page visited at 05:53:21 UTC. Root reopened that observed page; no new booking
was made. The page showed the same Stacie technical event, October 9 00:30–01:00 Amsterdam /
October 8 22:30–23:00 UTC, $0.50, and a blank live Stripe card form. The native warning said the
slot was no longer held, payment could still confirm the booking, and another attendee might
confirm first. This is recovery from browser history, **not a tested email link**.

Before payment, independent financial review still found five Stripe records (three Succeeded,
two Incomplete), the same original Incomplete intent/no method and matching booking metadata;
opening the page did not add a payment record. At **06:41:12 UTC**, independent QA with overlay
OFF found the original UTC 22:30 slot and following 23:00 buffer interval enabled again, while
the same Cal record remained Pending. Their absence at 06:20:58 and presence at 06:41:12 bounds
the observed release. Exact TTL, cadence and cause remain unknown; opening the existing payment
page may have contributed and is not excluded. This does not prove booking cleanup or expired-link
invalidation; the original payment page remained usable.

The user completed final Pay and reported **готово**. The observed return URL retained the
original Cal UID and PaymentIntent, with succeeded redirect status. Fresh independent financial
review around 06:45 UTC confirms **five records: four Succeeded and one old Incomplete**.
At that post-recovery check, the original recovery intent was Succeeded, $0.50 USD, unchanged Stacie/numeric-booking metadata,
with one distinct visible charge and no additional payment record. Rendered receipt: SOLAGREE®,
$0.50 paid. The first review displayed **No receipts sent**. On a subsequent fresh root reload
around 06:49 UTC, receipt history instead shows one Payment receipt row to the approved attendee,
October 6 02:44 AM in the Stripe UI (timezone not independently established). This supersedes
the earlier no-send snapshot; it proves recorded sending, not inbox delivery or an exact delay.
No Send receipt/resend was used. Receipt existence and recorded sending are confirmed;
receipt email delivery remains unverified.

Independent Cal QA confirms the same UID **Confirmed + Paid**, same Stacie host and approved
interval, actual Zoom Video/Join Zoom Video link, and History Accepted by Stripe, Source WEBHOOK.
The history displays October 6 08:43:38; its UI timezone was not independently established.
Root's fresh canonical booking page also exposes Zoom and Zoom locations in the manual calendar
export links. The immediate payment-return view still showed conferencing-details-to-follow,
so the fresh canonical view is the current result. No meeting Join or calendar export was used.
Private UID/intent/charge/receipt/Zoom-link values remain only in provider views.

At **06:45:02 UTC**, independent public QA with overlay OFF found the original paid slot and
following buffer interval absent again; the adjacent UTC 23:30 slot remained available.
This verifies re-exclusion after recovery, not arbitrary native host-calendar conflicts, concurrent
checkout safety or Zoom join validity. Viewer overlay was restored ON and own research tabs closed.
Direct confirmation/invitation receipt, actual host-calendar write and receipt delivery remain
external acceptance steps for this recovery; previous T3 attestations do not cover it.

Bounded same-record paid recovery, one observed successful charge, current slot release/re-exclusion,
and actual Zoom generation PASS. Deliberate decline, double-click/concurrency, exact expiry policy,
anonymous/server payment gating and customer-refund/manual-role boundaries remain open.
No further payment, financial cleanup, cancellation, configuration change, send or production action
was performed by the agent. This scenario is completed; it grants no additional charge authority.

## Controlled test sequence — abandon and same-record recovery completed

1. Revalidate the existing historical ledger and event configuration. Separately agree the exact
   controlled attendee/host recipients, date/time and possible native pending-payment notices.
   Hidden settings alone are not permission to submit or send.
2. For abandon, the user opens the payment step and leaves without entering card data or paying.
   Inspect booking state, PaymentIntent state, no charge/receipt/usable unpaid confirmation and
   actual slot hold/release. Use the provider's observed hold expiry; do not invent a timeout.
3. Successful retry is a separate $0.50 USD payment to SOLAGREE, with exact scenario/recipient
   approval and user final payment. Inspect one charge/booking/receipt, host/time/Zoom and no
   duplicate successful payment. A free test or abandoned intent does not establish retry safety.
4. A deliberate live decline needs a provider-approved scenario; Stripe test cards are not used
   in the live account. Support reports no hosted sandbox for native paid bookings.
5. Manual reschedule and refund/cancellation boundaries require their own change-notice/scenario
   approval. The user performs financial cleanup. Preserve T3's separately approved future
   reminders until inspected; cancellation can trigger a real refund and is not a harmless cleanup.

The prospective fee does not authorize a charge. The initial isolated-event preparation
entered no contacts or payment step. The later authorized form preparation above entered
approved contacts only. The user later performed the approved abandoned checkout; the agent
did not accept Terms, submit, enter a card, charge or refund.

| Scope | Code | Services | Required external action |
| --- | --- | --- | --- |
| Website/native checkout | Existing reviewed source invokes native Cal.com checkout; no custom payment engine | Unpaid guest body awaited payment/no Zoom; native payment email client-attested, user reports no email link. After user Pay, same UID Confirmed/Paid with actual Zoom | Historical unpaid-title inconsistency; anonymous/server gating; direct email timing/count/host-calendar evidence |
| Abandon/retry/duplicates | Fixtures do not prove native payment behavior | Same original intent recovered successfully; at the October6 post-recovery check five Stripe records were four Succeeded/one Incomplete; one charge, rendered $0.50 SOLAGREE receipt and one sent-history row. Slot/buffer available 06:41:12 before Pay, excluded again 06:45:02 after Pay | Exact release TTL/cause/link invalidation; deliberate decline/concurrency/double-click; receipt inbox delivery, host-calendar write and Zoom join validity |
| Refund/manual change | Reviewed policy copy uses two calendar days and one manual free request | Approved Jill-admin reschedule retained original charge; later separately approved user cancellation produced one full $0.50 succeeded refund, Canceled replacement and restored slot; one controlled change logged | Own-Stacie/customer cutoff boundaries, notices/calendar/Zoom-time/deletion, bank credit, production allowance ledger; further actions need their own authorization/user financial action |
| Launch/publication | HIR-609 roster and separate-method source preparation retained | Public events/active runtime unchanged | Independent full acceptance and separately authorized coordinated production release/Done |

The approved first abandon case is October 9, 00:30–01:00 Europe/Amsterdam / October 8,
22:30–23:00 UTC / October 8, 18:30–19:00 America/New_York. Fresh availability and the
narrow window were checked after approval; only that slot was selected for the handoff.
No card data or successful payment was included in the first abandon case. Its separately approved
$0.50 SOLAGREE recovery was later paid by the user as recorded above. Any further charge or
cleanup/change notices require separate approval/user action.
Private recipient/contact values are confined to the approval/provider views.

## Expiry diagnostic and sent support question

No authoritative hosted 6.9.11-h contract for persisted unpaid-booking expiry was found.
The [official five-minute reserve-slot default](https://cal.com/docs/api-reference/v2/slots/reserve-a-slot)
concerns a temporary reservation; it does not establish this Pending payment booking's TTL.
Pinned public cal.diy source [removes expired SelectedSlots](https://github.com/calcom/cal.diy/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/packages/trpc/server/routers/viewer/slots/util.ts#L146-L174),
not persisted bookings. Its Stripe service [schedules an awaiting-payment email after an environment-controlled delay with a 15-minute default](https://github.com/calcom/cal.diy/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/packages/app-store/stripepayment/lib/PaymentService.ts#L377-L404);
the [task sends a payment link](https://github.com/calcom/cal.diy/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/packages/features/tasker/tasks/sendAwaitingPaymentEmail.ts#L29-L93)
and does not release the booking. This is a reminder candidate, not a hosted expiry/delivery claim.
The public fork's [payment webhook is unavailable in community edition](https://github.com/calcom/cal.diy/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/apps/web/pages/api/integrations/stripepayment/webhook.ts),
so its source cannot establish hosted payment cleanup. Stripe's [Checkout Session inventory-release contract](https://docs.stripe.com/payments/checkout/managing-limited-inventory)
does not supply a deadline for the observed bare PaymentIntent without a confirmed Checkout
Session and merchant expiry handler. No five-minute, fifteen-minute or twenty-four-hour release
promise is made, and the observation does not establish indefinite blocking.

After the user reviewed the four-part text and explicitly said **отправляй**, it was sent as a
reply in existing Investigation ticket **215476247361743** (Intercom conversation 141707266).
Root reopened the same conversation and confirmed the complete text persisted, **Not seen yet**.
No support answer was present at the subsequent read. This supersedes the UNSENT snapshot in
merged PR #12 / develop `0a0aad3`; it proves sending/persistence, not read status or provider acceptance.
Local safe screenshot: `test-results/cal-support-2026-10-06/abandon-question-sent.png`.
No contacts, private booking/payment IDs, secrets or attachments were sent.

Sent text:

> On hosted Cal.com 6.9.11-h, we tested an ON_BOOKING Stripe checkout and closed it before entering a payment method or paying.
>
> Stripe shows Incomplete / requires_payment_method. Cal.com retains a Pending payment / Unconfirmed booking. The slot and its buffer were still unavailable approximately six minutes later.
>
> Could you clarify:
>
> 1. Does this persisted unpaid booking expire automatically? What is the TTL, when does it start, and how frequently does cleanup run?
> 2. After expiry, what happens to the booking and PaymentIntent? Is the slot released and the unpaid payment link invalidated?
> 3. Can native awaiting-payment emails still be sent when all event workflows are disabled?
> 4. If automatic release is unavailable, which supported action releases the slot and invalidates the payment link, and which attendee/host notifications does it send?

See [main matrix](initial-consult-acceptance-2026-10-05.md) and
[Phone result](initial-consult-phone-booking-2026-10-05.md) for existing bounded evidence.
