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
2. `rsync -avz --delete` `.output/public/` to `/home/solagree/public_html/` (via `sudo -n rsync` over SSH as `ubuntu`)
3. Re-`chown solagree:solagree`
4. Probe `https://www.solagree.com/go/__co-branded-route-check__` (against the server IP via `--resolve`, since DNS isn't pointed yet) to ensure the nginx SPA fallback is intact

Flags:

- `--dry-run` — skip the rsync write
- `--skip-build` — reuse existing `.output/public/`
- `--skip-route-check` — don't probe `/go/*` after upload

Overridable env vars: `SSH_USER`, `SSH_HOST`, `REMOTE_PATH`, `REMOTE_OWNER`, `ROUTE_CHECK_HOST`, `ROUTE_CHECK_RESOLVE_IP`.

## nginx

`/etc/nginx/sites-available/solagree-website` defines:

- HTTP→HTTPS redirect (with `/.well-known/acme-challenge/` carve-out for future certbot)
- `https://www.solagree.com` root → `/home/solagree/public_html`, with SPA fallback `try_files $uri $uri/ /200.html;` so dynamic Nuxt paths (`/go/:slug`) work after a static deploy
- `https://solagree.com` → 301 to `https://www.solagree.com`
- `_nuxt/*` immutable cache headers
- TLS via `/etc/nginx/snippets/solagree-ssl.conf` (currently the self-signed cert at `/etc/ssl/solagree/`; flip to Let's Encrypt on DNS cutover)

## Pre-DNS testing

```
# /etc/hosts on your laptop
15.204.253.205  www.solagree.com solagree.com
```

Browser will warn on the self-signed cert; accept once for the smoke test.

See `portal/docs/production-deployment.md` for the full environment + DNS cutover checklist.
