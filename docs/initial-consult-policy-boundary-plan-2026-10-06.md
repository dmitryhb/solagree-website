# Initial Consult — refund and manual-change boundary preparation

October 6, 2026; HIR-249/HIR-250 with HIR-246/HIR-248 and publication dependency HIR-609.
Preparation only. No new event, booking, payment, change, cancellation, notice or deployment
is created by this plan. New live scenarios need exact recipient/action approval; the user performs
final payments/refunds, final paid-booking cancellations that may trigger a refund, and any final
form action that accepts Terms. T3 and its reminders are protected.

Later separately authorized G1 was paid and canceled by the user in a signed-out attendee context.
The [G1 result](initial-consult-guest-cancellation-2026-10-06.md) supersedes the historical
not-authorized/not-booked preparation below for that exact case only. It does not accept equality,
late refusal, DST, production release or another financial action.

## Accepted contract and provider assertion

The reviewed website says one complimentary reschedule requested from Solagree up to **2 calendar
days before** the appointment, and cancellation 2 calendar days before for a full refund; later
cancellation is non-refundable. The agent must not replace this approved wording with a 48-hour
promise. Cal.com owns the refund engine; there is no website refund calculation.

Milos asserts the calculation uses UTC start minus two calendar days, equality qualifies, and local
DST does not move that UTC cutoff. Equality/DST remain provider assertions; later G1 accepts only
the actually observed early attendee path. The earlier Jill-admin refund alone did not establish
guest/equality/DST behavior. The provider
also says the original organizer can change a paid booking without another charge, while Cal.com
does not enforce a one-change cap. The completed R1 change accepted the Jill-admin path only.

For a planned case, write its start **S** and provider-asserted cutoff **C = S minus two UTC days**,
plus the local display offset. Native creation/cancellation times without a timezone label are not
verified UTC epochs. Use server/authoritative timestamps for comparisons, not a click time.

## Fresh saved-policy audit — October 6

Independent read-only native QA completed at **12:10:49 UTC / 14:10:49 Amsterdam**, hosted
Cal.com UI **6.9.12-h**. All eight routes passed the saved-configuration check; no settings,
booking interaction or notification was submitted. Research tabs were closed and existing tabs preserved.

| Route | Reschedule / cancellation controls below | Stripe / refund | Publication state |
| --- | --- | --- | --- |
| First Available mixed | PASS | $60 USD; 2 calendar days | Existing mixed route |
| Taj mixed | PASS | $60 USD; 2 calendar days | Existing mixed route |
| Stacie mixed | PASS | $60 USD; 2 calendar days | Existing mixed route |
| James mixed | PASS | $60 USD; 2 calendar days | Existing mixed route |
| First Available Phone | PASS | $60 USD; 2 calendar days | Hidden/off; Sep16–16 |
| Taj Phone | PASS | $60 USD; 2 calendar days | Hidden/off; Sep16–16 |
| Stacie Phone | PASS | $60 USD; 2 calendar days | Hidden/off; Sep16–16 |
| James Phone | PASS | $60 USD; 2 calendar days | Hidden/off; Sep16–16 |

All eight freshly rendered the following saved controls:

- Disable rescheduling ON, **Attendee only / Always**.
- Same Round-Robin host ON, **Always reschedule with the same host**.
- Disable cancelling OFF; cancellation reason ON, **Mandatory for host only**.
- Past-event rescheduling and cancelled-booking rebooking OFF.
- Paid booking ON, **Stripe (Initial Consults), $60 USD, Collect payment on booking**.
- Refund **If cancelled 2 calendar days before**; Save disabled.

The four Phone routes also retain the selected closed date range and Always14 unchecked.
The cancellation-reason control does **not** require a guest reason. This is a saved-policy audit,
not proof of guest/server enforcement, an automatic one-change cap, organizer behavior, refund
settlement or an equality/DST boundary. It does not publish Phone routes or convert mixed routes.

## Arithmetic examples — not booked or live acceptance

Computed with timezone-aware local Python `datetime`/`zoneinfo`; these verify the plan's arithmetic.
They do not prove Cal.com's implementation, availability, guest eligibility or a refund.

| Example | Session start UTC / local | Provider-asserted cutoff UTC / local |
| --- | --- | --- |
| Existing protected T3 | Oct7 22:30 / Oct8 00:30 Amsterdam (UTC+2) | Oct5 22:30 / Oct6 00:30 Amsterdam (UTC+2) |
| Amsterdam autumn DST | Oct25 10:00 / Oct25 11:00 Amsterdam (UTC+1) | Oct23 10:00 / Oct23 12:00 Amsterdam (UTC+2) |
| New York autumn DST | Nov1 16:00 / Nov1 11:00 New York (UTC−5) | Oct30 16:00 / Oct30 12:00 New York (UTC−4) |

The DST examples show why matching a local wall-clock time two dates earlier is not sufficient
evidence for the provider's asserted UTC rule. Do not cancel or reschedule T3 to test its late
boundary: its October7 00:30 and 23:30 Amsterdam reminder deliveries remain pending.

## Controlled acceptance cases to authorize separately

| Case | Required evidence | Financial/notification boundary |
| --- | --- | --- |
| Guest cancellation before C | Genuine attendee context, saved rule, authoritative S/C/cancellation timestamp, Canceled record, slot release, one full original-charge refund in Stripe and actual notices | Distinct paid record; proposed technical amount $0.50 USD payable to SOLAGREE, not authorization. User final payment/refund; exact attendee/host/refund notices approved first |
| Guest cancellation exactly C | Provider-supported deterministic test or authoritative calculation/log proves equality; full original refund once | A manual browser click at a displayed second cannot prove exact server equality. Hosted sandbox is unavailable; do not create/pay another record merely to claim equality from click timing |
| Guest cancellation after C | Genuine attendee context, authoritative after-C timestamp, cancellation outcome and Stripe evidence of no refund, correct late-policy display/notices | Distinct paid record; same separate approval/user-final financial rules. No active production appointment used as a test |
| Guest self-rescheduling blocked | Attendee context shows no self-service route; old URL and server enforcement checked within authorized access | A logged-in admin view or a hidden button alone does not prove attendee/server enforcement. No request/change/cancel submitted during read-only preparation |
| Original-organizer one manual change | Original host identity; eligible timing; same-host target; Paid and original charge retained; one linked replacement; old/new slots; actual Zoom time and native calendar update; correct change notices | New usable controlled record or later separately authorized existing case; never move protected T3 now. Final Terms accepted by user; no cancel/rebook, second charge or refund shortcut |
| Second/late request | Staff sees allowance already used or request late; no automatic extra complimentary change; approved response/decision recorded | Desktop decision simulation can use aliases without a live booking or send. Do not infer native enforcement: Cal.com has no one-change cap |

One canceled booking cannot exercise before/equal/after cases. A free booking does not accept refund
or paid-retention behavior. Earlier $0.50 tests do not authorize these new payments. Confirm exact
native availability and recipient list before asking for each concrete live scenario, then retain
final payment/refund for the user. Intent creation, a refund message or receipt-send row alone is
not successful-charge/refund settlement/inbox proof.

## Historical concrete G1 preparation — before later exact authorization

A distinct proposed **genuine-attendee early cancellation** can reuse hidden Stacie event **7357581**,
`initial-consults/test-stacie-payment-lifecycle-20261006`. Its technical title is
“TEST — Stacie payment lifecycle — no consultation”; historical R1/R1-R remain canceled/refunded.
No existing booking is reused, moved or canceled. No new event or saved setting was created/changed.

Independent saved preflight **October6 12:44:22 UTC**, Cal.com **6.9.12-h**: Hidden/off, 30 minutes,
sole Stacie/medium/Maximize, fixed/weights/future hosts OFF; Organizer's default app labelled Zoom;
Stripe Initial Consults/$0.50 USD/collect on booking/refund2 calendar days; attendee-only/Always
rescheduling disabled, same-host Always, cancellation allowed, reason mandatory for host only,
past/cancelled rebooking OFF; all eight event workflows OFF. **Existing range Oct8–Oct9**, notice2h,
pre0/post15, Always14 OFF, Save disabled. Actual default Zoom usability is not inferred from the label.
Root separately reads Email confirmation, required name/email/phone/State, optional Notes/SMS;
booking-form preview has one phone and unchecked optional SMS. This is saved/preview evidence,
not an actual submitted consent value or successful validation.

| Field | Proposed controlled G1 value |
| --- | --- |
| Start / end Amsterdam | October9 01:30–02:00 |
| Start / end UTC | October8 23:30–October9 00:00 |
| Start / end New York | October8 19:30–20:00 |
| Provider-asserted cutoff UTC / Amsterdam | October6 23:30 / October7 01:30 |
| Amount / payee | One new $0.50 USD payment to SOLAGREE |
| Role | Attendee in a clean browser context without Cal.com admin/organizer login |
| Notices | Exact controlled attendee/Stacie approval required for native pending-payment, confirmation, calendar, cancellation and refund-receipt messages; no additional guests |

Python `datetime`/`zoneinfo` independently validates these conversions. Root's public availability
read in Amsterdam/24h, with personal overlay OFF, rendered 01:30 enabled; no time was selected,
no hold created, no form entered. Overlay restored ON. A screenshot records price/title/date/time.
Availability must be freshly checked again after approval; the observed button is not a reservation.

After explicit exact-scenario/recipient approval, the user completes Terms and one final payment.
Reconcile the new UID/host/time with one successful original Stripe charge and one receipt before
any cancellation. If payment is ambiguous, stop and reconcile rather than creating/paying another
record. The user then opens the attendee confirmation/cancel link in the same clean context,
without signing into Cal.com as Jill/organizer, and performs final cancellation **before C**.
If the native form requests a manual organizer path, the genuine guest context cannot be established,
or C has passed, stop this early case; do not substitute an admin/late/equality cancellation.

The user performs any financial final action; no agent Cancel/Refund is authorized. A claimed native
refund message is not enough: inspect the original charge, one full $0.50 refund and its status in
Stripe. If automatic refund is absent, report it; do not manually create another refund. Verify
Canceled/slot release, old-link barrier, and actual attendee/host/calendar/refund notices within
the approval. User attestation of incognito/guest identity is recorded separately from directly
observed role evidence; a root admin view cannot prove the guest role. Retain timestamp brackets
with UTC clocks and authoritative native timestamps if exposed; do not relabel unlabelled times.

This proposal does not authorize a charge, booking, notice, cancellation, refund, retry or cleanup.
T3 and its reminders remain protected. Preserve the existing Oct8–Oct9 range and unrelated records;
any later closure/cleanup is separately scoped. It tests early guest cancellation only, not equality,
late refusal, DST, a new $60 payment or all anonymous/server bypass variants.

## Staff handling of the one complimentary change

Use the original consultant's authorized organizer account and an approved request channel.
Keep actual booking references, contacts, request times and operator identities in restricted
operations records; publish only test aliases and non-personal evidence.

1. Verify the original Paid booking/host, request eligibility, timing and zero completed free changes.
   Assign one operator to the request and record it as in progress before choosing a target.
   This is a manual coordination procedure, not an implemented atomic lock or concurrency guarantee.
2. Verify a same-host available target and that attendee self-service remains disabled. Record the
   old interval, original charge and intended target without cancelling/rebooking. For a test, obtain
   exact recipient/scenario approval before native change notices can be generated.
3. Submit one authorized change, then reconcile lineage, Paid/charge, slots, Zoom time, calendar
   update and notices. Stop if the provider requests payment, refund, cancellation or another host.
4. Mark the allowance used only when the linked change is confirmed. If the result is ambiguous,
   retain the in-progress claim and reconcile before retrying; if no change occurred, do not consume
   the allowance. Preserve the original booking and charge rather than making a speculative retry.
5. For a second/late request, route it to the approved human policy decision. Do not grant another
   free change, cancel/refund, charge again or send a response automatically. The production request
   channel/owner and shared allowance-record process still need operational sign-off.

| Alias | Request eligibility checked | Prior completed changes | Operator claim | Target/result | Allowance after reconciliation |
| --- | --- | --- | --- | --- | --- |
| New hypothetical request | Yes | 0 | One operator, in progress | Not submitted | 0 |
| Historical R1 → R1-R | Recorded controlled case | 0 | Jill-admin path | Same Stacie/Paid/linked replacement, original charge retained | 1; later separately canceled/refunded |
| Hypothetical second request | Must check | 1 | Human decision | No change submitted | 1 |

This is a blank-process/example sheet, not a deployed ledger or permission to change real records.

## Evidence requirements and release effect

For every actual case keep code/configuration evidence, live provider evidence, client-attested
receipt and remaining external action separate. Current saved settings do not accept boundary
refunds, second-request handling or real host calendar/Zoom updates. Financial identifiers and
meeting/payment tokens stay in restricted provider views.

See [manual-change result](initial-consult-manual-reschedule-2026-10-06.md),
[early refund result](initial-consult-cancellation-refund-2026-10-06.md),
[provider clarification](initial-consult-provider-clarification-2026-10-06.md) and
[coordinated release](initial-consult-release-runbook-2026-10-06.md).
Preparation does not authorize production activation, send the client draft or mark issues Done.
