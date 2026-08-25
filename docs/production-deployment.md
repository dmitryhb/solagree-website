# Website production deployment

The website is deployed as static Nuxt output (`npm run generate`) to the production server at `15.204.253.205`.

## TL;DR

```bash
cd website
npm run deploy:production
```

The script will:

1. Run `nuxt generate` with the production env baked in
   - `NUXT_PUBLIC_SITE_URL=https://www.solagree.com`
   - `NUXT_PUBLIC_PORTAL_URL=https://portal.solagree.com`
   - `NUXT_PUBLIC_PORTAL_API_BASE_URL=https://portal.solagree.com`
   - `NUXT_PUBLIC_GA_MEASUREMENT_ID=G-TCGL2PDNNY`
2. `rsync -avz --delete` `.output/public/` to `/home/solagree/public_html/` (via `sudo -n rsync` over SSH as `ubuntu`)
3. Re-`chown solagree:solagree`
4. Install `config/nginx/legacy-redirects.conf` to `/etc/nginx/snippets/solagree-legacy-redirects.conf` and `config/nginx/co-branded-noindex.conf` to `/etc/nginx/snippets/solagree-co-branded-noindex.conf`, ensure both are included in the `www.solagree.com` server block, run `nginx -t`, and reload nginx
5. Probe `https://www.solagree.com/go/__co-branded-route-check__` and `https://www.solagree.com/cdfa/go/__co-branded-route-check__` (against the server IP via `--resolve`, since DNS isn't pointed yet) to ensure the nginx SPA fallback is intact and the responses carry `X-Robots-Tag: noindex, nofollow`

Flags:

- `--dry-run` — skip the rsync write
- `--skip-build` — reuse existing `.output/public/`
- `--skip-route-check` — don't probe `/go/*` and `/cdfa/go/*` after upload

Overridable env vars: `SSH_USER`, `SSH_HOST`, `REMOTE_PATH`, `REMOTE_OWNER`, `ROUTE_CHECK_HOST`, `ROUTE_CHECK_RESOLVE_IP`, `NUXT_PUBLIC_GA_MEASUREMENT_ID`.

## nginx

`/etc/nginx/sites-available/solagree-website` defines:

- HTTP→HTTPS redirect (with `/.well-known/acme-challenge/` carve-out for future certbot)
- `https://www.solagree.com` root → `/home/solagree/public_html`, with SPA fallback `try_files $uri $uri/ /200.html;` so dynamic Nuxt paths (`/go/:slug`, `/cdfa/go/:slug`) work after a static deploy
- legacy pre-Nuxt URLs → 301 redirects via `/etc/nginx/snippets/solagree-legacy-redirects.conf`
- `X-Robots-Tag: noindex, nofollow` response headers for `/go/*` and `/cdfa/go/*` via `/etc/nginx/snippets/solagree-co-branded-noindex.conf`
- `https://solagree.com` → 301 to `https://www.solagree.com`
- `_nuxt/*` immutable cache headers
- TLS via `/etc/nginx/snippets/solagree-ssl.conf` (currently the self-signed cert at `/etc/ssl/solagree/`; flip to Let's Encrypt on DNS cutover)

After syncing static files, the production deploy script uses one SSH session to
re-apply ownership, install `config/nginx/legacy-redirects.conf` to
`/etc/nginx/snippets/solagree-legacy-redirects.conf` and
`config/nginx/co-branded-noindex.conf` to
`/etc/nginx/snippets/solagree-co-branded-noindex.conf`, ensure the
`www.solagree.com` server block includes both before the SPA fallback, test
nginx, and reload it. It then verifies that `/about/` returns a true HTTP 301 to
`/about-us`, and that the co-branded route probes carry the noindex header.

The `www.solagree.com` server block must include both snippets before the SPA
fallback:

```nginx
include /etc/nginx/snippets/solagree-legacy-redirects.conf;
include /etc/nginx/snippets/solagree-co-branded-noindex.conf;

location / {
    try_files $uri $uri/ /200.html;
}
```

Note: nginx `add_header` directives on a `location` block replace inherited
`server`-level `add_header` directives for that location. If security headers
are later added at the `server` level, repeat them inside the co-branded
`location` blocks from the snippet.

## Dynamic URLs cannot return a true HTTP 404

The site is fully static (`nuxt generate` + rsync) and nginx serves every
dynamic path — including unknown `/go/:slug` and `/cdfa/go/:slug` URLs — from
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
- `robots.txt` intentionally contains **no** `Disallow` rules for `/go/` or
  `/cdfa/go/`: crawlers must be able to fetch these URLs to see the noindex
  signal. A robots.txt disallow would prevent crawling but would not remove
  already-indexed URLs, so it is not a substitute for noindex.
- The only way to serve a true HTTP 404 (or indexable partner pages) for these
  routes is to add a server/prerender source of valid slugs (for example,
  prerendering published slugs at build time or running SSR) — explicitly out
  of scope for the current architecture.

## Pre-DNS testing

```
# /etc/hosts on your laptop
15.204.253.205  www.solagree.com solagree.com
```

Browser will warn on the self-signed cert; accept once for the smoke test.

See `portal/docs/production-deployment.md` for the full environment + DNS cutover checklist.
