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

## Portal API integration

The attorney application form submits to the Solagree Portal API.

```bash
NUXT_PUBLIC_PORTAL_API_BASE_URL=http://localhost:3001
```

The portal must allow the website origin through `PUBLIC_ATTORNEY_APPLICATION_ALLOWED_ORIGINS`.

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
