# Solagree Website

Public Solagree marketing website built with Nuxt.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://solagree.local:3003`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Project Docs

- [API patterns](docs/api-patterns.md)
- [Code style](docs/code-style.md)
- [Solagree quiz host contract](docs/solagree-quiz-host-contract.md)

## Code Quality

Run ESLint before handing work to review:

```bash
npm run lint
```

For a focused pass on locally changed Vue and TypeScript files, pass file paths
directly to ESLint:

```bash
npx eslint app/components/ExampleComponent.vue app/utils/example.ts
```

## Portal API integration

The attorney application and Solagree consult forms submit to the Solagree Portal API.
The header login link points to the Solagree Portal web app.

```bash
NUXT_PUBLIC_PORTAL_URL=http://solagree-portal.local:3004
NUXT_PUBLIC_PORTAL_API_BASE_URL=http://solagree-portal.local:3004
```

Configure `NUXT_PUBLIC_PORTAL_URL` as the Portal application origin used for
browser navigation. The header appends `/login` to this origin.

Configure `NUXT_PUBLIC_PORTAL_API_BASE_URL` as the Portal application origin, not the
individual API route. The website app appends the API path itself.

Correct local configuration:

```bash
NUXT_PUBLIC_PORTAL_URL=http://solagree-portal.local:3004
NUXT_PUBLIC_PORTAL_API_BASE_URL=http://solagree-portal.local:3004
```

Incorrect configuration:

```bash
NUXT_PUBLIC_PORTAL_API_BASE_URL=http://solagree-portal.local:3004/api
NUXT_PUBLIC_PORTAL_API_BASE_URL=http://solagree-portal.local:3004/api/attorney-applications
```

With the correct value, the attorney application form submits to:

```text
${NUXT_PUBLIC_PORTAL_API_BASE_URL}/api/attorney-applications
```

The consult request form submits to:

```text
${NUXT_PUBLIC_PORTAL_API_BASE_URL}/api/consult-requests
```

For local development:

- Add `127.0.0.1 solagree.local solagree-portal.local` to `/etc/hosts`.
- Run the website on `http://solagree.local:3003`.
- Run the portal on `http://solagree-portal.local:3004`.
- Set `NUXT_PUBLIC_SITE_URL=http://solagree.local:3003` in the website `.env`.
- Set `NUXT_PUBLIC_PORTAL_URL=http://solagree-portal.local:3004` in the website `.env`.
- Set `NUXT_PUBLIC_PORTAL_API_BASE_URL=http://solagree-portal.local:3004` in the website `.env`.
- Ensure the portal allows the website origin for public form API requests, for example `http://solagree.local:3003,http://localhost:3003,http://127.0.0.1:3003`.

For production, set `NUXT_PUBLIC_PORTAL_URL` to the public Portal web origin and `NUXT_PUBLIC_PORTAL_API_BASE_URL` to the public Portal origin that serves the Nitro API routes. If the website calls the Portal from a different origin, the Portal must include the website origin in the public form allowlist configuration.

For staging deployment, `npm run deploy:staging` defaults to:

```bash
NUXT_PUBLIC_SITE_URL=https://solagree.qamachine.com
NUXT_PUBLIC_PORTAL_URL=https://solagree-portal.qamachine.com/
NUXT_PUBLIC_PORTAL_API_BASE_URL=https://solagree-portal.qamachine.com/
```

These values are exported before `nuxt generate` so the generated static website sends attorney application and consult requests to:

```text
https://solagree-portal.qamachine.com/api/attorney-applications
https://solagree-portal.qamachine.com/api/consult-requests
```

## Co-branded partner pages

Published co-branded partner pages are served by the website under:

```text
/go/:slug
/go/:slug/embed
```

The website fetches page data from the Portal public API:

```text
${NUXT_PUBLIC_PORTAL_API_BASE_URL}/api/public/co-branded-pages/:slug
```

Because the staging website deploys as static Nuxt output, nginx must route
dynamic paths to Nuxt's generated fallback file. The staging website server block
must include:

```nginx
location / {
    try_files $uri $uri/ /200.html;
}
```

`npm run deploy:staging` checks this after upload by requesting a `/go/...`
route and fails if nginx still returns `404`. Use `--skip-route-check` only when
the server fallback is being changed separately.

The staging Portal `.env` must allow the website origin for public form submissions:

```bash
PUBLIC_ATTORNEY_APPLICATION_ALLOWED_ORIGINS=https://solagree.qamachine.com,https://www.solagree.com,https://solagree.com
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
