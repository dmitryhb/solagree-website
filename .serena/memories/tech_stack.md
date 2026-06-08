# Tech Stack

- Nuxt 4 + Vue 3, TypeScript, ESM (`"type": "module"`).
- UI/style: Nuxt UI 4, Tailwind CSS 4, Sass available.
- Package manager in this repo: npm with `package-lock.json`.
- Important scripts: `npm run dev` starts Nuxt on `solagree.local:3003`; `npm run lint` runs ESLint; `npm run typecheck` runs `nuxt typecheck`.
- The portal repo uses pnpm, PostgreSQL, Nuxt server routes, and forward-only SQL migrations under `server/database/migrations`.