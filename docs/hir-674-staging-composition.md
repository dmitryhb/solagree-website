# HIR-674 staging composition

This staging-only branch preserves the accepted staging foundation while applying the approved HIR-674 website pricing. The ordinary implementation and acceptance record remains in `docs/hir-674-release-candidate.md`.

## Provenance

The live October 15 staging manifest names `80530190dd07ade0d262e9ce46a04d0f8b0b6754`. That Git object and its old temporary checkout cannot be recovered, so this branch is a freshly reviewed composition, not a claimed byte-for-byte recovery. HIR-673's October 15 staging handoff explicitly records that release as staging base `e59b8dc` plus HIR-665 consultant visibility plus HIR-673 UI.

The branch starts at recoverable staging base `e59b8dca429342c5f6d7af62b7c975502bf8b60c`, keeping its 90-file hardening foundation. It applies HIR-673 source commits `3c832eec54348f612834366db0d64f629aed02a3` and `9c87f03f8fdf09494e5d21a4a8503fe00922b8f9`, then approved pricing `3d1020184d1ebe0f11bb06f608e78c80b0dbc742` and acceptance documentation `e4f72ecfcccb43b2afec13bf26e99c9294aec4e5`.

HIR-665's approved visibility is ported minimally: default unpublished consultants are `jessica,james` in Nuxt, the shared resolver, example environment and deployment scripts. The existing mixed Phone Call or Zoom routing remains intact, along with explicit separate-mode support. HIR-665's older full files were not used because they predate that routing. Tests retain explicit publication overrides where exercising restoration and separate routing, and default fixtures now expose First Available, Taj and Stacie.

## Artifact policy

Generate with deployment environment `staging`, site origin `https://solagree.qamachine.com`, Portal and API origin `https://solagree-portal.qamachine.com`, GA disabled, meeting method `mixed`, and unpublished consultants `jessica,james`. Preserve all five existing mixed Cal.com event paths. This release makes no Cal.com or Zoom provider changes.

Preserve immutable `public/legal/partner-terms/2026-10-06/` files and their hashes. Deployment must retain protected server files and previous release backup. Full lint, typecheck, repository tests, generated artifact/manifest verification and browser acceptance are required for this composition before deployment.

## Reusable release lesson

Solagree staging can contain accepted work absent from `develop`. Compare release manifest provenance and prior Linear deployment records before deploying a branch. A valid new pricing diff is insufficient when a rebuild would discard accepted staging behavior. Preserve the known foundation and record any reconstruction uncertainty explicitly.
