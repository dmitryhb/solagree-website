# Initial Consult booking operations

This runbook records the non-secret Cal.com configuration used by the Initial Consult booking page. Keep credentials, OAuth tokens, recovery codes, and 2FA codes out of this file and out of Linear.

## Runtime event paths

The Nuxt runtime configuration uses paths relative to `https://solagree.cal.com`, never full URLs.

| Selection | Cal.com event ID | Event path | Host assignment |
| --- | ---: | --- | --- |
| First Available | `6658910` | `initial-consults/initial-consult` | Round robin: Taj, Stacie, Jessica, James |
| Taj Chiu | `6658975` | `initial-consults/initial-consult-taj` | Taj only |
| Stacie Sanders | `6658981` | `initial-consults/initial-consult-stacie` | Stacie only |
| Jessica Urash | `6659009` | `initial-consults/initial-consult-jessica` | Jessica only |
| James Traub | `6659015` | `initial-consults/initial-consult-james` | James only |

The matching environment variables are documented in `.env.example` and `README.md`.

## Verified Cal.com state

Verified through September 3, 2026:

- Organization: `SOLAGREE®`; team: `Initial Consults` (`388743`).
- All five events are enabled, 30 minutes, and priced at $60 USD with `Pay to book` on the public flow.
- Stripe account activation is complete: Stripe confirms that the SOLAGREE account can make live transactions. Live end-to-end payment acceptance is still required before production sign-off.
- Each event currently offers Cal.com's `Attendee phone number` and `Zoom` as the two public location choices. This is not the approved `Phone Call` location: Cal.com requires a valid organizer/business number before that replacement can be published. Do not invent or reuse a placeholder number.
- `Zoom` is stored as Cal.com's `Organizer's default app` with the public custom label `Zoom`. The team owner cannot inspect a member's Google Workspace or Zoom authorization state; each host must confirm their own connections.
- No personal meeting types were changed through Cal.com's optional bulk-update step.
- Public First Available QA reached the attendee/payment form and displayed Phone, Zoom, 30 minutes, $60.00, and `Pay to book`. No booking or payment was submitted.

The First Available event is configured with a 15-minute post-event buffer, no pre-event buffer, two-hour minimum notice, a rolling 14-day booking horizon, and no per-host daily cap. It uses host default schedules rather than a shared or restricted schedule, and load-balancing round robin.

### Current assignment status

The September 3 owner-side configuration repair added/invited Stacie to `Initial Consults` and saved the event assignments:

- Taj, Jessica, and James are existing `Initial Consults` members; Cal.com confirmed that Stacie's team invitation was sent and exposed her for assignment.
- First Available now includes Taj, Stacie, Jessica, and James as round-robin hosts.
- First Available retains `Load balancing`; no fixed hosts or weights were enabled.
- Stacie is the only round-robin host on `initial-consult-stacie`; reload verification displayed bookable slots.

Confirm that Stacie accepts the team invitation and becomes an active host before treating the four-host setup as production-ready. Host-owned Google Workspace conflict checking and working hours remain unverified by the owner. The previously recorded default working-hours pattern (Monday-Friday, 09:00-17:00 in each host's local timezone) must be confirmed by the hosts.

## Host identities

| Host | Solagree email | Timezone |
| --- | --- | --- |
| Taj Chiu | `taj.chiu@solagree.com` | `America/Los_Angeles` |
| Stacie Sanders | `stacie.sanders@solagree.com` | `America/New_York` |
| Jessica Urash | `jessica.urash@solagree.com` | `America/New_York` |
| James Traub | `james.traub@solagree.com` | `America/New_York` |

Stacie's previous `stacie.martin@solagree.com` identity is obsolete. Her Cal.com membership/profile and Google Calendar and Zoom connections must be verified against `stacie.sanders@solagree.com`.

## Approved booking form

The client confirmed the following requirements on August 28, 2026. Cal.com owns and renders these fields inside the embedded booking flow.

| Field | Requirement |
| --- | --- |
| Name | Required |
| Email | Required |
| How do you want to meet? | Required choice between Zoom and Phone Call |
| Phone | Required for every booking, including Zoom, so SMS reminders can be sent |
| State | Required |
| SMS opt-in | Present as an explicit, voluntary opt-in; do not preselect it or make consent a condition of booking |
| Notes | Present and optional |
| How did you hear about us? | Proposed optional attribution field; awaiting explicit client approval before configuration |

The September 3 inspection and repair confirmed the required Phone, State, voluntary unselected SMS checkbox, required Name/Email/location, and optional Notes on all five events. Stacie's State Select contains all 50 states plus District of Columbia. The proposed attribution question is absent from the inspected events.

## Remaining acceptance work

- Confirm Stacie accepts the `Initial Consults` invitation and is active before production use.
- Verify each host's Google Workspace calendar connection and conflict-check calendar.
- Re-verify Stacie's Google Calendar and Zoom authorizations against `stacie.sanders@solagree.com` after the membership change.
- Obtain final confirmation of each host's working hours.
- Do not add the attribution field until the client explicitly approves it.
- Complete the safe live-payment test matrix under HIR-248; Stripe account activation itself is complete.
- Run the full Phone and Zoom booking/cancellation acceptance matrix under HIR-250, including direct-host and First Available paths, before production sign-off.
