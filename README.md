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

Start the development server on `http://localhost:3003`:

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
- [Solagree quiz host contract](docs/solagree-quiz-host-contract.md)

## Portal API integration

The attorney application form submits to the Solagree Portal API.

```bash
NUXT_PUBLIC_PORTAL_API_BASE_URL=http://localhost:3001
```

Configure `NUXT_PUBLIC_PORTAL_API_BASE_URL` as the Portal application origin, not the
individual API route. The website app appends the API path itself.

Correct local configuration:

```bash
NUXT_PUBLIC_PORTAL_API_BASE_URL=http://localhost:3001
```

Incorrect configuration:

```bash
NUXT_PUBLIC_PORTAL_API_BASE_URL=http://localhost:3001/api
NUXT_PUBLIC_PORTAL_API_BASE_URL=http://localhost:3001/api/attorney-applications
```

With the correct value, the attorney application form submits to:

```text
${NUXT_PUBLIC_PORTAL_API_BASE_URL}/api/attorney-applications
```

For local development:

- Run the website on `http://localhost:3003`.
- Run the portal on `http://localhost:3001`.
- Set `NUXT_PUBLIC_PORTAL_API_BASE_URL=http://localhost:3001` in the website `.env`.
- Ensure the portal allows the website origin through `PUBLIC_ATTORNEY_APPLICATION_ALLOWED_ORIGINS`, for example `http://localhost:3003,http://127.0.0.1:3003`.

For production, set `NUXT_PUBLIC_PORTAL_API_BASE_URL` to the public Portal origin that serves the Nitro API routes. If the website calls the Portal from a different origin, the Portal must include the website origin in `PUBLIC_ATTORNEY_APPLICATION_ALLOWED_ORIGINS`.

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
