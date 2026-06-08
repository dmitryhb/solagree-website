# Suggested Commands

- Install website deps: `npm install`.
- Run website locally: `npm run dev` (host `solagree.local`, port `3003`).
- Build website: `npm run build`; generate static output: `npm run generate`; preview: `npm run preview`.
- Website quality checks: `npm run lint`; `npm run typecheck`.
- Focused ESLint for changed files: `npx eslint app/components/ExampleComponent.vue app/utils/example.ts`.
- Related portal repo: use `pnpm` commands there, especially `pnpm lint`, `pnpm typecheck`, `pnpm db:migrate`, and `pnpm db:migrate:status`.