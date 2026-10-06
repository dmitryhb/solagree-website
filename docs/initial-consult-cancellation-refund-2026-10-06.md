# Initial Consult — early admin cancellation and full refund, October 6, 2026

Scope: HIR-248/HIR-249/HIR-250; hidden Stacie event 7357581, rescheduled replacement R1-R.
This is one approved **Jill-admin early cancellation**. It does not accept customer cutoff
enforcement, equality/DST boundaries, bank settlement or production launch.

## Authorization and baseline

The user explicitly approved cancellation of R1-R, expected full $0.50 USD from SOLAGREE back
to the original payment method, native cancellation/calendar notices to the specified controlled
attendee/Stacie host and refund receipt to the attendee. No additional payment or other-record
cleanup was included. The user performed final **Cancel event**, then reported **готово**.
Root prepared only the reason: Technical acceptance test: early cancellation of rescheduled booking.
No cancellation, refund or message send was performed by the agent.

Approved appointment: October 9 02:00–02:30 Amsterdam / October 9 00:00–00:30 UTC /
October 8 20:00–20:30 New York. Independent preparation QA verified Confirmed/Paid/$0.50,
saved Stripe/ON_BOOKING/USD0.50 and **If cancelled 2 calendar days before**, cancellation allowed,
reason-required setting ON, past/cancelled rebooking OFF, all eight event workflow associations OFF.
The admin dialog called its reason optional; this does not accept customer reason validation.
SMS remained unchecked. Original T3 and its future reminders were preserved.

The action occurred on October 6, before support's asserted October 7 00:00 UTC cutoff.
The support assertion is not an independently exercised boundary. Admin cancellation may
have different cutoff behavior from a customer; this early case cannot establish that difference.

## Actual Stripe refund — independently verified

Fresh financial review around **07:19 UTC** found **five payment records: three Succeeded,
one Refunded and one old Incomplete**. The original payment displays Refunded, $0.50 paid and
$0.50 refunded. The refund-created object has amount **50**, currency **usd**, status
**succeeded**, and references the exact original charge/intent. The charge-refunded event has
**amount_refunded: 50** and **refunded: true**.

One refund object and one refund request are visible. No additional charge/payment record
appeared. This verifies one full refund of the original payment, rather than relying on Cal.com's
refund message. PaymentIntent API status was not independently inspected; the payment-list
Refunded badge is not a claim that a PaymentIntent's API status becomes refunded.

Receipt history shows one Payment and one Refund sent row to the approved attendee. Recorded
sending is verified; inbox delivery and actual bank/card credit remain unconfirmed. No manual
Stripe Refund, second refund, receipt send/resend or financial action was performed by the agent.

## Actual Cal.com result — independently verified

Selected replacement R1-R is **Canceled**, with the controlled Jill actor and prepared reason.
History records Cancelled / Source WEBAPP and the prior reschedule lineage. Its displayed
October 6 09:17:06 timestamp has an unverified UI timezone. Same Stacie/new interval retained.
The historical Paid badge remains, alongside **This booking payment has been refunded**;
the independent Stripe objects above establish the financial result.

At **07:18:40 UTC**, public QA with calendar overlay OFF found canceled UTC 00:00 and following
00:30 enabled again. Original UTC 22:30 and following 23:00, plus adjacent 23:30, are also enabled.
This verifies current availability restoration; arbitrary external busy conflicts and other
boundary cases remain outside this observation. Overlay restored ON; own research tabs closed.

The current **logged-in Jill** guest page says **This event is canceled**, exposes no Zoom link
and retains only Report booking. No active Cancel/Reschedule/Pay control was observed. Its browser
document title still incorrectly says **Your booking has been confirmed | Cal.com**. This is an
open hosted-provider title finding, not evidence of an active booking. The admin card retains a
Zoom reference; no Join was used. Actual provider meeting deletion/join invalidation and native
calendar removal were not inspected. Anonymous/server-side enforcement was not exercised.

Native cancellation/calendar email and refund receipt inbox delivery are unconfirmed for this
case. Earlier R1/R1-R change-delivery evidence was also unconfirmed before cancellation; this
financial authorization does not attest those previous deliveries. Earlier T3 confirmation/calendar
attestation is not extended to R1. Private contacts, record/payment/refund IDs and meeting credentials
are confined to provider views; shareable evidence uses aliases R1 and R1-R.

## Acceptance matrix

| Scope | Verified by code | Confirmed in services | External action / remaining acceptance |
| --- | --- | --- | --- |
| Cancellation/refund policy | Reviewed copy says two calendar days; no website refund engine | Saved rule; approved early Jill-admin user cancellation, Canceled record | Customer cutoff/before-equal-after/DST behavior and own-organizer path |
| Actual refund | Fixtures do not prove financial outcomes | One full $0.50 refund object, succeeded, original charge/intent associations; no duplicate visible | Actual bank/card credit; general refund/concurrency behavior |
| Booking/slot/Zoom | Cal.com owns native lifecycle | Canceled lineage; slot restored; logged-in guest canceled/no Zoom/active controls | Provider title correction; anonymous enforcement; actual Zoom deletion and native calendar removal |
| Notices | No website-generated receipt | Stripe one Payment and one Refund sent row; scenario notifications authorized | Cancellation/calendar/refund receipt inbox details/count/header and delivery |

No further charge, refund, cancellation, change, resend, production deployment or Done is
authorized by this completed scenario. The controlled ledger still records one complimentary
change, followed by this separately approved cancellation/full refund. See [manual change](initial-consult-manual-reschedule-2026-10-06.md),
[payment recovery](initial-consult-payment-lifecycle-preparation-2026-10-06.md) and the [main matrix](initial-consult-acceptance-2026-10-05.md).
