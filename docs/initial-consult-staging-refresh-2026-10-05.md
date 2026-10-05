# Initial Consult staging refresh — October 5, 2026

HIR-246 → HIR-248 → HIR-249 → HIR-250; HIR-609 remains the publication dependency.
This record supersedes earlier staging-access and deployed-copy snapshots, within the scope below.
It is not launch acceptance. Production, public Cal.com method conversion and Done remain gated.

## Approved scope and artifact

The user merged [PR #6](https://github.com/dmitryhb/solagree-website/pull/6) into develop
`d4f344efd988650b6e4492d0443749a9f7ed0336`, restored staging browser access, then explicitly
approved a full staging refresh of that reviewed build. No new implementation was needed.
Original source review/full lint/typecheck/focused tests remain PASS; equivalent checks were not repeated.

Before refresh, independent live QA confirmed First Available/Taj/Stacie/James, Jessica absent,
four correct native iframe routes and desktop/mobile layout. The deployed policy still promised
48 hours. Server HTML independently contained old 48-hour copy and no accepted calendar-day copy.
A route-only upload was rejected in independent operational review: untouched Nuxt routers can
load old booking code through client navigation. A coherent full-site staging build was prepared.

`npm run generate` (including resource validation) and sitemap verification passed. Website,
portal and portal API public origins target Solagree staging; native Cal.com origin/routes remain
unchanged. Runtime stays `mixed`, with Jessica unpublished and the existing
four active Cal.com paths. No separate-mode activation, Phone opening or old event location switch.

Generated build ID: `16aebcdd-7386-4e83-b52a-fcd40ead0452`.
Booking HTML SHA-256: `e59cefb3b0413e2689888c9a013d67d016d6ca3c8fb80821f7abaa6f184cd8b6`.

## Delivery and preservation

Independent operational review PASS for the revised whole-staging plan; reusable memory: none.
The complete previous webroot was archived outside the served directory, with a checksum manifest;
the archive listing was checked. Inventory contained no symlinks. Authentication configuration
was excluded from upload and its checksum remained unchanged; no contents were exposed.

Delivery used `rsync -az --delay-updates --exclude=/.htaccess`, without deletion, from the exact
generated output to staging. Generated HTML/payload/chunks/fonts/build metadata were updated
together. Existing non-generated files and old unreferenced assets were retained. The upload is
not atomic; delayed updates reduced the brief mixed-file window.

Remote verification PASS: all 299 expected generated files matched local SHA-256 values, no
preservation failures for previous non-generated files, unchanged authentication, matching booking
HTML and new build metadata. Full rollback archive and before/after manifests remain in the
restricted staging home directory, outside `public_html`; no account secrets or personal data are
included in this repository record.

Root browser smoke confirms the updated two-calendar-day cancellation wording and one
complimentary manual reschedule request, plus a real loaded First Available iframe.
Independent after-refresh live QA (GPT-6.1-Sol, medium) PASS: direct booking load and visible
Home/About → Schedule a consultation client navigation both show the accepted copy, with no
48-hour wording. Each of First Available/Taj/Stacie/James loads exactly one actual native iframe
at its corresponding existing Cal.com path. Jessica is absent; mixed mode is retained. Desktop
1728px and mobile 390px have no page overflow. Temporary viewport was reset and the QA tab closed.
No contacts, slots or booking submissions were made. Safe before/after calendar screenshots are
kept outside tracked source, without contact details or booking/payment tokens.

## Acceptance bounds and remaining actions

| Criterion | Code / build | Services / deployed UI | Remaining action |
| --- | --- | --- | --- |
| Approved website policy | Reviewed source PASS; generated copy has 2 calendar days/manual request and no 48-hour promise | Artifact hashes, root smoke and independent direct/Home/About client-navigation QA PASS | Production release and native boundary/refund evidence remain separate |
| Active roster and native routing | Prior independent source QA PASS | After-refresh real four-route/desktop/mobile independent QA PASS | Production release and actual native booking lifecycle remain separate |
| Separate Phone/Zoom choice | Reviewed implementation and fixture QA PASS | Four prepared Phone events remain closed; staging remains mixed | Coordinated separately authorized provider/runtime release; actual native Phone submission/number propagation |
| Calendar, Zoom, communications, payment lifecycle | Website does not create native meetings or charges | Prior paid Taj/Stacie evidence and Stacie client attestation retained | Free James recipients/scenario now approved; required form fields and user Confirm pending. Reminders, negative checkout/retry/concurrency, paid manual reschedule/refund boundaries still open |

No booking, confirmation send, payment, refund, cancellation or production deployment occurred
during this refresh. Existing paid Stacie booking and scheduled reminder bindings were preserved.
The complimentary James test does not count as paid acceptance. The client calendar-day draft
remains prepared and unsent in the [main acceptance packet](initial-consult-acceptance-2026-10-05.md).

If acceptance fails, restore the complete previous webroot from its restricted archive, preserving
authentication and any files added externally after the snapshot. No booking cancellation, refund,
integration revocation or Cal.com event change is part of website rollback.
