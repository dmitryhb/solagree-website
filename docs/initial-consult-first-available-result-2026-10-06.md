# Initial Consult — First Available Phone result, October 6, 2026

Scope: HIR-246/HIR-250, hidden free event7360837; booking alias **FA1**.
This accepts one actual First Available allocation to Taj and Phone propagation within the stated
bounds. Paid round-robin, general fairness/concurrency and production activation are not accepted.

## Authorization and actual booking

The user explicitly approved the exact free test, attendee/contact data and potential Taj/Stacie/
James host notice recipients, then performed final Confirm and reported готово. No payment,
real call, SMS/reminders or cancellation was included. Root filled the approved form, left SMS
unchecked and handed off final Confirm/Terms acceptance. No booking or send was submitted by root.

Independent fresh native QA completed **07:57:32 UTC**: selected actual admin record **Confirmed**,
no Paid badge, matching technical First Available Phone title, assigned **Taj Chiu**. Canonical guest
page says This meeting is scheduled. Correct interval: October7 **23:00–23:30 UTC** = October8
**01:00–01:30 Europe/Amsterdam** = October7 **16:00–16:30 America/Los_Angeles**. Account admin
success UI displays October8 **00:00–00:30 British Summer Time**; this is the same instant.

Approved phone propagated into selected admin and guest Who/Where; State Florida retained.
No Zoom/Cal Video location. One required native phone input was filled before Confirm. Current
saved event payment OFF and all eight workflow associations OFF, Save disabled. Native confirmation
notices are distinct from workflows. One matching selected record is observed; exhaustive duplicate
booking-ledger reconciliation was not performed. Guest has Cancel but no self-reschedule control.
No cancellation, new call, export, resend or further booking was attempted.

## Availability across routes

With overlay OFF, new test First Available and production First Available both exclude booked
**UTC23:00**. Both retain the other eleven enabled starts on the Amsterdam October8 date.
Production Direct Choice Taj's date is now disabled, versus its previously enabled sole01:00 start.
This verifies booked-start exclusion across the tested routes after allocation to Taj.

The following **UTC23:30** remains available in both First Available unions. Stacie was independently
eligible at that start before this test, so another host can satisfy the union; this is not proof of
a Taj15-minute buffer failure. Taj's disabled whole date cannot isolate an adjacent interval or its
cause in that initial view. Later native Troubleshooter QA at **08:17:37 UTC** independently
identifies Taj's **01:00–01:30 Amsterdam Cal.com booking**, says it also appears on Google Calendar,
and explicitly isolates a **01:30–01:45 Booking buffer**. This accepts that fifteen-minute post
buffer within provider-UI scope, while title Busy/no booking-ID bridge limits exact event mapping.
Broad external busy-calendar conflicts, race/concurrency safety and allocation fairness are unaccepted. QA restored overlays ON, timezone unchanged, own research tab closed; other records intact.

## Phone calendar and delivery evidence

Google/Office/Outlook manual-export links carry the correct UTC interval but no location parameter.
Inline ICS carries DTSTART at UTC23:00 and30-minute duration, without LOCATION. No export was used.
This corroborates the earlier James Phone manual-export limitation on another host/First Available;
it does not prove the delivered invitation or native write pipeline has the same omission.

The user explicitly confirms for **this FA1 case**: confirmation email received by the controlled
attendee, event present in the attendee calendar and phone present in the invitation/calendar record.
This is client-attested and separate from native provider inspection. Actual attachment/header/count,
exact phone field mapping and direct host destination/event-ID inspection remain uninspected.
Later Troubleshooter inspection asserts matching-interval Google Calendar presence; it does not
expose a FA1 ID bridge or replace direct Google inspection. Earlier T3,
R1/R1-R or James attestations are not extended to other cases.

## Financial safeguard and current refund label

Fresh independent Stripe SOLAGREE All review around **07:57 UTC** shows the same five original
payment records, no new FA1 payment record. Current list labels: **three Succeeded, one Reversed,
one old Incomplete**. Reversed belongs to the original R1 payment and supersedes its earlier
Refunded UI label. It is not a PaymentIntent API-status claim or bank-credit confirmation.
The initial updated-refund-object gap was resolved by fresh independent review at **08:11 UTC**
in the user-mapped profile jill: same original refund object, amount50/usd/status succeeded,
original charge/intent associations and card destination type **reversal**. One refund request
and one created/updated pair are visible; no second object is evident. No financial or receipt
action was performed. Bank/card credit and a paid FA lifecycle remain unaccepted. See the
[provider clarification](initial-consult-provider-clarification-2026-10-06.md) for precise bounds.

## Acceptance matrix

| Scope | Verified by code | Confirmed in services / client-attested | External action / remaining acceptance |
| --- | --- | --- | --- |
| First Available allocation | Existing reviewed route/method source; no new source diff | One actual Confirmed Taj booking at approved UTC interval | Fairness/concurrency, broader hosts/dates, paid allocation lifecycle |
| Phone/form | Existing separate-method gates retained | One required phone filled; phone/Florida propagated; no video; payment/eight workflows OFF | Broader validation and paid Phone lifecycle |
| Availability | Cal.com owns scheduling | Booked start excluded from test/production FA; direct Taj date disabled; native Troubleshooter isolates 15-minute post buffer | Arbitrary external calendar conflicts |
| Email/calendar | Website does not send invitations or write native calendars | FA1 attendee email/calendar/phone client-attested; native UI asserts matching Google presence | Direct invitation/header/count/Google destination/event bridge; known manual export omission |
| Financial safeguard | No custom payment engine | Same five records/no new FA1 payment; R1 UI Reversed; updated refund object succeeded/reversal | Bank credit; paid round-robin |

Private contacts, booking/payment/refund IDs and invitation links remain only in provider views/
approval context. Shareable evidence uses FA1 and R1 aliases. See [preparation](initial-consult-first-available-preparation-2026-10-06.md),
[displayed availability union](initial-consult-method-routing-2026-10-05.md) and [main matrix](initial-consult-acceptance-2026-10-05.md).
No further change, cancellation, send, charge/refund, production deployment or Done is authorized.
HIR-609 remains the consultant-publication dependency.
