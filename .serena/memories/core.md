# Core

- Solagree public marketing website at `/Users/dmitry/work/solagree/website`.
- Nuxt 4 app source is under `app/`; supporting docs under `docs/`; deployment/config scripts under `scripts/` and `config/`.
- Website integrates with the portal API via `NUXT_PUBLIC_PORTAL_API_BASE_URL`, appending route paths itself. Keep the env value as the portal origin, not `/api`.
- Related portal/API/admin repo is `/Users/dmitry/work/solagree/portal`; portal hosts public form APIs consumed by this website.
- For tech/build details read `mem:tech_stack`. For commands read `mem:suggested_commands`. For style read `mem:conventions`. For task closeout read `mem:task_completion`.