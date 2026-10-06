# Initial Consult — provider clarification, October 6, 2026

## Later native recheck — 12:24:59 UTC October 6

Independent read-only QA on Cal.com **6.9.12-h** confirms James Zoom Video remains Default
with an expired/revoked permissions warning. The existing official administrator inspection was
exited; Jill identity and absence of the impersonation banner were verified. No Reinstall/OAuth,
settings, booking action or notice was submitted; research tabs were closed.

Protected T3 remains Confirmed/Paid/Stacie, October7 **22:30–23:00 UTC**, with a Zoom link.
Each controlled reminder retains only the original payment-check event; each production reminder
retains the original five plus four Phone routes. Four SMS workflows have no active links.
History shows Booked and Stripe Accepted; inspected workflow views expose no run queue/delivery log.
This is preservation/configuration evidence, not scheduled-run or inbox delivery proof.
Root's current support check still finds the narrow R2 cleanup question Seen with no later reply.
The connected Gmail account is not the controlled attendee mailbox; no attendee messages were read.

### Pending reminder evidence intake

| Reminder | Expected send UTC | Expected Amsterdam display | Actual outcome |
| --- | --- | --- | --- |
| T3 24 hours | October6 22:30 | October7 00:30 | Future / unverified |
| T3 1 hour | October7 21:30 | October7 23:30 | Future / unverified |

After each expected time, identify the exact T3 reminder and verify its 30-minute interval,
Stacie host, $0.50 controlled-test amount, timezone, usable Zoom instructions and lack of duplicate
messages. Keep payment/meeting links, contacts and full headers in restricted evidence; record
only redacted findings, receipt time with its timezone, and whether evidence is directly inspected
or client-attested. A native booking history entry or saved workflow does not prove delivery.
A follow-up check shortly after the expected time is an observation checkpoint, not a provider
SLA: absence then does not prove permanent delivery failure. No speculative resend, new booking,
cancellation, amount change or workflow toggle is authorized. T3 remains protected throughout.


Scope: HIR-246/HIR-248/HIR-249/HIR-250; HIR-609 remains the publication dependency.
Read-only service evidence, provider assertions and remaining acceptance are distinguished below.
The investigation performed no new booking, setting change, charge, refund or cancellation.
The separately approved revised support follow-up was sent once at approximately08:28 UTC,
as recorded below; customer test messages were not submitted.

## Later controlled unpaid observation — R2

The separately approved [R2 no-card result](initial-consult-unpaid-expiry-result-2026-10-06.md)
is distinct from this read-only clarification record. The user completed its checkout handoff;
approved starts were restored at the +31-minute check while the same booking and intent remained
Pending / Incomplete. At least fifty elapsed minutes later, no automatic cancellation was observed.
Checkout was never reopened by agents, no payment or manual cancellation occurred. This gives
bounded behavior evidence, not a verified tenant flag; the repeated OFF/ON template remains
unresolved. The exact narrow follow-up in the R2 packet was explicitly approved and sent once
to Milos in existing ticket 215476247361743; fresh UI by October 6 **10:30:36 UTC / 12:30:36 Amsterdam**
showed the complete outbound article, Not seen yet, and empty composer with Send disabled.
No reply or configuration change is inferred. This supersedes the historical unsent snapshots below.

Later user-performed R2 manual cancellation is visible by **11:55:21 UTC / 13:55:21 Amsterdam**:
Canceled/Cancelled history and exact old payment link explicitly payment-unavailable/no form.
Same Stripe intent remains Incomplete/missing method/one creation event. Hidden test range restored
Sep16–16 and public route closed. See the R2 packet for scope and version/timezone limits;
manual cleanup does not resolve the internal automatic-cleanup branch or prove mail/calendar removal.

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

## Later support correction — read at approximately 08:57 UTC

Milos replied to the approved three-point follow-up. These are **provider assertions**:

- Merely collecting a phone number does not trigger built-in SMS. Awaiting-payment, confirmation,
  reschedule and cancellation SMS apply to phone-only bookings with email left empty.
- Our links require email, so those native SMS are not sent for them, whether custom `smsConsent`
  is checked or not. Cal.com does not read that custom field for native sending. Workflow SMS
  is separate and remains disabled. This explicitly corrects the earlier broad phone-number claim.
- The phone-only SMS-disable switch applies only to optional-email links; nothing needs changing
  for these required-email links. Standard confirmation/payment/cancellation emails are unaffected.

This resolves the provider eligibility/control question for the inspected required-email setup;
it is not direct inbox/phone-delivery proof. Any future SMS workflow must still honor the applicable
per-event consent mapping. The existing T3 record's user-selected Yes is not changed or treated as
an authorization to send SMS; prepared unchecked defaults do not imply its submitted value.

The expiry answer **again includes both Flag OFF and Flag ON template alternatives**, even though
one branch says “on your account.” Actual tenant flag/name/scope remains unresolved; do not choose
one branch from the template. No new follow-up was sent. A closed, separate
[unpaid-expiry preparation](initial-consult-unpaid-expiry-preparation-2026-10-06.md) is ready for
exact scenario/recipient approval before any booking or native notice.

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

## Fresh original-event saved state — independent QA, 08:46:14 UTC

All **five original** production event configurations retain **30 minutes**, Paid booking ON,
Stripe (Initial Consults), **$60 USD**, Collect payment on booking and refund **If cancelled
2 calendar days before**. The four active routes retain **two-hour notice**, **zero pre-buffer**,
**fifteen-minute post-buffer**, horizon **fourteen calendar days**, with Always14 days available
unchecked. These are saved controls, not actual $60 checkout or cutoff-boundary acceptance.
The four prepared separate Phone counterparts are outside this fresh original-event audit;
their earlier closed-window preparation remains separately documented.

| Original route | Fresh assignment / distribution / pause |
| --- | --- |
| First Available | Taj, James and Stacie only; medium priorities; Maximize availability |
| Direct Taj | Sole Taj; medium priority; Load balancing |
| Direct Stacie | Sole Stacie; medium priority; Load balancing |
| Direct James | Sole James; medium priority; Load balancing |
| Jessica | Sole Jessica; Hidden; closed September16–16,2026 date range |

Fixed hosts, weights and future-member inclusion remain OFF on the four active routes.
The fresh direct-route distribution readback is **Load balancing**; do not extend historical
Maximize-availability statements about First Available or prepared Phone counterparts to these
original direct controls. Each direct route still has only its matching host.
Save remained disabled, no edits/slots/holds/bookings, own tabs closed and parent tabs preserved.
This fresh audit verifies the user-requested five-event refund-setting persistence and Jessica
pause, separately from calendar, allocation, payment and policy behavior.

## Displayed timezone/date rollover — independent review, approximately 08:43 UTC

Hidden First Available Phone event7360837 was compared using rendered slot-button `data-time`
UTC attributes and `aria-label` dates/times. The common window is **October7 22:00 UTC through
October8 22:00 UTC**, corresponding to the Amsterdam October8 local day. Each zone presents
exactly **eleven enabled starts** in that window, with **zero missing/extra UTC timestamps**.

| Zone / local date | Rendered enabled starts in the common window |
| --- | --- |
| Europe/Amsterdam / October8 | 01:30, 02:00, 02:30, 16:30, 17:00, 19:00, 19:30, 20:00, 20:30, 21:00, 21:30 |
| America/New_York / October7 | 19:30, 20:00, 20:30 |
| America/New_York / October8 | 10:30, 11:00, 13:00, 13:30, 14:00, 14:30, 15:00, 15:30 |
| America/Los_Angeles / October7 | 16:30, 17:00, 17:30 |
| America/Los_Angeles / October8 | 07:30, 08:00, 10:00, 10:30, 11:00, 11:30, 12:00, 12:30 |

Exact UTC set: October7 **23:30**; October8 **00:00, 00:30, 14:30, 15:00, 17:00, 17:30,
18:00, 18:30, 19:00, 19:30**. Three early Amsterdam starts belong to October7 in the US;
the remaining eight belong to October8. Whole US local-day lists each had thirteen starts,
so comparing whole local days would wrongly include starts outside the common window.
This accepts displayed timezone equivalence and day rollover only, not DST, refund boundaries,
calendar writes, submissions or lifecycle behavior. Amsterdam and overlay ON restored, own
research tab closed; no time selection, holds, form entry or saved provider change.

## Account-holder handoff — prepared, not sent

James/client needs to reconnect **James's existing Zoom account** through Cal.com → Settings →
Conferencing → Zoom → Reinstall app, retaining Zoom as default and the existing account/scope.
The account holder completes sign-in; no password or code should be shared in chat. Afterward,
verify the expired/revoked warning clears and the intended Zoom account remains selected.
Do not infer that an existing Cal Video booking converts to Zoom. A new exact free hidden retest
and its attendee/host notifications still need scenario approval and user final Confirm.

## Acceptance matrix

| Scope | Verified by code | Confirmed in services / client-attested | Requires external action or evidence |
| --- | --- | --- | --- |
| Refund | No website refund engine | Same original full $0.50 refund succeeded; updated snapshot says reversal; no second object evident | Bank/card credit and general boundary/concurrency cases |
| Unpaid lifecycle | Website delegates native checkout | R1 observed release/recovery; provider asserts 30-minute hold and two cleanup branches | Actual tenant flag; exact timing; separately approved unpaid cancellation/expired-link and decline/collision tests |
| Native SMS | Optional consent retained; inactive workflow associations separately verified | Required-email mode; provider corrects earlier claim: no native SMS on these links, custom checkbox not read; no setting change needed | Direct delivery/absence proof not inferred; future workflow consent mapping remains separate |
| Host scheduling | Existing reviewed routing source | Native UI asserts matching Taj/FA1 and Stacie/T3 Google presence; isolated15-minute Taj/Stacie/James post buffers; JamesJ2 Cal booking; FA1/JamesPhone attendee calendar/phone attested | JamesJ2 matching Google presence; direct Google destination/event bridges/content; controlled external conflicts, broader hosts/concurrency |
| Launch | Existing reviewed method routes and policy copy | Controlled cases only; HIR-609 dependency retained | James Zoom reauthorization/retest, actual reminders, tenant cleanup ambiguity, remaining lifecycle/policy QA and separately authorized release |

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
