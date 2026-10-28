# Website production deployment

The website is deployed as static Nuxt output (`npm run generate`) to the production server at `15.204.253.205`.

## Release mechanism

Production uses the verified immutable promotion and rollback mechanism in
[Website artifact promotion](website-artifact-promotion.md). Read its prepared-host
prerequisites and separately approved legacy-directory conversion plan first.
The scripts refuse an unconverted real-directory webroot.

The script runs fixed lint, typecheck, test, local nginx/browser and generation
gates, requires their artifact-bound proof, uploads a private candidate, verifies
its bytes and HTTP contract, then atomically replaces the webroot symlink. A
failed public check restores the previous symlink under the release lock. No
static deploy installs snippets, changes ownership recursively, or reloads nginx.

`--skip-build` requires the complete matching proof. `--dry-run` reads the target
inventory without uploading. `--inspect` reads it without requiring local output.
`--rollback=<retained-release-id>` restores a verified artifact without rebuilding.
`--skip-route-check` is rejected. Public URL/Portal environment and GA policies
remain mandatory. SSH destinations and webroots are fixed to the reviewed host.

After live-release authorization and host conversion, use the commands and
inventory-pin/writer-hold procedure in the mechanism runbook. Do not use the old
active-directory rsync or directory-rename procedure.

## nginx

`/etc/nginx/sites-available/solagree-website` defines:

- HTTP→HTTPS redirect (with `/.well-known/acme-challenge/` carve-out for future certbot)
- `https://www.solagree.com` root → `/home/solagree/public_html`, with SPA fallback `try_files $uri $uri/ /200.html;` so dynamic Nuxt paths (`/go/:slug`, `/cdfa/go/:slug`, `/webinars/:id`) work after a static deploy
- legacy pre-Nuxt URLs → 301 redirects via `/etc/nginx/snippets/solagree-legacy-redirects.conf`
- `X-Robots-Tag: noindex, nofollow` response headers for `/go/*`, `/cdfa/go/*`, and `/webinars/*` via `/etc/nginx/snippets/solagree-co-branded-noindex.conf`; exact `/webinars` stays indexable
- `https://solagree.com` → 301 to `https://www.solagree.com`
- `_nuxt/*` immutable cache headers
- TLS via `/etc/nginx/snippets/solagree-ssl.conf` (currently the self-signed cert at `/etc/ssl/solagree/`; flip to Let's Encrypt on DNS cutover)

The snippets are an operator-managed hosting prerequisite. Their installation,
configuration backup, `nginx -t` and reload require a separately reviewed hosting
change. The immutable release helper uses private loopback nginx for candidate
validation and checks the public `/about/` redirect plus dynamic route contract
before/after activation. It never edits the public nginx site configuration.

The `www.solagree.com` server block must include both snippets before the SPA
fallback:

```nginx
include /etc/nginx/snippets/solagree-legacy-redirects.conf;
include /etc/nginx/snippets/solagree-co-branded-noindex.conf;

location / {
    try_files $uri $uri/ /200.html;
}
```

The noindex snippet sets a marker in each normalized dynamic location and adds
its `X-Robots-Tag` header at `server` scope. Nginx normalizes escaped path
characters before choosing a location, so this covers canonical paths and
aliases such as `/%67o/example`, `/cdfa/%67o/example`, and
`/web%69nars/example`. Dynamic misses enter the snippet's named fallback,
which serves `/200.html` without restarting server rewrite processing or
clearing the marker. Keeping the output header at server scope keeps inherited
BasicAuth and security headers intact. The exact `/webinars` catalogue and its
`/webinars/` canonical redirect do not enter a dynamic location and remain
indexable. The snippet initializes the marker unconditionally, so ordinary
pages plus direct, encoded, and duplicate-slash aliases of `/200.html` emit no
robots header and no uninitialized-variable warning.

## Dynamic URLs cannot return a true HTTP 404

The site is fully static (`nuxt generate` + rsync) and nginx serves every
dynamic path — including unknown `/go/:slug`, `/cdfa/go/:slug`, and `/webinars/:id` URLs — from
the universal `/200.html` fallback with **HTTP 200**. There is no per-slug
static HTML and no runtime server that knows the valid slug set, so:

- Dynamic missing URLs **cannot** return a true HTTP 404 under static hosting.
  They can only return a **noindexed soft-404**: HTTP 200 with
  `X-Robots-Tag: noindex, nofollow` in the initial response, noindex meta after
  hydration, and the site's 404 page rendered client-side once the Portal
  confirms the slug is missing (upstream Portal failures render the site error
  page with their own status code instead of masquerading as 404).
- Because the shared `/200.html` shell is generated for another route, the
  in-app meta robots value alone is not crawler-visible on the initial
  response; the nginx `X-Robots-Tag` response header is the authoritative
  initial noindex signal for these URL families and requires no hydration.
- `robots.txt` intentionally contains **no** `Disallow` rules for `/go/`,
  `/cdfa/go/`, or `/webinars/`: crawlers must be able to fetch these URLs to see the noindex
  signal. A robots.txt disallow would prevent crawling but would not remove
  already-indexed URLs, so it is not a substitute for noindex.
- The only way to serve a true HTTP 404 (or indexable partner pages) for these
  routes is to add a server/prerender source of valid slugs (for example,
  prerendering published slugs at build time or running SSR) — explicitly out
  of scope for the current architecture.

The `/webinars` catalogue is a generated, indexable landing page. The nginx
snippet serves it from `/webinars/index.html`, redirects `/webinars/` to the
canonical path, and applies noindex only to event detail paths, including
paths with query strings. Event detail metadata updates in the browser and is
intentionally excluded from indexing.

## Pre-DNS testing

```
# /etc/hosts on your laptop
15.204.253.205  www.solagree.com solagree.com
```

Browser will warn on the self-signed cert; accept once for the smoke test.

See `portal/docs/production-deployment.md` for the full environment + DNS cutover checklist.

## Artifact gate (HIR-617)

Both scripts validate the staging or production destination before generation
and before any upload, including with `--skip-build` and `--dry-run`. Public
site and Portal overrides must be HTTPS origins matching the named target;
paths, query strings, credentials and destinations belonging to another
environment are rejected. Trailing slashes are accepted and normalized.

`npm run generate` under the deployment script writes
`.output/public/release-manifest.json` with the source commit, deployment
environment, site origin, Portal URL/API origin, GA policy and SHA-256 hashes
for every generated file. Reusing output requires a manifest matching the
current commit and target policy, and an unchanged complete artifact. A build
from another commit or environment must be regenerated through the target
script. The sitemap origin is checked against that same target even when
building is skipped. Normal local generation does not create a deployable
manifest unless an explicit staging/production environment is supplied.

The manifest is an accidental-mismatch and integrity guard for locally built
artifacts; it is not a signature or remote build attestation. HIR-624 adds a mandatory preflight proof and private candidate upload, with
verified atomic promotion and rollback; see the mechanism runbook above.

## Shared HTTP acceptance (HIR-618)

Both scripts delegate to `scripts/release-upload.mjs`, which uses the same
shared HTTP contract as `scripts/verify-deployed-routes.mjs` on the private
candidate before switching and on the public hostname after switching. Each dynamic
probe must return HTTP 200, `Content-Type: text/html`, an `X-Robots-Tag` carrying
both noindex and nofollow, and a body exactly matching the uploaded `200.html`.
The `/webinars` catalogue must return HTTP 200, its generated catalogue HTML,
and no noindex/none header. Redirects are not followed. Connection errors,
auth pages, proxy error bodies, and every 4xx/5xx response fail the check.
Responses are decoded for compression before comparing with the artifact.

Staging probes retain BasicAuth, passing the configured credentials to curl
through stdin rather than command arguments or logs. The production verifier
retains the pre-DNS `--resolve` and self-signed-certificate options. These
HTTP checks remain separate from the mandatory artifact/proof gate. Route
checks cannot be skipped. Local fixtures do not prove live server acceptance.

## Deployment analytics (HIR-619)

`NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT` is `dev`, `staging` or `production`;
missing means `dev`. Nuxt's `NODE_ENV=production` during static generation does
not select an analytics property. Both deploy scripts explicitly choose their
deployment environment. A missing, empty or whitespace-only
`NUXT_PUBLIC_GA_MEASUREMENT_ID` disables gtag scripts, GA events and the default
quiz/qualifier analytics policy in every environment. An explicitly selected
GA4 ID enables analytics without changing event names. To enable the approved
production property, run:

```bash
NUXT_PUBLIC_GA_MEASUREMENT_ID=G-TCGL2PDNNY npm run deploy:production
```

Staging should normally use the disabled default or an explicitly chosen
staging property. The manifest records the exact GA policy. The manifest writer
checks the serialized Nuxt fallback runtime values; verification rejects output
whose recorded policy differs from the current deployment invocation. Reusing
an enabled artifact with `--skip-build` requires the same explicit ID.

Focused evidence: `tests/deployment-analytics.test.mts` covers the nine
environment/ID combinations. The disabled staging browser test runs with all
external requests blocked and verifies that even a host-supplied gtag receives
no events. Neither test sends analytics to a real property.
