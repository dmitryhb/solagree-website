# Conventions

- Prefer existing Nuxt/Vue component and composable patterns already under `app/`; avoid introducing new backend layers from the website side.
- Website public form submissions to portal APIs must use the portal origin from `NUXT_PUBLIC_PORTAL_API_BASE_URL` and append route paths in app code.
- Keep admin/direct intake and co-branded route behavior aligned with documented portal contracts in `README.md`.
- Code quality expectation before handoff is ESLint plus Nuxt typecheck. Use focused ESLint during iteration when practical.