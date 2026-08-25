# Initial Consult booking operations

This runbook records the non-secret Cal.com configuration used by the Initial Consult booking page. Keep credentials, OAuth tokens, recovery codes, and 2FA codes out of this file and out of Linear.

## Runtime event paths

The Nuxt runtime configuration uses paths relative to `https://solagree.cal.com`, never full URLs.

| Selection | Cal.com event ID | Event path | Host assignment |
| --- | ---: | --- | --- |
| First Available | `6658910` | `initial-consults/initial-consult` | Round robin: Taj, Stacie, Jessica, James |
| Taj Chiu | `6658975` | `initial-consults/initial-consult-taj` | Taj only |
| Stacie Martin | `6658981` | `initial-consults/initial-consult-stacie` | Stacie only |
| Jessica Urash | `6659009` | `initial-consults/initial-consult-jessica` | Jessica only |
| James Traub | `6659015` | `initial-consults/initial-consult-james` | James only |

The matching environment variables are documented in `.env.example` and `README.md`.

## Verified Cal.com state

Verified on August 25, 2026:

- Organization: `SOLAGREE®`; team: `Initial Consults` (`388743`).
- All five events are enabled, 30 minutes, and priced at $60 USD with `Pay to book` on the public flow.
- Each event offers `Attendee phone number` and `Zoom` as the two public location choices.
- The approved shared Zoom account is installed in the Cal.com profiles for Taj, Stacie, Jessica, and James, and Zoom is the default conferencing app for each profile.
- The Zoom event location is stored as Cal.com's `Organizer's default app`; the public custom label is `Zoom`.
- No personal meeting types were changed through Cal.com's optional bulk-update step.
- Public First Available QA reached the attendee/payment form and displayed Phone, Zoom, 30 minutes, $60.00, and `Pay to book`. No booking or payment was submitted.

The scheduling rules configured for the five events are a 15-minute post-event buffer, no pre-event buffer, two-hour minimum notice, a rolling 14-day booking horizon, and no per-host daily cap. Host profile and default-schedule timezones are `America/Los_Angeles` for Taj and `America/New_York` for Stacie, Jessica, and James.

## Remaining acceptance work

- Verify each host's Google Workspace calendar connection and conflict-check calendar.
- Obtain final confirmation of each host's working hours; the current default schedules are Monday-Friday, 09:00-17:00 in the host's local timezone.
- Finalize the booking form requirements for state, phone, and SMS opt-in. The current public form does not yet satisfy the full approved question set.
- Complete Stripe activation and the safe payment test matrix under HIR-248.
- Run the full Phone and Zoom booking/cancellation acceptance matrix under HIR-250, including direct-host and First Available paths, before production sign-off.
