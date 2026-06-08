# Task Completion

- For website changes, run `npm run lint` and `npm run typecheck` before handoff.
- For cross-repo changes involving `/Users/dmitry/work/solagree/portal`, validate portal with `pnpm typecheck` and either focused ESLint on changed files or `pnpm lint` if the scope is broad.
- If portal DB schema changes, verify forward-only migrations with `pnpm db:migrate:status` and/or `pnpm db:migrate` against the configured local database where available.
- Leave deployment commands to explicit user request unless task scope requires deployment verification.