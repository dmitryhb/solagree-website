# Initial Consult — unpaid expiry preparation, October 6, 2026

HIR-248/HIR-249/HIR-250, with HIR-246 and HIR-609 dependencies retained.

This is the historical closed-preparation snapshot. Later exact user approval, window opening,
user checkout handoff and actual observations are recorded in the
[R2 result](initial-consult-unpaid-expiry-result-2026-10-06.md), which supersedes pending-approval
statements here while preserving the preparation evidence and limits.

At this snapshot, only isolated event preparation was authorized. No booking, PaymentIntent, card entry,
charge, refund, cancellation or customer message has been created by this preparation.

## New isolated event

Event **7361999**, path `initial-consults/test-stacie-unpaid-expiry-20261006`, title
**TEST — Stacie unpaid expiry — do not pay**, was duplicated from hidden lifecycle event 7357581.
Root changed only the new description and date range. Clone initially inherited the source's
October 8–9 window, then was immediately saved closed at **September 16–16, 2026**, retaining Hidden.
The inherited future window was transient; no slot, form or booking was submitted.
Source R1/R1-R, paid T3, free James and FA1 records remain separate and preserved.

Saved description explicitly says NO PAYMENT: native checkout remains configured at **$0.50 USD
payable to SOLAGREE**, but this scenario will not enter a card or complete final Stripe Pay.
There is no consultation or live call. The user may open checkout only after exact scenario/
recipient approval, then leave it without paying. All eight new-event workflows show OFF.
Independent saved-state review and QA passed within the preparation limits below.

## Proposed controlled scenario — not authorized or submitted

Proposed appointment: **October 10 18:00–18:30 Europe/Amsterdam = 16:00–16:30 UTC =
12:00–12:30 America/New_York**, sole Stacie host. Independent QA found this candidate enabled on the original Stacie route, with calendar overlay
OFF. Availability must be rechecked before opening this new event's window. Hidden does not restrict access by itself; the closed date range currently
prevents booking. Only after approval may its date range be opened for the controlled case.

The approval request identifies the controlled attendee and Stacie host, reuse of approved phone/
Florida and optional SMS left unchecked. Potential native messages include awaiting payment,
host notifications and **automatic cancellation emails if cleanup runs**. No manual cancellation,
receipt send/resend, further booking or payment is included. Per the later Cal.com support answer,
required-email links do not send built-in SMS; workflows remain disabled. This is provider-asserted,
not a direct no-SMS-delivery guarantee. Private contacts stay in approval/provider context.

1. After exact approval, recheck saved configuration and candidate availability, open the isolated
   window and prepare the form. The user performs the Terms/Pay-to-book step to open checkout.
   They close it without entering a card or clicking final Stripe Pay. **Expected spend $0**;
   configured payable amount is $0.50 to SOLAGREE only if paid, which this scenario excludes.
2. Capture actual booking-created UTC timestamp as T0, selected record/host/amount/status and
   original Stripe intent association. Verify Incomplete/no method/no charge in the actual account.
   Retain aliases in shareable evidence; no client secret or checkout URL enters repository docs.
3. Observe public start/post-buffer availability and selected pending-record status after creation
   and around T0+27, +31, +41 and +50 minutes. Record actual observation times rather than claiming
   exact expiry from a broad gap. Do not click times/create holds or reopen checkout before the
   final status/availability observations; prior recovery-page reopening complicated R1 causality.
4. Inspect received native awaiting-payment email and any automatic cancellation notices only
   within the approved recipients/scenario. Workflow reminders remain OFF. No scheduled queue/log
   or inbox delivery is inferred from saved settings.
5. At the final observation, compare selected Pending/Canceled status and native activity source,
   availability release and unchanged original intent/no charge. Pending at fifty minutes is a
   bounded observation consistent with the OFF branch, not proof of an internal feature-flag value.
   If automatically canceled, capture its lineage/notice/link behavior without further action.
6. Leave manual unpaid cancellation/link invalidation and cleanup to a separate exact approval.
   No Pay/recovery, refund, new booking, cancellation or resend follows from this test approval.

## Independent preparation verification

Independent Sol high review **PASS at 09:08 UTC** and Sol medium provider QA
**PASS at 09:06:20 UTC** independently read the saved preparation:

- Hidden, closed September 16–16; the public route says bookings stopped September 16.
- Thirty minutes, Stacie only, medium priority / Maximize availability, Stacie’s default hours;
  organizer default app labelled Zoom. This is configuration, not actual Zoom creation proof.
- Stripe Initial Consults, $0.50 USD collect-on-booking and refund setting two calendar days;
  two-hour notice, zero pre-buffer and fifteen-minute post-buffer.
- Email confirmation; Name, Email, universal Phone and State required; Notes and custom SMS
  optional. Saved form preview shows SMS unchecked. Actual public phone count/validation/default
  remains unverified because the route is closed and no slot/form was opened.
- All eight workflows OFF; Save disabled. Attendee-only Always reschedule restriction and same
  host Always; cancellation available; mandatory reason for host only; past rescheduling and
  rebooking from canceled links OFF.

QA’s fresh preservation check: production 24h/1h email workflows each still have nine links;
controlled reminder workflows each still have only the original payment-check event; all four
SMS workflows have no active links. T3 remains Confirmed/Paid with Stacie at its original time.
Root also verified the closed public route after a navigation timeout: every October day disabled.
No duplicate event was created to recover from that timeout. Local privacy-safe proof:
`test-results/cal-support-2026-10-06/unpaid-expiry-closed.jpg` (not a tracked artifact).

These are preparation results. They do not authorize an actual booking, establish expiry behavior,
prove inbox delivery or replace a post-approval public form check. Both agents returned no reusable
memory candidates; neither made provider changes, selected a time or submitted a booking.

## Existing-test checks and limits

Independent review around **08:56 UTC** found T3 still scheduled/$0.50/Stacie. Its Cancel control
is a plain button with no observed href/review-dialog marker; no safe review URL was available.
Reviewer did not click it. Late cancellation/refund UI and reason validation therefore remain
unaccepted. T3 stays intact for reminders; no financial or lifecycle action was attempted.

Independent reminder-readiness QA at **08:58:31 UTC** found no scheduled-run queue/execution log
in the bounded native booking/history/reminder-editor surfaces. T3 remains Confirmed/Paid;
history shows Booked/Stripe Accepted, no reminder-run entries. Editors show 24h/1h attendee-email
triggers and Active on 1 link, which establishes configuration only. Actual delivery remains future:
**October 7 00:30 and 23:30 Amsterdam** (October 6 22:30 / October 7 21:30 UTC).

## Acceptance matrix

| Scope | Verified by code | Confirmed in services | Requires external action |
| --- | --- | --- | --- |
| New hidden preparation | No website checkout engine | Independent saved-state review and QA PASS; Hidden/closed public route; clear no-payment copy; eight workflows OFF; other events preserved | Exact recipients/scenario approval before any booking; recheck opened form and availability after approval |
| Unpaid expiry | Cal.com owns native hold/cleanup | R1 prior bounded release/recovery; provider asserts a 30-minute hold but two branches remain | Actual approved no-card case and timed observations; internal flag still requires unambiguous provider confirmation |
| Native SMS | Optional consent retained | Provider says required-email links do not send native SMS; SMS workflows OFF | Direct absence/delivery not inferred; future opt-in workflow mapping separate |
| T3 reminders/policy | Existing reviewed policy/source retained | Confirmed/Paid preserved; reminder configurations visible; no queue exposed; cancellation control not clicked | Actual reminder delivery; separately approved policy lifecycle and cleanup |

No new payment, refund, cancellation, production deployment or Done is authorized.
