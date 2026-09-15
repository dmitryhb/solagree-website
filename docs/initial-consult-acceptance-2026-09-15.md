# Initial Consult configuration follow-up — 2026-09-15

Scope: HIR-246 and HIR-248, with HIR-249 policy observations. The user authorized continuing
Cal.com setup and test-data acceptance. No live payment, booking confirmation or outbound message
has been submitted in this pass.

## First Available distribution correction

The administrator UI for event `6658910` showed Distribution = Load balancing. Its explanation
states that hosts ahead on booking count can be disabled. HIR-246 requires First Available to expose
the union of valid team availability, so the distribution was changed to Maximize availability and
saved. Cal.com's description says bookers can book whenever a host is available.

All four intended hosts remain assigned with medium priority. Weights remain disabled. No direct-choice
host, calendar, payment amount or notification workflow was changed.

## Configuration observed

- All five Initial Consult links are enabled and show 30 minutes and $60.
- First Available collects $60 USD on booking through Stripe (Initial Consults).
- Its buffers are none before / 15 minutes after; minimum notice is two hours; the future booking
  limit is 14 calendar days. Booking-frequency and total-duration limits are disabled.
- Its refund setting remains Never. Cancellation and rescheduling are enabled; the inspected
  Reschedule & cancel UI does not expose a one-reschedule count or a 48-hour cutoff.
- The event payment panel has no test-mode control. The installed Stripe app's menu exposes Remove
  app only. The portal's separately configured Stripe sandbox does not change this Cal.com connection.

The prior host-calendar review found external destination calendars for Taj, Jessica and James;
Stacie uses her Solagree calendar. Their intended mappings remain awaiting confirmation. Calendar
domains alone do not prove misconfiguration; no destination was changed.

## Acceptance status

Independent read-only QA confirmed the saved Maximize availability setting, four medium-priority hosts,
weights off and Save disabled on a fresh admin page. All five public forms show 30 minutes / $60,
Phone and Zoom choices, required Name/Email/Phone/State, an unselected SMS consent checkbox, and no
attribution field. Available public dates extend through September 29; this is display evidence, not
proof of calendar writes, conflict handling or successful paid booking. No form was submitted.

No supported test-mode switch was found in the hosted integration. Official instructions document
[connecting Stripe and enabling event payments](https://cal.com/help/event-types/how-to-receive-payments).
The [public integration README](https://github.com/calcom/cal.diy/blob/6bc45298226f96ff79e0c070c8b2ce39727e8477/packages/app-store/stripepayment/README.md)
describes test mode through deployment environment configuration. The
[payment service](https://github.com/calcom/cal.diy/blob/6bc45298226f96ff79e0c070c8b2ce39727e8477/packages/app-store/stripepayment/lib/PaymentService.ts)
uses a server Stripe key and connected account rather than an event-level mode selector.
The public repository is Cal.diy and is not guaranteed identical to hosted Cal.com; absence of hosted
sandbox support is an inference corroborated by the actual admin UI, not an explicit vendor guarantee.

The existing live connection was preserved. The user explicitly selected sandbox-only acceptance:
no real charge is authorized. Cal.com must confirm/provide a supported isolated hosted sandbox before
native payment acceptance can proceed. A second team or an event copy does not by itself establish
test mode. Provisioning a separate self-hosted deployment is outside this pass and would not prove
the hosted production integration.
No success/decline/retry payment evidence is claimed by this inspection. HIR-246/248 remain In Progress;
HIR-250 awaits its dependencies.

## Unsent support request draft

We use Cal.com Cloud for SOLAGREE's Initial Consults team. Five native Stripe paid events collect
$60 USD, and the team's existing Stripe connection is live. We need to test success, decline,
abandoned payment and retry without a real charge and without disconnecting or changing that live
connection. Can you provide a supported isolated hosted sandbox/test tenant for native Stripe bookings?
Please confirm how its Stripe test account is selected, how we can verify that all payment objects
have livemode=false, and whether booking emails, host calendar writes and Zoom creation can be isolated
for synthetic tests. Please do not change the existing live integration. No credentials are included.

This draft has not been sent. Host-calendar mapping confirmation for Taj, Jessica and James is also
still pending; no calendar change was inferred from the lack of a reply.

Memory preflight: the agent-memory MCP is unavailable and the available repository registry contains
no Solagree entry. Continued using repository and provider evidence; no memory was promoted.
