# Initial Consult — one manual reschedule, October 6, 2026

Scope: HIR-249/HIR-250; controlled paid Stacie lifecycle record R1, hidden event 7357581.
This accepts the tested **Jill-admin path** within the stated bounds. Stacie's own-organizer
workflow, general concurrency safety and production launch are not accepted by this test.

## Authorization and preparation

The user explicitly approved this Jill-admin scenario and native change notices/calendar updates
to the specified controlled attendee and Stacie host. Former time: October 9 00:30–01:00
Europe/Amsterdam / October 8 22:30–23:00 UTC. New time: October 9 02:00–02:30 Amsterdam /
October 9 00:00–00:30 UTC / October 8 20:00–20:30 New York. No additional payment, refund or
cancellation was authorized. All eight event workflow associations were OFF; optional SMS
remained unchecked. Original T3 reminders and records were preserved.

Root opened the paid admin record's **Reschedule booking** and selected the approved time.
The form retained locked contacts, Florida, empty reason and unchecked SMS; final action was
Reschedule rather than Pay. Independent preparation review/QA checked candidate availability,
Attendee only/Always, same-host restrictions and workflow isolation. The user performed final
Reschedule because proceeding accepts Cal.com Terms, then reported **готово**. The agent did
not submit the change, accept Terms or perform a financial action.

## Actual service result

Independent Cal QA verifies replacement R1-R **Confirmed + Paid**, $0.50, same Stacie host and
approved new interval. Original R1 is **Rescheduled**, with the controlled Jill-admin actor;
History links its original date/record to the replacement. The success page links Original
booking and displays Rescheduled by. The replacement is observed reschedule lineage, not an
additional independent paid booking.

Independent financial review around **06:58 UTC**: Stripe still has **five records, four
Succeeded and one old Incomplete**. Original intent remains Succeeded, $0.50 USD, same visible
charge, original numeric booking metadata and one previously recorded receipt-send row.
No additional payment record or new charge/refund activity is visible. This accepts bounded
payment retention for the approved Jill-admin action, not other actors or general retry safety.

The current replacement has a Zoom link. Independent QA compared the selected new admin
dialog's Where/Join references with the pre-reschedule record snapshot: the full reference,
including password, is retained. The original now-Rescheduled dialog no longer exposes Zoom;
its absence does not override the pre-change comparison. Root's fresh canonical replacement
view and manual Google/Office/ICS export links carry the approved new UTC interval and retained
Zoom location. No Join/export action was used. Actual Zoom meeting start-time update, join
validity and native host-calendar write are not proved by these rendered references.

At **06:59:01 UTC**, independent public QA with overlay OFF found original UTC 22:30 and
following 23:00 available again; new UTC 00:00 and following 00:30 were absent. Only the two old
intervals were visible; adjacent UTC 23:30 was also absent. This does not isolate buffer causality
or establish every outside-hours boundary. Current logged-in guest view has Cancel and Report,
with no self-reschedule control. Anonymous/server bypass and old guest-URL enforcement remain
untested. Overlay restored ON; own research tabs closed/released.

Cal.com's success page says email/calendar invitations were sent. This is a provider claim;
actual change email delivery, existing calendar update, exact recipient/header/count and receipt
inbox delivery remain uninspected and unconfirmed for this case. Earlier T3 attestation does not
cover R1 or R1-R. Private record/payment/charge IDs, contacts, receipt URLs and meeting credentials
remain in provider views; shareable evidence uses aliases R1/R1-R.

## Complimentary-change ledger — controlled test only

| Alias | Former/new time, Amsterdam | Actor | Complimentary changes used | Financial result |
| --- | --- | --- | --- | --- |
| R1 → R1-R | October 9 00:30–01:00 → 02:00–02:30 | Jill admin, user final submission | 1 | Original $0.50 charge retained; no new charge/refund observed |

This records one controlled change. Cal.com does not enforce a one-change cap. Staff must track
the allowance per paid booking; second/late requests and the production ledger process remain
untested. No second change or cleanup was attempted.

## Acceptance matrix

| Scope | Verified by code | Confirmed in services | External action / remaining acceptance |
| --- | --- | --- | --- |
| Manual change | Reviewed copy directs requests to Solagree; no website reschedule engine | Approved Jill-admin action, R1-R same Stacie/new time/Paid and linked original | Own-Stacie workflow; anonymous/old guest-URL enforcement; second/late requests |
| Payment retention | Fixtures do not accept live payment behavior | Same original intent/charge; five-record ledger unchanged; replacement Paid; no extra charge/refund observed | General actor/retry/concurrency behavior; real refund boundaries |
| Slots/Zoom/calendar | Cal.com owns availability/conferencing/calendar | Old slot available, new excluded; retained Zoom reference; export links carry new time/Zoom | Zoom meeting-time update/join validity; native calendar destination/update |
| Notices/one-free rule | One manual complimentary request in reviewed copy | Provider says sent; one controlled change logged; workflows OFF/SMS unchecked | Actual change email/calendar/receipt inbox evidence; production allowance ledger |

No further payment, change, cancellation, refund, resend, production deployment or Done is
authorized by this completed scenario. See [recovery evidence](initial-consult-payment-lifecycle-preparation-2026-10-06.md)
and the [main matrix](initial-consult-acceptance-2026-10-05.md).
