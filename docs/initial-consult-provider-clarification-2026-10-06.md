# Initial Consult — provider clarification, October 6, 2026

Scope: HIR-246/HIR-248/HIR-249/HIR-250; HIR-609 remains the publication dependency.
Read-only service evidence, provider assertions and remaining acceptance are distinguished below.
The investigation performed no new booking, setting change, charge, refund or cancellation.
The separately approved revised support follow-up was sent once at approximately08:28 UTC,
as recorded below; customer test messages were not submitted.

## Current Stripe refund evidence — independent review, 08:11 UTC

The user resolved the requested browser-session mapping to the exposed Chrome profile **jill**.
The original R1 payment currently displays **Reversed**, with **$0.50 paid / $0.50 refunded**.
Fresh inspection of the visible `refund.updated` snapshot confirms the same refund object as
`refund.created`: amount **50**, currency **usd**, status **succeeded**, exact original charge/
PaymentIntent associations and `destination_details.card.type: reversal`. One refund request
and one created/updated pair are visible; no second refund object is evident.
The updated event displays October 6 03:19:12 AM, with an unverified UI timezone.

This resolves the uninspected-updated-object blocker in the earlier FA1 snapshot. It supports
one successful full refund/reversal; it does not prove bank/card credit or a PaymentIntent API
status. The earlier All-list check at 07:57 UTC remains five original records: three Succeeded,
one Reversed and one old Incomplete, with no new free FA1 payment. See the
[cancellation/refund result](initial-consult-cancellation-refund-2026-10-06.md).

## Cal.com support answer — read at approximately 08:12 UTC

Milos replied in existing ticket 215476247361743. The following are **provider assertions**,
not independently exercised timing, cleanup or late-payment acceptance:

- Unpaid native ON_BOOKING slot hold is 30 minutes, including buffers, starting when the attendee
  submits the booking form and the booking is created. The payment page shows a countdown.
- The reply includes two unresolved template branches. **Flag OFF:** expired unpaid records
  remain Unconfirmed/Pending until paid/canceled. **Flag ON:** cleanup runs every ten minutes
  and cancels expired unpaid records within about ten minutes after the 30-minute hold.
  The actual tenant flag, name and scope are not identified.
- After expiry, availability is released while the Stripe intent remains Incomplete. The payment
  link can still work until cancellation; payment can proceed if the slot is free. Support asserts
  automatic refund if a later payment collides with another booking. Neither late collision nor
  automatic collision refund was tested.
- Awaiting-payment email is a standard native notification, separate from workflows, sent around
  fifteen minutes after an unpaid booking unless already paid. Support says an SMS version may
  also be sent when a phone number was collected; its consent predicate is not specified.
- Supported manual unpaid cleanup is Bookings → Unconfirmed → Cancel: immediate release,
  old link showing canceled, Stripe intent still Incomplete, no refund because unpaid. Support
  says cancellation emails go to attendee/host/other hosts, and mentions SMS for attendees who
  supplied a phone number. No unpaid cancellation/link-invalidation test was performed.

Observed R1 exclusion at 27m38s and availability at 47m52s are consistent with a 30-minute hold,
but do not independently establish its exact boundary or cause. R1 remained Pending before the
user paid. This does not resolve which template branch applies. The received native payment email
is client-attested; its recovery link is not, and actual checkout recovery used browser history.
The already completed paid R1-R cancellation cannot substitute for an unpaid-cleanup test.

## Native SMS scope — independent read-only investigation, 08:12–08:15 UTC

Organization General exposes **Disable SMS notifications for phone-only booking links**, currently
OFF. Its description explicitly scopes it to links requiring phone numbers with **email optional**
for booking confirmations. Organization Guest notifications exposes email controls only: all booking
emails remain enabled, including Awaiting payment and Cancellation. No setting was changed.

Both free FA1 event7360837 and paid lifecycle event7357581 retain **Email confirmation selected**,
required email and optional unchecked custom `smsConsent`. A Phone meeting location and a Phone
confirmation channel are separate settings. Inactive SMS workflow associations establish only
workflow isolation; they do not establish suppression of all native SMS paths. No unwanted SMS
was proved by this investigation. Whether the native sender uses the custom consent checkbox for
these Email-confirmation links remains unknown.

Billing labels show Monthly credits 7,000; Credits used 0; Total remaining 7,000; Additional credits
Current balance 0. No explicit period appears beside those counters. Zero use does not establish
zero SMS: official documentation describes paths without deductions from these credits.
See [messaging credits](https://cal.com/help/billing-and-usage/messaging-credits) and
[Phone confirmation configuration](https://cal.com/help/event-types/create-phone-only-event-type).
Keep email confirmations enabled; do not use email suppression as an SMS workaround.

## Taj calendar and buffer — independent native QA, 08:17:37 UTC

Cal.com's native Troubleshooter was reached through the actual Initial Consult — Taj Chiu event
settings, with Taj selected and Europe/Amsterdam October 8. At **01:00**, Why unavailable explicitly
identifies a **Cal.com booking** named Busy at **01:00–01:30** and says it **also appears on Google
Calendar**. At **01:30**, the separate **Booking buffer** reason says **01:30–01:45** is blocked.
This isolates the configured fifteen-minute post buffer in Taj's provider UI. The First Available
union can still offer 01:30 through another eligible host.

This is matching-interval provider evidence of calendar presence, not direct Google inspection:
title is masked Busy and no FA1 booking-ID bridge, Google event ID, owner/destination or phone
mapping is exposed. Arbitrary external busy-event conflicts remain untested. No impersonation,
new holds, bookings, calendar edits or setting changes were needed. See the
[actual FA1 result](initial-consult-first-available-result-2026-10-06.md).

## Additional host diagnostics — independent QA, 08:33:52 UTC

Using each actual Direct Choice event's native Troubleshooter and selected host:

- **Stacie / T3:** Europe/Amsterdam October8 **00:30–01:00**, corresponding to October7
  **22:30–23:00 UTC**. Why unavailable explicitly identifies a Cal.com booking masked Busy
  and says it **also appears on Google Calendar**. Separate Booking buffer blocks
  **01:00–01:15 Amsterdam / 23:00–23:15 UTC**. Matching-interval provider calendar-presence
  evidence and isolated fifteen-minute post buffer are accepted within UI scope.
- **James / J2 Phone:** Europe/Amsterdam October6 **21:00–21:30**, corresponding to
  **19:00–19:30 UTC**. Why unavailable identifies the Cal.com booking masked Busy, but does
  **not** say it also appears on Google Calendar. Separate Booking buffer explicitly blocks
  **21:30–21:45 Amsterdam / 19:30–19:45 UTC**. The matching booking and isolated fifteen-minute
  post buffer are accepted; actual J2 Google Calendar presence remains unknown. A separate
  Google busy reason identifies another overlapping busy interval at candidate21:30. This is
  bounded native-UI external-calendar conflict evidence, alongside the separate booking buffer;
  it cannot establish J2's calendar write or a controlled external-calendar test.

Neither surface exposes a booking-ID bridge, Google owner/destination/event-ID or phone mapping.
These reads do not accept direct Google write/content or deliberately injected external conflict
cases. Existing tests, reminders and appointments remained intact. No impersonation, settings,
new slots/holds/bookings, calendar edits, sends, financial or OAuth actions were performed.
Own diagnostic tab closed; reusable memory none. See the
[James Phone result](initial-consult-phone-booking-2026-10-05.md).

## Acceptance matrix

| Scope | Verified by code | Confirmed in services / client-attested | Requires external action or evidence |
| --- | --- | --- | --- |
| Refund | No website refund engine | Same original full $0.50 refund succeeded; updated snapshot says reversal; no second object evident | Bank/card credit and general boundary/concurrency cases |
| Unpaid lifecycle | Website delegates native checkout | R1 observed release/recovery; provider asserts 30-minute hold and two cleanup branches | Actual tenant flag; exact timing; separately approved unpaid cancellation/expired-link and decline/collision tests |
| Native SMS | Optional consent retained; inactive workflow associations separately verified | Email-confirmation mode and narrow phone-only SMS switch verified; email notifications enabled | Native SMS eligibility/consent predicate and SMS-only control clarification |
| Host scheduling | Existing reviewed routing source | Native UI asserts matching Taj/FA1 and Stacie/T3 Google presence; isolated15-minute Taj/Stacie/James post buffers; JamesJ2 Cal booking; FA1/JamesPhone attendee calendar/phone attested | JamesJ2 matching Google presence; direct Google destination/event bridges/content; controlled external conflicts, broader hosts/concurrency |
| Launch | Existing reviewed method routes and policy copy | Controlled cases only; HIR-609 dependency retained | James Zoom reauthorization/retest, actual reminders, remaining lifecycle/policy QA and separately authorized release |

## Approved support follow-up — sent approximately 08:28 UTC

After viewing the revised exact wording, the user instructed **отправляем**. Root sent it once
to Milos in the existing ticket; fresh UI showed the complete outbound article, Just now,
cleared composer and disabled Send. At approximately 08:31 UTC it remained Not seen yet, with
no new reply included. These UI states establish submission, not reading or an answer.
This supersedes the prepared/UNSENT snapshot from PR #21. No customer test or settings action
was performed. Exact message sent:

> Hi Milos,
>
> Thank you for the detailed explanation — it helps us understand the unpaid-booking flow and native notifications.
>
> Could you please clarify three points for our SOLAGREE account?
>
> 1. Expired unpaid bookings: Your reply includes both “Flag OFF” and “Flag ON” alternatives. Which applies to our account? After the 30-minute hold expires, does the booking remain Pending, or does automatic cleanup cancel it? If cleanup cancels it, does that trigger cancellation emails or SMS?
>
> 2. Native SMS and consent: Our booking links use Email confirmation with a required email address. We also collect a required phone number and have an optional custom checkbox named smsConsent, unchecked by default. For native awaiting-payment, confirmation and cancellation messages, does SMS require smsConsent=true, or can collecting a phone number alone trigger it?
>
> 3. Disabling SMS while keeping email: Is there a supported way to disable those native SMS messages while keeping confirmation, payment and cancellation emails enabled? We found “Disable SMS notifications for phone-only booking links,” but its description refers to links where email is optional. Does that setting also cover our links with required email?
>
> Thanks again for your help!

Production deployment and Done remain unauthorized; reviewed task PR merging is covered by
the user's later standing merge instruction. Another outbound question, test or cleanup needs
its own applicable authorization.
