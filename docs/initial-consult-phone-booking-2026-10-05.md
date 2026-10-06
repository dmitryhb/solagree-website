# Initial Consult James Phone booking — October 5, 2026

HIR-246 → HIR-248 → HIR-249 → HIR-250; HIR-609 publication dependency retained.
This records an actual free Phone booking and a calendar export gap, not launch or paid acceptance.
No attendee contacts, phone values, booking identifiers or meeting tokens are included.

## Later October 6 read-only calendar recheck — 11:42:15 UTC

Independent native QA selected Direct James, James host, Amsterdam October 6 at 21:00 in
Troubleshooter. Matching Cal.com booking reason is Busy 21:00–21:30; it still does not assert
Google presence or expose an exact destination bridge. A separate Google Calendar blocking reason
does not prove J2's calendar write. Organizer calendar presence remains UNKNOWN, not a failed-write
verdict. No impersonation, booking-time selection/hold, change or send; own research tab closed.

## Later October 6 native buffer evidence — 08:33:52 UTC

Independent native Troubleshooter QA for actual Direct Choice James / Europe/Amsterdam October6
identifies a Cal.com booking masked Busy at **21:00–21:30** (19:00–19:30 UTC). A separate expanded
Booking buffer explicitly blocks **21:30–21:45** (19:30–19:45 UTC), isolating the fifteen-minute
post buffer. This supersedes the initial whole-date/unknown-cause buffer gap below.

The matching Cal reason does not say the booking also appears on Google Calendar. A separate
Google busy reason concerns another interval; it is not J2-write proof. Native host Google presence,
exact booking-ID/owner/destination/content bridge and controlled arbitrary external conflicts remain
unaccepted. No new booking, send, calendar/settings/OAuth/financial action was performed.
See [provider clarification](initial-consult-provider-clarification-2026-10-06.md).

## October 6 client attestation and fresh Zoom check

The user confirms that the Phone number is present in the received invitation and calendar
record. Record those contents/calendar presence as **client-confirmed**, superseding the earlier
awaiting-attestation status below. This is not direct agent inspection of the delivered attachment,
message headers/counts, exact calendar destination/owner or native write pipeline. The observed
manual Google/Office/ICS omission remains; it does not describe the client-confirmed invitation.

After that reply, a fresh independent read-only James Conferencing check (GPT-6.1-Sol high)
still shows Zoom Video Default with the explicit expired-or-revoked permissions warning.
Reauthorization is not UI-confirmed, and no new Zoom creation is proved. Official impersonation
exit restored Jill, with no banner/stop control remaining; own diagnostic tab closed. No OAuth,
settings, booking or notification action was performed. The user merged PR #10 into develop
`0e4051566a24814df1ad0f5c69d6ab81fe18d185`; existing worktree synchronized, evidence preserved.

## Authorized action and actual result

The user merged [PR #9](https://github.com/dmitryhb/solagree-website/pull/9) into develop
`eed18d980b4d5446ceca3b0a9f0a8b76b1e6401c`. Existing hir-249 was fast-forwarded;
unrelated changes and untracked provider evidence were preserved.

The user then pressed final Confirm for the separately approved hidden James Phone technical
test: event 7352910, October 6, 19:00–19:30 UTC / 21:00–21:30 Europe/Amsterdam /
15:00–15:30 America/New_York, $0, specifically agreed controlled attendee and James organizer.
Authorization covers confirmation/calendar invitations, with no consultation, actual call,
SMS or reminders. Cancellation/cleanup notices, another booking and financial actions are excluded.

Before Confirm, independent preparation QA verified one visible required phone input and
unchecked optional SMS. At the user's later instruction, root filled the supplied phone and State,
visually checked the international format and retained final Confirm for the user.
The [preparation record](initial-consult-phone-preparation-2026-10-05.md) is now historical.

Independent actual provider QA (GPT-6.1-Sol medium) confirms scheduled James, the expected
technical Phone title, correct interval and one matching Confirmed admin Upcoming entry.
The canonical/admin viewer shows October 6, 20:00–20:30 British Summer Time; Google/Office
link parameters independently retain 19:00–19:30 UTC. The supplied international number appears
in attendee Who and meeting Where, and admin Where. Those are two presentations of the single
collected number, not two collection inputs. No Zoom/Cal Video meeting link is shown.
The native numeric event-ID bridge was not separately exposed during actual booking QA;
the event association is bounded to matching saved title/context, host and approved interval.

## Manual calendar exports — phone location omitted

Root and independent QA observe correct Google/Office timestamps, but no location parameter.
The Other link's inline ICS has DTSTART at 19:00 UTC and DURATION PT30M, but no LOCATION,
no submitted phone digits in the description and no Zoom/Cal Video location. The technical
description alone does not supply the organizer's call number. Manual Add to calendar exports
therefore do not establish phone propagation into a calendar entry.

These are the public manual exports, not the delivered email attachment or the organizer's native
connected-calendar entry. At the original independent inspection, invitation delivery/calendar
contents lacked attestation; the October 6 client confirmation above supersedes that waiting state.
Direct attachment/host-destination inspection and the exact native write pipeline remain unverified.
Neither agent clicked Add to calendar, joined a service, called the number or sent a message.
Do not infer that an emailed invitation or native host entry has the same omission without inspecting it.

## Bounded provider investigation and unsent support question

A read-only investigation (GPT-6.1-Sol high) inspected the public cal.diy fork at pinned commit
`54343aa685ae8f33159d2f485ec4a57bad5c574a`, dated September 20, 2026. Its
[manual export generator](https://github.com/calcom/cal.diy/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/packages/features/bookings/lib/getCalendarLinks.ts#L170-L235)
uses only metadata videoCallUrl for location; booking.location is used in resolving the title,
and the description is copied from event-type description. This is consistent with the observed
Phone omission. Its separate
[invitation ICS generator](https://github.com/calcom/cal.diy/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/packages/emails/lib/generateIcsString.ts#L61-L109)
falls back to event.location and writes LOCATION, while the
[Google integration](https://github.com/calcom/cal.diy/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/packages/app-store/googlecalendar/lib/CalendarService.ts#L189-L217)
also has a separate location path. Public fork code explains a possible distinction; it is not
verified source for hosted 6.9.11-h, nor evidence of this booking's delivered invitation/native write.

Hosted Confirmation → Calendar event name exposes Location and location variables; the
[official customName contract](https://cal.com/docs/api-reference/v2/event-types/update-an-event-type#body-custom-name)
also documents Location. Putting a phone in the title is an untested candidate and could expose
it in shared calendar titles. No title was changed; custom name stayed empty and Save disabled.
Retain the client-confirmed invitation/calendar result and inspect specific contents/destination
if a workaround is needed. Static Phone
instructions cannot dynamically replace the manual export's missing location.

Prepared support wording, not sent:

> For a booking using native Attendee phone number, confirmation shows the submitted number, but Google/Office/Outlook Add to Calendar links and downloadable ICS omit the location. Is there a supported hosted configuration that includes that number in these exports' location field without putting it in the title? Do delivered invitation ICS and native Google destination-calendar entries use a different location pipeline?

## Isolation and limits

Fresh independent after-booking settings QA confirms payments OFF, all eight event workflows OFF,
all four global SMS workflows inactive and Save disabled. SMS was unchecked on the prepared
form; an explicit stored No is not rendered on canonical/admin details and is not independently
claimed from its absence. No SMS delivery or universal absence-of-side-effects claim is made.

Independent Stripe QA remains at the same four historical SOLAGREE All-list records: three
Succeeded $0.50 and one Incomplete $0.50. No new charge appears in that bounded account/list;
the free booking does not prove production $60 checkout, refunds or paid lifecycle acceptance.

Root's fresh public availability view shows all October 6 disabled, both with attendee calendar
overlay ON and OFF. No adjacent same-day slots isolate the cause, so booked-slot/post-buffer
exclusion and arbitrary external busy-conflict behavior are not counted as PASS. Overlay ON was
restored. QA history did not expose actor/source event rows during bounded reads; those details
are not claimed. Actual blank-submit/server validation remains untested.

| Criterion | Verified by code | Confirmed in services | Required external action |
| --- | --- | --- | --- |
| Method routing | Existing reviewed separate-method source and QA retained; this supplement changes docs only | Current runtime mixed; prepared Phone counterparts Hidden/closed | Authorized coordinated conversion/opening/runtime release later |
| Single phone collection / booking | Website adds no second contact form | One required input before Confirm; actual phone in confirmed booking Who/Where/admin Where PASS | Actual blank rejection/server validation and paid Phone lifecycle remain open |
| Host/time/one record | Native provider owns booking | Independent matching Confirmed James record and UTC interval PASS; invitation/calendar number present client-confirmed October 6 | Direct attendee/host inbox/header and exact calendar owner/destination inspection, arbitrary busy conflicts |
| Phone calendar content | No website calendar export engine | Received invitation/calendar number client-confirmed. Manual Google/Office/ICS correct time but phone location absent | Direct attachment/destination details remain uninspected; reconcile known manual export limitation for release |
| Free payment/SMS isolation | No payment/SMS engine added | Payments/all eight event workflows OFF; global SMS inactive; bounded Stripe All list unchanged | Free result does not cover paid lifecycle or directly prove stored SMS No/delivery absence |
| Conflicts/buffers | Availability delegated to provider | Initial whole-date cause unknown; later native Troubleshooter isolates matching Cal booking and15-minute James post buffer | Controlled external busy/conflict evidence; actual J2 Google presence/ID bridge; no additional bookings or cleanup authorized |
| James Zoom | Website does not create meetings | Earlier Zoom-intended booking uses Cal Video; fresh October 6 check still shows Zoom Default and expired/revoked permissions | James/client reconnects existing Zoom, confirm warning clears, then separately approved controlled retest |

Existing Cal Video James and paid Stacie records/reminder bindings remain intact. No agent
payment, refund, cancellation, new booking, reminder/SMS activation, production activation or Done.
The [main matrix](initial-consult-acceptance-2026-10-05.md) retains broader paid failure/retry/duplicate,
manual reschedule/payment retention, refund-boundary and future 24h/1h reminder gates.
The prepared client explanation of two calendar days remains unsent.
