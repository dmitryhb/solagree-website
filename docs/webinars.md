# Webinar catalogue (HIR-255)

`/webinars` reads the public Portal catalogue at runtime, so Anne's edits do not require a website rebuild. `/webinars/:id` shows the event and reuses the branded lead form for on-demand access. The Resources navigation points to the catalogue. Existing `/webinar`, `/webinar/view`, `/webinar/cdfa` and `/webinar/cdfa/view` retain their original behavior.

Configure `NUXT_PUBLIC_PORTAL_API_BASE_URL` and allow the website origin in Portal CORS. The static host needs its existing `try_files $uri $uri/ /200.html` fallback for event detail routes. The catalogue has a canonical URL and sitemap entry. Individual dynamic event metadata updates in the browser; a static deployment cannot emit fresh event HTML/HTTP 404 responses without a rendering service. No restricted event or recording is baked into website output.

The catalogue API returns only public metadata. Live actions go through the Portal's checked Zoom redirect. A valid branded form submission to `/api/public/webinars/:id/access` creates an event-linked registration and returns a short-lived Portal recording path. Tokens stay in memory, never local storage. The recording route must recheck current visibility and availability on every request. Embedding depends on the final video provider; the page includes a new-tab fallback. Provider-level access restrictions are needed to prevent sharing a provider URL after an authorized viewer reaches it.

HIR-259 owns registration email delivery and complete HubSpot lifecycle. HIR-255 does not send those emails or replace Zoom's native registration/reminders. Existing legacy lead flows stay functional.

Verify catalogue loading/error/empty states, live Zoom CTA, past events without recordings, on-demand lead capture and player fallback, keyboard navigation, mobile layout, legacy URLs, and Portal rejection of Partner-Only IDs. Provider delivery and restricted hosting settings require separate live acceptance.
