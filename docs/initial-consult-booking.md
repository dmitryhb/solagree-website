# Initial Consult booking operations

This runbook records the non-secret Cal.com configuration used by the Initial Consult booking page. Keep credentials, OAuth tokens, recovery codes, and 2FA codes out of this file and out of Linear.

## Runtime event paths

The Nuxt runtime configuration uses paths relative to `https://solagree.cal.com`, never full URLs.

| Selection | Cal.com event ID | Event path | Host assignment |
| --- | ---: | --- | --- |
| First Available | `6658910` | `initial-consults/initial-consult` | Round robin: Taj, Stacie, James (Jessica paused September 17) |
| Taj Chiu | `6658975` | `initial-consults/initial-consult-taj` | Taj only |
| Stacie Sanders | `6658981` | `initial-consults/initial-consult-stacie` | Stacie only |
| Jessica Urash | `6659009` | `initial-consults/initial-consult-jessica` | Jessica only |
| James Traub | `6659015` | `initial-consults/initial-consult-james` | James only |

The matching environment variables are documented in `.env.example` and `README.md`.

## Verified Cal.com state

Verified through August 28, 2026:

- Organization: `SOLAGREE®`; team: `Initial Consults` (`388743`).
- All five events are enabled, 30 minutes, and priced at $60 USD with `Pay to book` on the public flow.
- Stripe account activation is complete: Stripe confirms that the SOLAGREE account can make live transactions. Live end-to-end payment acceptance is still required before production sign-off.
- Each event offers `Attendee phone number` and `Zoom` as the two public location choices.
- The approved shared Zoom account is installed in the Cal.com profiles for Taj, Stacie, Jessica, and James, and Zoom is the default conferencing app for each profile.
- The Zoom event location is stored as Cal.com's `Organizer's default app`; the public custom label is `Zoom`.
- No personal meeting types were changed through Cal.com's optional bulk-update step.
- Public First Available QA reached the attendee/payment form and displayed Phone, Zoom, 30 minutes, $60.00, and `Pay to book`. No booking or payment was submitted.

The scheduling rules configured for the five events are a 15-minute post-event buffer, no pre-event buffer, two-hour minimum notice, a rolling 14-day booking horizon, and no per-host daily cap. Host profile and default-schedule timezones are `America/Los_Angeles` for Taj and `America/New_York` for Stacie, Jessica, and James.

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

## Remaining acceptance work

- Verify each host's Google Workspace calendar connection and conflict-check calendar.
- Update Stacie's Cal.com member identity to `stacie.sanders@solagree.com` and re-verify her Google Calendar and Zoom authorizations.
- Obtain final confirmation of each host's working hours; the current default schedules are Monday-Friday, 09:00-17:00 in the host's local timezone.
- Configure and reload-verify the approved booking fields on all five events. The current public form does not yet satisfy the full approved field set.
- Complete the safe live-payment test matrix under HIR-248; Stripe account activation itself is complete.
- Run the full Phone and Zoom booking/cancellation acceptance matrix under HIR-250, including direct-host and First Available paths, before production sign-off.


## Temporarily unpublishing consultants

The website setting `NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_UNPUBLISHED_CONSULTANTS` accepts comma-separated consultant ids: `taj`, `stacie`, `james`, `jessica`. It defaults to `jessica`. An explicitly empty value publishes everyone. Profiles and event paths are retained for restoration; unpublished event paths are not required. Invalid ids or unpublishing the entire team disable the booking UI.

Rebuild and deploy the static website after changing this setting. This is an environment setting, not a Portal admin draft control.

Website visibility does not change Cal.com assignment. Before completing a pause, separately exclude the consultant from the First Available round-robin event and disable their direct event's booking availability. Verify that an old direct URL cannot accept new bookings; hiding a Cal.com link alone may not prevent direct-link bookings. Preserve existing appointments and the member account. Restore Cal.com availability and host assignment before removing the id from the website setting and redeploying.

September 17: website code defaults Jessica to unpublished. Website deployment remains pending. Cal.com First Available now contains only Taj, Stacie, and James. Jessica’s direct event is Hidden and its booking window is restricted to September 16, 2026–September 16, 2026 (past), preventing new slots. To restore it, return Limits & buffers to 14 calendar days, retain the existing unchecked “Always 14 days available” setting unless separately approved, enable visibility, and re-add Jessica to First Available. Her previous two-hour notice and 15-minute post-event buffer are retained. The latest HIR-250 acceptance prerequisites require an isolated test setup with no real charges; the earlier live-payment wording above is historical. Client confirmation that the other three connected their calendars and Zoom is a readiness signal, not completed acceptance evidence.

## September 14, 2026 operational update

The observations below supersede the older August snapshot where stated. HIR-246, HIR-248,
HIR-249 and HIR-263 were resumed with user authorization; HIR-250 remains queued for integrated
acceptance. Provider configuration is not evidence of successful payment or delivered messages.

### Email reminders (HIR-249)

| Workflow | ID | Trigger | Scope |
| --- | --- | --- | --- |
| Initial Consult — 24-hour email reminder | `450309` | 24 hours before event | All five Initial Consult events |
| Initial Consult — 1-hour email reminder | `450313` | 1 hour before event | All five Initial Consult events |

Both workflows contain one attendee-email action, use sender name `Solagree`, and explicitly select
the five event types above; automatic application to future event types is off. Each message states
30 minutes and $60 USD, with Cal.com's native attendee, event date/end time, timezone, organizer,
location and meeting-URL variables. Cal.com reported `Workflow saved` for both. Delivery, timezone
rendering and Phone-versus-Zoom output still require controlled booking acceptance.

In the live SOLAGREE Stripe account, Customer emails had both `Successful payments` and `Refunds`
disabled. Both were enabled during HIR-249 configuration. These settings apply account-wide, use the
existing English language and support configuration, and do not constitute an actual receipt/refund
delivery test. Stripe notes that an API-provided `receipt_email` overrides the successful-payment
setting. No refund or payment was initiated by changing these settings.

First Available's standard attendee and host booking emails remain enabled; an extra confirmation
workflow was not added. Cancellation/reschedule links remain enabled. Automatic refund policy is
still `Never`: the available native threshold offers business or calendar days, and equivalence to
the approved exact 48-hour policy has not been accepted. Do not describe this setting as policy
enforcement or treat one-reschedule enforcement as verified.

SMS is not enabled by these workflows. The four original events use checkbox key `smsConsent`, while
Stacie uses `sms_opt_in`. A combined filter warns that fields are missing on some event types. The
unsaved filter exploration was discarded. Scope future SMS workflows to matching event groups and
require the relevant checkbox to equal `Yes`; verify declined/unchecked consent never sends SMS and
never blocks the existing email action. Verify the provider's SMS-recipient field mapping and credit
requirements before activation.

### Stacie's connections (HIR-246)

The administrator inspected Stacie's current profile and returned to the administrator account.
Google Calendar `stacie.sanders@solagree.com` is selected both as the destination calendar and for
conflict checks. Zoom Video is installed and marked default. Her default schedule `2340081`,
`Stacie's Hours`, is America/New_York: Monday–Thursday 18:30–21:00 and Saturday 12:00–14:00.
These replace the historical default-hours and email-identity assumptions for Stacie. Actual calendar
write/conflict behavior and generated Zoom URLs still require a controlled booking.

An independent administrator inspection also found Zoom installed/default for James, Jessica and
Taj. Their selected booking destinations are external Google calendars; Taj additionally has the
Solagree calendar enabled for conflicts. The intended destination mapping requires host confirmation;
an external domain alone does not establish an incorrect configuration. Confirm before changing it. External calendar addresses are intentionally not
recorded here. James's default schedule `2219808` is Monday–Friday 09:00–17:00 America/New_York;
Taj's `2219811` is Monday–Friday 09:00–17:00 America/Los_Angeles. Jessica's `2219809` is
America/New_York: Sunday 12:00–17:00, Monday 09:00–17:00, Tuesday 09:00–19:00,
Wednesday–Thursday 09:00–16:00 and Friday 10:00–14:00. The administrator session was restored after
inspection. These observations do not prove calendar conflict handling or approved host hours.

Independent read-only QA confirmed both saved email workflows' names, timings, five selected event
names, single email action, sender and native variables. The workflow selector does not expose numeric
event IDs, so that pass verified names/count rather than independently proving the ID mapping.

### Separate case-payment sandbox (HIR-263)

The portal's existing Stripe implementation is available at commit
`6297202bf43c8094aafc01a74680df5fd4e4b1aa`; see the portal repository's `docs/case-payments.md`.
A destination named `Solagree Portal staging — case payments` was created in the existing SOLAGREE
Stripe sandbox, with ID `we_1UFfZ2L3EvUvp66binpzyJ8i`, snapshot payloads, API version
`2026-06-24.dahlia`, and the nine events documented by the portal. Its URL is
`https://solagree-portal.qamachine.com/api/webhooks/stripe`.

At preflight, the deployed portal release was `20260828133653`, health returned 200, and this webhook
returned 404. The payment migration was not applied. The protected staging environment now contains
the staging success/cancel URLs and tolerance 300, but requires the sandbox API secret and endpoint
signing secret before the normal deployment gate can pass. No Stripe test events were sent. This
separate portal sandbox does not switch the live Cal.com payment connection to test mode.

Fresh portal code QA at the above commit passed lint, typecheck, build, 167 unit tests, 97 PostgreSQL
integration tests, 76 component tests, 15 real-server API tests and 18 email fixtures. The disposable
PostgreSQL container was removed afterward. Those tests make no real Stripe/email deliveries and do
not replace the external acceptance gate.
