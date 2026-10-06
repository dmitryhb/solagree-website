# Initial Consult — First Available Phone test preparation, October 6, 2026

Scope: HIR-246/HIR-250; publication depends on HIR-609. This is isolated preparation,
not a submitted booking, native allocation PASS or notification approval.

## Prepared provider configuration

Created hidden event **7360837**, `initial-consults/test-first-available-phone-20261006`,
as a separate duplicate of the prepared First Available Phone event 7352991.
Title: TEST — First Available Phone routing — no payment.
Root saved technical copy explicitly stating 30 minutes/$0 USD, no payment/consultation/real call,
SMS/reminders disabled and exact appointment/recipient approval required before user final Confirm.

Payments were disabled on this copy; original $60 production/prepared events were not changed.
All three round-robin hosts retained: Taj, Stacie and James, medium priority, Maximize availability,
no fixed hosts/weights/future-member inclusion. Default host schedules retained, common/restriction
schedules OFF. Notice 2 hours, buffers 0 before/15 after; fixed test date range October 7–8.
Existing paid Stacie T3, free James records and the canceled/refunded R1-R are preserved.

Two inherited production email-workflow associations were disabled **only on this copy**;
all eight event workflow toggles now OFF in root's view. This does not disable production reminders.
Native confirmation/calendar notices can still be emitted after a booking; they require exact
recipient/scenario approval. Root has not booked, sent a notice, accepted Terms or entered contacts.

The copied form shows Name/Email/State required, one required native Phone location input,
universal phone hidden, Notes optional and SMS optional. Independent fresh provider QA completed
**07:42:50 UTC** and passed the saved settings above: Hidden, 30 minutes, payment OFF, three
medium-priority hosts/Maximize availability, default schedules, stated window/notice/buffers,
all eight workflows OFF/Save disabled. The universal-phone editor independently had required OFF;
its dialog was canceled without edits. SMS was unchecked in the preview. The booking-form editor's
hypothetical appointment is not an actual selected time. Global workflow preservation was not
freshly re-audited by this QA; its provider actions were strictly read-only on this copy.

## Candidate for separately approved test

October 8 **01:00–01:30 Europe/Amsterdam** = October 7 **23:00–23:30 UTC** = October 7
**16:00–16:30 America/Los_Angeles**. Earlier independently checked public direct availability had
this start only for Taj. Independent new-route QA verifies the same **01:00** enabled start,
rendered UTC timestamp **2026-10-07T23:00:00.000Z**, with overlay OFF and no time selected/hold.
Overlay restored ON; timezone unchanged; QA's research tab closed. This is candidate availability,
not actual assigned-host/calendar-write or delivery evidence.
All three hosts remain configured; the test will check the actual assigned host after user Confirm.
Approval must name the controlled attendee and potential host recipients; contacts stay in the
approval/provider UI, not shareable evidence. No real call, SMS, reminders or payment is planned.

After exact approval: prepare the single native Phone form with approved contact data and unchecked
SMS, then hand final Confirm to the user. Reconcile one actual booking, assigned host/time/Phone,
slot/post-buffer exclusion across First Available and direct routes, native calendar write and
attendee/host notices. Any cancellation or later notices need separate authorization.

This free isolated case does not accept $60 pay-to-lock, paid round-robin lifecycle, broad fairness,
concurrency, arbitrary external calendar conflicts or Zoom James. See [displayed availability union](initial-consult-method-routing-2026-10-05.md)
and [main acceptance matrix](initial-consult-acceptance-2026-10-05.md).

## Evidence split

| Scope | Verified by code | Confirmed in services | Required next action |
| --- | --- | --- | --- |
| Routing | Reviewed route/method source already passed; no new source change | Earlier public two-date displayed union PASS | New copy saved-setting/candidate QA PASS; actual allocated host after approved user Confirm still needed |
| Free Phone form | Existing separate-method source/fixture gates retained | Root saved free/hidden copy, one required native phone in editor, eight workflows OFF | Independent saved-state check PASS; exact scenario/recipient approval before contacts/notices still needed |
| Calendar/payment/launch | No website calendar or refund engine | No new booking, payment or financial action in preparation | Native calendar/notices/conflicts and paid routing remain open; coordinated production release/Done separately gated |

At root's October 6 support recheck, the existing unpaid-expiry question is now marked Seen,
with no subsequent support answer visible. It was not resent. Release TTL/cleanup/link invalidation
remain unaccepted; no new payment test is authorized.
