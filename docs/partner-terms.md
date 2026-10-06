# Approved Partner Terms — HIR-266

The user approved the [Solagree Partner Terms — Trademark License Agreement](https://docs.google.com/document/d/1cCHXwvmRI93q68FFY1RAZrI06sfO_46-VY2vRJ4eEdU/edit) for publication in the October 6, 2026 Phase 2 wave request. This approval applies to Partner Terms. The separate general website Terms of Service page is not replaced or approved by this change.

Authenticated Google Drive retrieval captured the native revision recorded in `public/legal/partner-terms/2026-10-06/manifest.json`. The hosted HTML preserves all paragraphs, both schedules, the licensed logo, and the Agreement's acceptance-based Effective Date. `docs/legal/partner-terms-2026-10-06.source.json` retains the original native structure; its temporary provider image URI is replaced with the locally captured logo reference.

## Immutable release artifact

- Document ID: `solagree-partner-terms`
- Version: `2026-10-06`
- Approved release URL: `https://solagree.com/legal/partner-terms/2026-10-06/`
- Artifact directory: `public/legal/partner-terms/2026-10-06/`

The manifest records artifact and native-source SHA-256 values. The approved-document test pins the artifact digests and compares every rendered paragraph against the captured source, including the schedules. Never edit this release directory after publication. Add a new directory, version, provenance record and tests for a subsequent approved agreement. Keep old directories available across deployments and rollback; a static hosting sync must not delete historical versions.

Attorney and CDFA applications read the Portal's current policy at runtime and submit the exact displayed version and URL with affirmative consent. They show Partner Terms, keep submission disabled when policy is unavailable, and reset the acknowledgment after a version conflict. The website never fabricates a version or acceptance.

## Verification and release

Implementation checks on the fresh October 6 candidate: 357 existing Vitest checks plus 2 approved-document checks, 41 Node checks, full lint/typecheck, the prescribed `pnpm build` entrypoint (including resource validation), and static generation of 81 routes passed. The first generation attempt used shared checkout dependencies and failed on Nuxt cache path resolution; checkout-local `npm ci` resolved that environmental failure.

The companion Portal runbook `docs/professional-terms.md` owns migrations, configuration, acceptance audit, browser scenarios and rollback. The release URL is a prepared hosting target; this branch has not deployed it. Keep Portal activation unset until the published bytes and both application flows have been checked. Scheduling preferences remain outside HIR-266.
