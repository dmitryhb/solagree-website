# Phase 2 staging candidate

HIR-275, prepared 2026-09-17. Website `hir-275` combines develop `86b8bf3` with webinar branch `94fe074`. Jessica remains unpublished by default; existing Initial Consult routes and consultant publishing controls are retained.

The authoritative joint launch/rollback checklist is Portal `docs/phase-2-release-checklist.md`. Deploy its reviewed Portal counterpart first so the public webinar API and migration exist before this Website build. Configure `NUXT_PUBLIC_PORTAL_API_BASE_URL`, Portal CORS, static fallback and nginx noindex using `docs/webinars.md`. Preserve staging BasicAuth.

Local verification: 352 Vitest tests, 38 Node tests, 2 webinar browser tests and 3 Initial Consult browser tests passed. Lint, typecheck, static generation, sitemap (26 URLs) and nginx configuration verification passed. Browser provider calls were mocked/aborted; real calendar/Zoom and recording-provider acceptance remain separate. Use worktree-local dependencies (`npm ci`) to avoid sharing Nuxt build caches across checkouts.

Record final Website and Portal commits/build hashes in the deployment record. This candidate has not been merged into develop, pushed or deployed. The prior Website staging release already includes Jessica's pause. On rollback, restore Website before a Portal version that lacks the new catalogue contract, and verify the booking pause remains in both Website and Cal.com configuration.
