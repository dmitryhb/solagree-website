# Initial Consult — coordinated release preparation, October 6, 2026

## October 7 staging release status

[Website PR #36](https://github.com/dmitryhb/solagree-website/pull/36)
merged as `17aa8585df6d6939d233fe0dbc96db0a67d70d2b`. The complete
81-route, 304-file **mixed-mode** staging artifact from `bde526c` was
uploaded during a maintenance hold and then opened after the compatible Portal
release became healthy. Its live manifest SHA-256 is
`00a6ae8d229e13db750af3ce3e148f99e514f576e7876caacf55fd61df364d4e`;
the live approved Partner Terms HTML matches SHA-256
`18106cc9759517a1124af211605cac10ba8bdbbeceda41d9acbada8df94c7939`.
The full upload retained hidden server configuration and remote-only files
after a private full-webroot backup.

Authenticated staging checks returned HTTP 200 with generated HTML and
`noindex` for dynamic co-branded/webinar routes, while the webinar catalogue
remained indexable. BasicAuth returned 401 without credentials; the temporary
QA credential was removed and the original credential file restored. Jessica
remains unpublished and GA is disabled in the staging artifact. The four
existing mixed Cal.com event paths remain in use. Native Phone events and the
eight-route separate-mode conversion below were **not** activated. No
production Website or Cal.com setting changed. The remaining instructions
and eight-route sheet below apply to a separately approved native conversion
window; they do not describe the currently deployed staging mode.

HIR-246 → HIR-248 → HIR-249 → HIR-250; HIR-609 publication dependency retained.
Prepared instructions only: no build, upload, public event conversion or booking submitted here.
The user has authorized reviewed merges, not production activation or Done. Actual service gaps
and accepted exceptions must be resolved or explicitly accepted before release approval.

## Release record to complete before activation

Record the approved environment, maintenance window, operator, exact source commit, full generated
artifact/build ID and manifest, current production rollback artifact/manifest and approval text.
Do not substitute the historical staging artifact for a production rollback snapshot. Capture
current production public runtime values and all four active mixed event settings before changes.
Keep secrets, attendee data, booking/payment identifiers and private infrastructure paths outside
repository evidence. A merge SHA alone does not identify a deployed artifact.

Owner exceptions October6: G1 cancellation/refund inbox and attendee calendar removal plus actual
T3 24h/1h reminder inspection are SKIPPED; James Zoom repair/retest is DEFERRED despite the known
expired/revoked warning and prior Cal Video fallback. These three points no longer block current
preparation and are revisited on a matching client report. They are not service PASS or a repair.
No settings, appointments or scheduled reminders are changed by this decision.

Other recorded acceptance dependencies remain: unresolved native unpaid cleanup branch,
calendar/conflict and remaining controlled lifecycle/policy cases.
[Current acceptance](initial-consult-acceptance-2026-10-05.md)
separates service proof, client attestation and exceptions. No new paid test is authorized.

## Exact public booking configuration candidate

These are public routing values from `nuxt.config.ts` and the reviewed native-path preparation.
They are a candidate for the approved build, not the current deployed configuration. Relative paths
contain no URL, query or fragment. Jessica is excluded before pair validation; do not publish her.

```dotenv
NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_MEETING_METHOD_MODE=separate
NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_UNPUBLISHED_CONSULTANTS=jessica
NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_FIRST_AVAILABLE_EVENT_PATH=initial-consults/initial-consult
NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_TAJ_EVENT_PATH=initial-consults/initial-consult-taj
NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_STACIE_EVENT_PATH=initial-consults/initial-consult-stacie
NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JAMES_EVENT_PATH=initial-consults/initial-consult-james
NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_FIRST_AVAILABLE_PHONE_EVENT_PATH=initial-consults/initial-consult-phone
NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_TAJ_PHONE_EVENT_PATH=initial-consults/initial-consult-taj-phone
NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_STACIE_PHONE_EVENT_PATH=initial-consults/initial-consult-stacie-phone
NUXT_PUBLIC_CALCOM_INITIAL_CONSULT_JAMES_PHONE_EVENT_PATH=initial-consults/initial-consult-james-phone
```

Retain the approved environment's complete site, portal and API public-origin configuration;
this booking-only block is not a complete deployment environment. Generate a coherent full site
with `npm run generate` and verify its sitemap with `npm run verify:sitemap` when the approved
candidate is built. Both commands exist in this repository. Avoid a route-only HTML/chunk upload:
Home/About client navigation must load the same approved booking code as a direct visit.
Preserve current server authentication and non-generated files.

The resolver rejects missing/malformed published pairs, duplicate paths or an invalid mode with
an unavailable state; it does not fall back to a mixed event. Separate mode mounts no calendar
until the customer chooses a method. Neither this configuration nor an iframe proves native
phone validation, a calendar write, Zoom creation, payment or delivery.

## Eight-route verification sheet

Fill actual checked time, environment and evidence for each row after authorized conversion.
All rows require 30 minutes / $60 USD / Stripe collect on booking / refund 2 calendar days;
Name, Email and State required, Notes and SMS optional, SMS unchecked, email reminders retained.

| Choice / method | Expected native path | Expected host pool | Required phone collection |
| --- | --- | --- | --- |
| First Available / Zoom | initial-consults/initial-consult | Taj, Stacie, James | One visible required universal phone; Zoom sole location |
| First Available / Phone | initial-consults/initial-consult-phone (7352991) | Taj, Stacie, James | One required native attendee-phone location; universal phone hidden/optional |
| Taj / Zoom | initial-consults/initial-consult-taj | Taj | One visible required universal phone; Zoom sole location |
| Taj / Phone | initial-consults/initial-consult-taj-phone (7353022) | Taj | One required native attendee-phone location; universal phone hidden/optional |
| Stacie / Zoom | initial-consults/initial-consult-stacie | Stacie | One visible required universal phone; Zoom sole location |
| Stacie / Phone | initial-consults/initial-consult-stacie-phone (7353030) | Stacie | One required native attendee-phone location; universal phone hidden/optional |
| James / Zoom | initial-consults/initial-consult-james | James | One visible required universal phone; Zoom sole location |
| James / Phone | initial-consults/initial-consult-james-phone (7353046) | James | One required native attendee-phone location; universal phone hidden/optional |

Original direct events currently use Load balancing; prepared Phone events use Maximize availability.
First Available uses Maximize availability. Preserve these recorded choices unless a specific
change is approved. Separate events may not share distribution counters or limits; no fairness
guarantee is inferred. Each direct route has its sole matching host at medium priority.

## Controlled activation order — requires release approval

1. Capture rollback snapshots and confirm the exact approved artifact/environment. Use an agreed
   maintenance window because native-provider and static-site changes are not atomic. Prepare the
   booking-unavailable website state and a plan to close native windows if a pause is needed;
   hiding an event does not block old direct links. Record existing appointments and notice scopes
   in restricted operations views without exporting personal data here.
2. Convert only the four active existing mixed events to Zoom-only using the snapshot/diff:
   retain visible required universal phone and required fields; remove attendee-phone location;
   align descriptions with Zoom instructions. Preserve 30m/$60, two-calendar-day rule,
   attendee-only rescheduling, same-host restriction, standard emails and current hours/limits.
   Jessica remains paused. Existing bookings are not migrated by cancellation/rebooking.
3. Open the four prepared Phone events only during that approved window: change the temporary
   September 16 closed range to the approved 14-calendar-day horizon, Always14 unchecked;
   retain 2h notice, pre-buffer 0/post-buffer 15m and default schedules. Verify exact host pools,
   single required location phone, price/refund/copy/roles and saved persistence. Publish according
   to the approved release plan. Do not open unrelated hidden test events.
4. Deploy the coherent approved full-site artifact with the eight-path candidate and separate mode.
   Confirm build/manifest identity, production origins and direct plus Home/About client navigation.
   Only the authorized operator executes provider conversion and deployment.
5. Complete the eight-row sheet without creating bookings: desktop/mobile, keyboard method choice,
   no iframe before choice, one iframe afterward, correct path/method, retained consultant on method
   change, retained method on consultant change, Jessica absent, one required phone, required email,
   unchecked optional SMS, correct native price/copy and equivalent UTC starts across viewer zones.
   Rendering/constraints are not server-submit or paid lifecycle acceptance. Notification-generating
   submissions require a separately approved exact scenario and recipients; user final payment/refund.
6. Verify preservation: production email workflows 450309/450313 each retain original five plus
   four Phone links (nine total, future-event application off); controlled 473280/473288 retain only
   original Stacie T3; all four SMS workflows inactive. Preserve T3 and its scheduled reminders,
   all existing confirmed appointments, Jessica pause and unrelated hidden test settings.
   Record actual evidence and unresolved exceptions before declaring acceptance; no automatic Done.

## Rollback and stop conditions

Stop if a route points to the wrong host/method, duplicates phone inputs, omits required phone/email,
offers a wrong amount, exposes Jessica or loses a reminder binding. James's existing unusable Zoom
is the recorded owner-deferred exception, not a new preparation stop or a working-Zoom claim.
Carry that known issue and the three exceptions into the release record. Production still requires
a separate user release instruction; assess release stops against that instruction and its recorded
exceptions. A new Zoom failure outside the recorded exception remains a stop condition.
Use the agreed booking pause while restoring the recorded full website artifact/public configuration
and original four mixed native snapshots, then close the four new Phone windows. A mode-only
rollback leaves existing Zoom-only links without Phone; a website-only pause leaves old native links
bookable. Verify all restored settings and old-route behavior before reopening.

Preserve any newly created Phone appointments and their notifications even if their event window
is closed. Do not cancel/refund bookings, revoke Zoom/calendar access or globally disable reminders
as rollback shortcuts. Test-record cancellation, old-link invalidation and test-window cleanup are
separate controlled work, not implicitly included in release or rollback.

## Evidence and limits

Source-derived keys, pair mapping, explicit choice/unavailable behavior and full-site delivery lesson
are checked against existing code and [method preparation](initial-consult-method-routing-2026-10-05.md)
and [staging refresh](initial-consult-staging-refresh-2026-10-05.md). Saved provider configuration
and former source/browser checks remain dated evidence. This sheet adds execution precision;
it does not rerun those checks or claim live activation, $60 payment, cutoff/DST enforcement,
calendar conflicts, reminder delivery, internal cleanup flag or broad concurrency acceptance.
