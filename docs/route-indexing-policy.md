# Static route indexing policy

This table covers the route families protected by the HTTP noindex snippet and
the public routes whose location precedence it must preserve. The sitemap is an
explicit allowlist in `app/data/sitemap-routes.ts`, not a list of every route.

| Route family | Sitemap | Initial HTTP `X-Robots-Tag` | Static response or fallback |
| --- | --- | --- | --- |
| `/go/*`, `/cdfa/go/*` (including embeds) | Excluded | `noindex, nofollow` | Existing file/directory, otherwise named SPA fallback serving `/200.html` |
| `/webinars/*` event details | Excluded | `noindex, nofollow` | Existing file/directory, otherwise named SPA fallback serving `/200.html` |
| `/meet/*` (including `/meet/:slug/thank-you`) | Excluded | `noindex, nofollow` | Existing file/directory, otherwise named SPA fallback serving `/200.html` |
| Exact `/webinars` catalogue | Included | Absent | `/webinars/index.html`; exact `/webinars/` redirects to `/webinars` |
| Canonical public/legal routes | Included when allowlisted | Absent | Existing generated file/directory; ordinary SPA fallback for unmatched paths |
| Legacy redirects | Excluded | Absent | Existing exact/prefix/regex rules in `config/nginx/legacy-redirects.conf`; `/c/*` redirects to `/meet/*` |
| `/site-map`, `/site-map/` | Excluded | Absent | Server-only 301 to `/sitemap.xml`; deliberately excluded from client redirect parity |

The HTTP header is authoritative before hydration. Intake forms and thank-you
pages remain non-indexable even if they gain prerendered files. With no valid
slug inventory at build time, unknown dynamic slugs still return a noindexed
HTTP 200 fallback. A missing `/200.html` instead fails closed with HTTP 404 and
the noindex header. Client-rendered errors do not change the initial HTTP status.

Nginx normalizes paths before matching locations, so encoded and duplicate-slash
aliases receive the same policy. Queries do not change the match. Each dynamic
`^~` location sets the existing marker, and the named fallback retains it without
restarting server rewrite processing. The output header stays at server scope
so inherited BasicAuth and security headers survive. Do not block these families
in `robots.txt`: crawlers need to fetch them to read the header.

The nginx snippet remains handwritten. Generating these small location rules
would add a second representation and a deployment step without reducing the
maintenance burden. Its fast verifier enumerates the protected prefixes, while
runtime tests exercise representative requests independently of that list.

Checks:

```bash
npm run verify:co-branded-noindex-nginx
npm run test:co-branded-noindex-nginx
npm run test:sitemap
npm run generate
npm run verify:sitemap
```

The runtime test starts an isolated `nginx:1.27-alpine` Docker container with both
tracked snippets and static fixtures. It checks first-response headers without
following redirects, named and directory-index internal redirects, missing
slugs, trailing slashes, queries, normalized aliases, auth failures, missing
fallback files, and representative catalogue/legal/legacy location precedence.
It skips when Docker is unavailable, so a skipped runtime test is not HTTP
acceptance evidence. HIR-605's existing tests own the complete redirect parity
matrix. No live nginx configuration or deployment is changed by these checks.
