# Initial Consult — G1 attendee early-cancellation case

HIR-248/HIR-249/HIR-250; HIR-246 and HIR-609 dependencies retained.
Current stage: user completed payment and guest cancellation. Root observed the canceled guest
page and Stripe full refund by 13:17:07 UTC October 6. Independent post-cancellation QA passed
at 13:18:56 UTC;
delivery, calendar removal and bank credit remain unconfirmed.

Later owner decision October6: G1 cancellation/refund email receipt and attendee calendar removal
are **SKIPPED**, with follow-up only if the client reports a matching problem. The previous
attestation request is no longer a preparation gate; this is not PASS or delivery/removal proof.
See the [current owner exceptions](initial-consult-acceptance-2026-10-05.md). Actual full Stripe
refund remains accepted; bank credit and other boundary/server gaps are not waived by this decision.

## Guest cancellation result

Following the user's final Cancel, the same signed-out public page says **This event is canceled**
and **This booking payment has been refunded**. No active Cancel/Reschedule/Pay or meeting link
is exposed in that canceled page. This is rendered old-page behavior, not server-bypass proof.
Root separately refreshed the original Stripe payment and observed **Refunded**, original amount
$0.50 USD and full refunded amount $0.50 USD. Events show one refund created and one refund
issued, with a successful POST /v1/refunds log; receipt history contains Payment and Refund rows.
The dashboard labels 9:16 AM without an explicit timezone, so it is not treated as a UTC epoch.
Root's observation by 13:17:07 UTC brackets the already completed cancellation/refund well before
the provider-asserted October6 23:30 UTC cutoff. No additional manual refund was performed.

This accepts the observed early attendee cancellation/refund path only. Equality, late refusal,
DST, all server/old-link bypasses, actual meeting deletion, host calendar removal and bank credit
remain open. A specific G1 attendee email/calendar attestation was requested separately, then
skipped by the owner; it is not inferred from R2 or T3. Protected T3 and reminder configuration remain subject to independent
preservation verification below.

Root subsequently opened a fresh public event page in the same signed-out browser by 13:19:57 UTC:
October9, Europe/Amsterdam, canceled start **01:30 visible/enabled** among displayed available times.
No start was selected, no new hold/checkout/booking created; research tab closed. This accepts
rendered slot release only, not arbitrary calendar conflicts or concurrency. It remains root-only.

## Independent final reconciliation

Native QA **PASS at 13:18:56 UTC, October6**, Cal.com **6.9.12-h**: G1 is Canceled, same Stacie
and original interval. History shows Cancelled, source WEBAPP and attendee-labelled actor; displayed
15:16:04 has no explicit timezone label. The historical Paid badge/refund message and Zoom link
remain in admin details; they do not prove deletion or an active booking.

Stripe original payment is fully **Refunded $0.50 USD**. One refund-created object has status
**Succeeded**, amount50/USD; charge-refunded event has amount_refunded50 and refunded=true.
One original charge event remains. All7 now contains **3 Succeeded / 1 Refunded / 1 Reversed /
2 Incomplete**, one G1 row. Receipt history contains one Payment and one Refund row; neither inbox
delivery nor bank credit is inferred. Private financial tokens were inspected only in native views.

T3 remains Confirmed/Paid with original Stacie/time. Each test reminder links only T3's event;
each production reminder retains original5+Phone4, all four SMS workflows inactive. QA performed
no mutations or sends and closed its nine own research tabs. Guest-role and old-page control
observations remain root-only; slot release was not part of this independent pass. Memory: none.

## Historical paid result and cancellation handoff

Independent native QA at **13:07:34 UTC, October 6**, Cal.com **6.9.12-h**, confirms G1
Confirmed/Paid, sole Stacie host, the approved UTC interval and a generated Zoom link. Native
history shows Booked and Stripe Accepted. Stripe shows one successful $0.50 USD original charge;
the bounded seven-record ledger contains four Succeeded, one Reversed and two Incomplete, with
exactly one G1 row. Metadata matches event, host and technical title and contains a numeric booking
ID. The native numeric-ID-to-public-UID bridge was not exposed; do not claim that additional bridge.
Root matched the public booking callback to the same payment intent and exact host/title/time.
Private booking/payment/meeting references stay outside shareable evidence.

Native View receipt renders SOLAGREE/$0.50; one Payment sent entry is present. Dashboard event and
receipt times have no explicit timezone label and are not relabeled UTC. This is service evidence,
not an attendee inbox, calendar or bank-credit attestation. T3 remains Confirmed/Paid at its original
interval with Zoom and its exact reminder associations preserved; production/SMS workflows unchanged.

After payment, root again opened the protected Bookings route in the separate in-app context and
observed Sign in, then closed that probe. Canonical guest booking shows scheduled/$0.50 and only
Cancel, with meeting URL provided through confirmation email. Guest role is root-observed;
independent access to this browser remains unavailable. Absence of a Reschedule control does not
prove backend enforcement. User alone clicks guest Cancel and any final confirmation before the
approved cutoff. No cancellation, refund or settings mutation was performed by either agent.

The safe cancellation-control and canceled-heading screenshots omit contacts. Current cancellation
outcomes above supersede this historical paid-before-cancellation handoff and prepared baseline below.

## Exact authorization and scenario

The user explicitly approved one new G1 on existing hidden Stacie event7357581, October9
01:30–02:00 Amsterdam / October8 23:30–October9 00:00 UTC / October8 19:30–20:00 New York,
Zoom, one $0.50 USD payment to SOLAGREE. Exact controlled attendee and Stacie host receive
specified native pending-payment/confirmation/calendar/cancellation notices; attendee receives
payment/refund receipt. Reuse of the supplied phone/Florida approved; no extra guests, SMS,
reminder workflow or real consultation. Private contacts stay outside repository evidence.
User alone completes final Terms/Pay and guest cancellation before provider-asserted cutoff
October6 23:30 UTC / October7 01:30 Amsterdam. Expected native full original-payment refund.
No manual additional Stripe Refund, second payment, late cancellation or other-record cleanup.

## Historical prepared baseline and guest context

Independent saved-event preflight at12:44:22UTC passed; details and current Oct8–Oct9 saved range
are in the [policy plan](initial-consult-policy-boundary-plan-2026-10-06.md). No setting changed.
Root refreshed Stripe and observed six records; independent financial baseline at12:56:08UTC
confirms All6: three Succeeded, one Reversed, two Incomplete; no G1 transaction visible.

The in-app browser became available for this attempt but initially retained old Taj impersonation.
Root used official stop, verified Jill, then official Sign out. The fresh protected Bookings route
requires sign-in with empty email/password. Reloaded public route no longer has personal calendar
overlay; booking form starts with blank name/email. Chrome profile Jill independently remains
signed in as Jill after this separate in-app sign-out. This is root-observed guest-context evidence.
Independent guest-role inspection was unavailable: browser3 was not exposed to that agent;
no alternate login/profile/bypass was attempted. Do not claim independent guest-role verification.

Root selected only the approved October9 01:30 start and filled the approved attendee values,
required single phone/State Florida, technical notes, no added guests, optional SMS unchecked.
At that pre-payment snapshot, final Pay to book remained unpressed. Prepared consent was not an
actual submitted-consent attestation.
Safe screenshots retain summary/date/time/amount and SMS/Terms/Pay controls, without contacts;
full temporary screenshot was deleted. Guest form is retained as an in-app handoff, while separate
Chrome admin/Stripe pages remain available for reconciliation.

## Historical authorized sequence and remaining acceptance

Paid reconciliation is complete within the bridge limitation above. User alone performs final guest
Cancel in the same signed-out context before cutoff. Verify actual original-charge Stripe refund,
Canceled/slot release/old-link barrier and authorized notices; no manual refund fallback if absent.
Ambiguous payment, lost guest role or passed cutoff stops this early case. T3 and reminders protected.
This sequence has now reached the independently reconciled guest refund result above;
delivery/calendar attestation is later SKIPPED by owner decision. Equality/DST and bank credit remain
unaccepted. Closing or restoring the event's saved Oct8–Oct9 range is not part of this case.

## Review and document QA

Independent Sol high review PASS, no actionable findings; independent Sol medium native QA and
final net-document QA PASS. Whitespace, all28 relative links and focused privacy scan pass;
new G1 file read fully. This is documentation-only evidence; existing source checks retained,
no equivalent source suite rerun. No agent financial action, provider setting mutation or send.
Both reusable-memory reports: none. No production deployment or Done.
