# Initial Consult James free booking — October 5, 2026

HIR-246 → HIR-248 → HIR-249 → HIR-250. This record supersedes the earlier pending James
Confirm snapshots. It records a completed free test and an unresolved Zoom integration blocker,
not paid or launch acceptance. No attendee contacts, booking identifiers or meeting tokens are stored.

## Authorized action and observed result

The user merged [PR #7](https://github.com/dmitryhb/solagree-website/pull/7) into develop
`aef75159166c71014af43a6c7abccf4acd0fa37d`. Existing hir-249 was fast-forwarded; unrelated files
and untracked evidence were preserved. The user completed the separately approved free James
scenario by filling the native form and pressing final Confirm. This authorized its native
confirmation/calendar invitation to the specifically agreed test attendee and James organizer.
It did not authorize cancellation notices, another booking or any financial action.

Independent actual booking QA (GPT-6.1-Sol, medium) confirms one matching Upcoming record,
Confirmed status and James as host. October 6, 14:30–15:00 UTC equals 16:30–17:00
Europe/Amsterdam. The admin/canonical viewer renders 15:30–16:00 British Summer Time; visible
Google/Office calendar link parameters independently retain the correct UTC interval. Root history
shows Booked with James, Source WEBAPP, accepted status and test event 7352395. Independent QA
did not observe expanded history details, so that actor/source/status-history evidence is root-only.

**Intended Zoom acceptance FAIL:** fully loaded canonical confirmation, admin Where/Join and
calendar location links contain Cal Video. No actual Zoom link or creation evidence is visible.
The agent did not join either meeting service or click Add to calendar.

Independent bounded Stripe QA still shows exactly the previous four All-list records: three
Succeeded $0.50 and one Incomplete $0.50. No additional James payment row appeared in that
SOLAGREE account/list scope. This is a free test, not acceptance of $60 checkout or a universal
absence claim across other accounts/modes.

Native confirmation says invitations were sent, but actual inbox delivery and native host calendar
write remain unconfirmed. Client confirmation has been requested. The attendee submitted an
affirmative SMS answer; this does not activate workflows or authorize an SMS send. Fresh independent
after-booking QA confirms Paid booking OFF, all eight free-event workflows OFF, all four global
SMS workflows inactive and Save disabled. No workflow was activated.

## Fresh provider diagnosis

Read-only configuration investigation (GPT-6.1-Sol, high) found that free event 7352395 and
primary James event 6659015 use **Organizer’s default app**, with the custom display label Zoom.
A display label alone does not prove the integration type or successful meeting generation.

Existing Solagree administrator access was used for a bounded read-only James settings inspection,
then Jill was restored through the official exit control. James's Conferencing settings show
**Zoom Video already Default**, with an explicit expired-or-revoked permissions warning and
Reinstall app. Cal Video is also installed. Root separately verified the same warning and default
when preparing the user handoff. These observations identify invalid Zoom authorization as a
blocker and are consistent with fallback to Cal Video; hosted server logs were not available to
prove the internal fallback mechanism. Booking activity exposes no visible integration-error row.

Native Google Calendar is connected, with a selected write destination and enabled conflict
calendars; no invalid-calendar warning was visible. These settings do not establish actual writes,
arbitrary busy-conflict handling or post-booking slot exclusion on every event. Fresh independent
availability inspection found both free and primary James views offering only 21:00–22:30
Europe/Amsterdam, including with calendar overlay temporarily OFF. Booked 16:30/post-buffer
17:00 are absent, but no nearby earlier slots isolate the cause; booking/buffer exclusion is not
counted as a PASS. The overlay was restored and the QA tab closed.

## Matrix and next controlled actions

| Criterion | Code | Services | External action |
| --- | --- | --- | --- |
| Staging routing/policy | Existing reviewed source and generated artifact PASS | Prior independent full staging direct/client-navigation/four-route/mobile QA PASS | Production/separate-mode release remains separate |
| Free James host/time/confirmation | Native provider owns booking | Independent actual Confirmed/James/UTC interval/one matching record PASS | Attendee and host inbox/native calendar evidence pending |
| Zoom creation | Website does not generate meetings | FAIL: Cal Video; Zoom default is invalid/expired or revoked | James account holder reauthorizes existing Zoom, then separately approved controlled booking retest |
| Free test payment isolation | No payment engine added | Paid booking/all eight workflows OFF; four SMS workflows inactive; All-list remains four historic records | No new payment needed for Zoom reauthorization; paid lifecycle tests remain separately gated |
| Phone and SMS | Earlier visible required-phone/default-unchecked checks retained | Completed free form accepted populated phone; SMS answer Yes does not imply dispatch | Phone-only actual submission/number propagation and blank rejection remain open; no SMS launch prerequisite |

The precise correction is to reconnect **James's existing Zoom authorization**, retaining Zoom
as default. Changing the label or selecting Default again cannot repair invalid credentials.
Root prepared the actual Conferencing warning/Reinstall app screen under existing James admin
impersonation for the user's account-holder sign-in. No Reinstall/OAuth authorization, credential
entry, install, permission grant or settings save was performed by the agent. After the user action,
verify the warning clears and the intended Zoom account/default is valid, then officially exit to Jill.
The user confirmed James/the client is needed for sign-in. Root officially exited impersonation
and verified Jill's user menu with no impersonation banner. Reauthorization remains an external
action; the agent did not initiate OAuth. The safe warning/default screenshot contains no attendee
contacts, booking identifiers or tokens and remains outside tracked source.

Existing Cal Video booking remains intact. Reauthorization is not proof that this existing record
will change; editing it, sending updates or cleanup cancellation require their own exact approval.
Any retest requires its own recipients/scenario approval and user final Confirm. No new booking,
payment, refund, cancel/reschedule, resend, public event conversion, production deployment or Done
was performed by the agent. Original paid Stacie booking/reminder bindings were preserved.

The broader paid failure/retry/concurrency, manual reschedule/payment retention, calendar conflict,
Phone lifecycle, future reminder delivery and cancellation/refund-boundary gates remain in the
[main acceptance packet](initial-consult-acceptance-2026-10-05.md). The client calendar-day draft
remains prepared and unsent.

## Prepared account-holder message — not sent

Hi James, our controlled booking confirmed your appointment, but Cal.com supplied Cal Video
instead of Zoom. Cal.com currently shows that your Zoom permissions expired or were revoked,
although Zoom Video is already your default.

Please sign in to your own Cal.com account, open Settings → Conferencing, click Reinstall app
for the existing Zoom connection, and sign in using your own Zoom account. After reconnecting,
please confirm that the permissions warning has disappeared and Zoom Video is still Default.
We will then arrange a separate controlled booking retest. Please leave the existing technical
booking unchanged so its evidence is preserved.
