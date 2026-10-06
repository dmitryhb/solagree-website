# Initial Consult — unpaid expiry observation, October 6, 2026

HIR-248/HIR-249/HIR-250; HIR-246 and HIR-609 dependencies retained.
This is the actual controlled **R2** case following the reviewed
[closed preparation](initial-consult-unpaid-expiry-preparation-2026-10-06.md).
Controlled observation completed: approved starts returned by the +31-minute check, while the
same booking remained Pending and original Stripe intent remained Incomplete after at least fifty
minutes. No checkout reopening, payment or manual cancellation occurred. Automatic cancellation
was not observed within this window; the account’s internal cleanup flag remains unverified.

## Authorization and user handoff

The user explicitly approved one Stacie unpaid test on hidden event 7361999, October 10
18:00–18:30 Amsterdam / 16:00–16:30 UTC / 12:00–12:30 New York. Authorization identifies the
controlled attendee and Stacie organizer, previously supplied phone and Florida, unchecked SMS,
disabled reminders, and possible native pending-payment/host/automatic-cancellation notices.
No card, final Stripe Pay, manual cancellation, refund, recovery, resend or additional booking
is included. Configured checkout amount is $0.50 USD payable to SOLAGREE; expected spend is $0.
Private contacts and payment/booking identifiers remain outside repository evidence.

Root opened only this hidden event to October 10–10, verified Save disabled and approved slot
available, selected it and filled approved values. Public form has exactly one required phone,
required email and unchecked optional SMS at handoff. The submitted consent value is not rendered
in the selected native record; it is not inferred from the prepared default or absence of a field.
User alone performed Terms/Pay-to-book and reported
completion after instructions to close checkout without card entry or final payment. Agent never
submitted that button. After submission, no guest/payment/checkout page was opened by agents.

## Baseline and timing limits

Native admin: one matching **Pending / Unconfirmed**, sole Stacie, correct October 10 interval,
$0.50, Florida and submitted phone. Where says conferencing details follow confirmation email;
no usable Zoom/Cal Video link is rendered. History shows only Booked, source WEBAPP, event 7361999.
Displayed booking timestamp is **2026-10-06 11:15:28**, without a timezone label.

Stripe: one new **Incomplete $0.50 USD** intent; Payment method Missing/None; one creation event
and successful intent-create log, no visible successful-payment/charge event. Metadata joins the
numeric booking, exact new event title and Stacie account to the selected intent. All list grows
from five to six records: three Succeeded, one Reversed, two Incomplete; no duplicate evident in
this bounded list. Displayed creation time **05:15:28** has an unverified dashboard timezone.
“Charged to” is a generic customer header, not evidence of a charge on an Incomplete intent.

**09:15:28 UTC is provisional**, consistent with the two display times, not independently verified
from an epoch or labelled timezone. Initial conservative creation bracket was 09:15:01–09:19:32 UTC. A focused browser-history read
then returned the exact R2 Payment page title visited at **09:15:29.452 UTC**. No URL or secret was
printed and the page was not reopened. This narrows the creation bracket to after root’s
**09:15:01 UTC** final-form clock (button unsubmitted) and no later than that checkout visit.
The history timestamp is a page-visit time, not an exact booking-created epoch. Final observation
at or after **10:05:30 UTC** guarantees at least fifty elapsed minutes within this narrower bracket;
observation times are recorded directly in UTC.

Independent Sol medium baseline QA at **09:19:32 UTC**: matching Pending record/time/host, no usable
conference link; public October 10 Amsterdam with overlay OFF has only **19:00 and 19:30** enabled.
Approved **18:00** and subsequent **18:30** starts are absent. Overlay restored; no times selected,
holds created or settings/actions submitted. Independent Sol high review confirms timing conversion
and evidence boundaries, without an expiry verdict. Both returned no reusable memory candidates.

Independent Stripe QA at **09:21:55 UTC** confirms the selected Incomplete/missing-method result,
matching metadata, one creation event and the six-record All list with no duplicate evident.
No raw event payload or financial action was opened. Creation display timezone remains unknown.

Root encountered a connection error while trying to inspect Stripe’s creation-event timestamp.
Payment detail remains readable; the raw event timestamp/payload was not obtained. No client secret
was printed, no API command executed, and no payment attempt was made.

Independent native Troubleshooter check at **09:38:17 UTC** selected this exact event, Stacie,
October 10 and Amsterdam. Only 19:00/19:30 were available; 18:00/18:30 were absent without an
unavailability-details control. Block provenance (reservation / Cal booking / Google presence),
explicit 18:30–18:45 buffer, expiry marker and creation timezone remain **UNKNOWN**. Absence of
starts alone does not isolate the buffer or assert a host-calendar write. No booking time selected.

## Native email attestation

For this exact R2 case, the user explicitly confirms receipt of the Cal.com awaiting-payment /
completion email at the controlled attendee and says its link was not opened. This is client-attested
receipt only, not independent content/header/count inspection or host/automatic-cancellation
notification evidence. It does not prove a usable confirmed booking or charge.

## Provider branch remains unresolved

A later read of the existing support conversation finds no new clarification: the same answer
contains both OFF and ON alternatives. It describes ON as cleanup every ten minutes, canceling an
expired unpaid booking about ten minutes after the thirty-minute hold, with standard cancellation
emails. This is a conditional provider assertion, not the selected account’s flag or observed job.
No new support message was sent. A Pending result after fifty minutes could be consistent with OFF
or a failed/delayed ON cleanup; it cannot identify the internal flag by itself.

## Observed release — not booking cancellation

At the planned +31-minute check, **18:00 and 18:30 Amsterdam returned**, together with unchanged
19:00/19:30. Calendar overlay was OFF for the final comparison; no time was clicked. The same
native record remains Pending with only Booked history; the same original Stripe intent remains
Incomplete / missing method / one creation event. Checkout stayed closed. Thus release has been
observed independently of payment or manual cancellation. Final observation found no automatic cleanup/status transition within at least fifty elapsed
minutes. No internal flag or exact thirty-minute TTL is proved. Release is bounded between the
blocked check ending 09:43:08 and restored check 09:46:35–09:47:01; no exact release instant is known.

## Completed timed observation log

| Observed UTC | Timing basis | Native booking | Public starts / buffer | Stripe |
| --- | --- | --- | --- | --- |
| 09:19:32 | Independent baseline; provisional T0 + 4m04s | Pending / Unconfirmed, Stacie, no usable conference link | 18:00 and 18:30 Amsterdam absent; 19:00/19:30 enabled, overlay OFF | Root detail: Incomplete / missing method, metadata association; independently verified at 09:21:55 |
| Check ended 09:43:08 | Planned +27-minute check; provisional T0 +27m40s at end | Pending; history only Booked | 18:00 and 18:30 still absent; 19:00/19:30 enabled; overlay OFF after reload reset it ON | Same original Incomplete / missing method; one creation event only |
| 09:46:35–09:47:01 | Planned +31-minute check; provisional T0 +31m07s to 31m33s | Same Pending; history only Booked | 18:00/18:30 returned; all four starts enabled; overlay OFF | Same original Incomplete / missing method / one creation event |
| 09:56:36–09:57:02 | Planned +41-minute check; provisional T0 +41m08s at start | Same Pending; history only Booked, no cancellation | All four starts enabled; overlay OFF | Same Incomplete / missing method / one creation event |
| 10:05:43–10:06:28 | Final check starts more than fifty minutes after the latest possible creation within the narrowed bracket | Same Pending; history only Booked, no cancellation | All four starts enabled; overlay OFF | Same original Incomplete / missing method / one creation event |

Checks around provisional T0 + 27, 31, 41 and 50 minutes are complete. Final check starts after
the narrowed conservative bracket’s fifty-minute upper bound. Checkout was never reopened. Release, booking cancellation and native email delivery are distinct
results; no internal cleanup flag is inferred from a bounded Pending result. Manual cleanup and
old unpaid link actions require their own authorization after this case.

## Independent final native QA and preservation

Independent Sol medium actual snapshot at **10:08:11 UTC** confirms R2 Pending / Unconfirmed,
sole Stacie, the original October 10 16:00–16:30 UTC interval and $0.50, no conference link,
and Booked-only history. Public Amsterdam with overlay OFF has all four starts enabled:
18:00, 18:30, 19:00 and 19:30. Same original Stripe intent is Incomplete / Missing and None,
with one creation event and no success/charge event shown; metadata matches the expected numeric
booking, exact R2 title and Stacie. The subsequent fresh All list remains six records,
three Succeeded / one Reversed / two Incomplete, with one R2 row and no duplicate evident.

Fresh preservation checks pass: T3 is Confirmed/Paid/Stacie at its original October 7
22:30–23:00 UTC interval. New R2 event remains Hidden, October 10–10 range, all eight workflows OFF.
Production 24h/1h email workflows each retain original five plus four closed Phone counterparts;
controlled 24h/1h workflows each retain only the original payment-check event; all four SMS
workflows retain No active links. QA restored calendar overlay and closed its research tabs.
No guest/checkout reopening, time selection/holds, write, send, cancellation or financial action.
No reusable memory candidates.

The new R2 test window remains open and Hidden; record cancellation, old-link actions and restoring
its closed window remain separate controlled cleanup work. Preservation does not accept future
reminder delivery, native expired-link behavior or an internal cleanup flag.

## Narrow Cal.com follow-up — approved and sent

Recipient: Milos in the existing Cal.com support conversation (ticket 215476247361743).
After viewing the exact draft, the user explicitly instructed sending it. The agent sent it once;
by **10:30:36 UTC / 12:30:36 Amsterdam** on October 6, fresh UI showed the complete outbound article,
Just now / Not seen yet, and an empty composer with Send disabled. This confirms submission,
not that support has read or answered it. It supersedes this section's earlier unsent snapshot.
It contains no attendee contact, booking token,
payment identifier, card data or secret. No configuration change is requested.

> Thank you for clarifying native SMS for required-email bookings.
>
> We completed a controlled no-card test on hidden event 7361999 with Stacie. Checkout was closed
> without payment and never reopened. The approved starts were still unavailable at our +27-minute
> check and returned by the +31-minute check. The same booking remained Pending / Unconfirmed,
> with only Booked history, after at least fifty elapsed minutes; Stripe remained Incomplete with
> no payment method.
>
> Your reply still includes both “Flag OFF” and “Flag ON” alternatives. Please confirm one current
> branch for this event and its organizer/team, including the flag name and scope. Is Pending after
> fifty minutes the expected configuration or a cleanup failure? We are requesting clarification
> of the current configuration only.

Manual cancellation/link invalidation and test-window restoration remain separate from this
clarification request. R2 is retained Pending and Hidden with its October 10 window; no cleanup
notification or guest-link/recovery action has been authorized or executed by the agent.

## Acceptance matrix

| Scope | Verified by code | Confirmed in services | Requires external action |
| --- | --- | --- | --- |
| Public form | Existing reviewed separate-method source retained | R2 one required phone/email; optional SMS unchecked; user final button | Actual server rejection of blank phone is not inferred |
| Initial unpaid state | Native checkout delegated | Pending/Unconfirmed; no usable conference link; Incomplete/missing method; selected metadata association | Hold release observed without payment/reopening; no automatic cancellation observed after at least fifty minutes. Internal flag, future behavior and expired-link/collision/decline cases remain open |
| Native emails / SMS | No new sender implementation | Required-email native-SMS exclusion is provider-asserted; eight workflows OFF | R2 awaiting-payment email client-attested received / link not opened; content/count/header/host and automatic-cancellation notices remain uninspected; SMS absence is not inferred |
| Other records / release | Existing source and HIR-609 retained | Independent final native QA preserves Confirmed/Paid T3 and exact production/test/SMS workflow scopes; R2 Hidden / eight workflows OFF | James Zoom, T3 reminders, separately approved R2 cleanup and separately authorized production activation remain open |

No new payment, refund, manual cancellation, recovery, resend, production deployment or Done.
