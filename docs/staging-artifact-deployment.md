# Website staging artifact deployment

HIR-624 replaces the previous non-atomic in-place staging uploader with the
shared [verified artifact promotion and rollback mechanism](website-artifact-promotion.md).
The destination remains `qa_solagree@solagree.qamachine.com`, and BasicAuth,
hidden server configuration, remote-only content, Partner Terms versions,
metadata and unclassified legal history remain protected. Generated legal app
HTML/payloads remain updatable. Previous hashed lazy assets survive promotion
and rollback.

Read the mechanism runbook's prepared-host prerequisites and migration handoff
before any live operation. Existing real-directory hosting fails closed and
requires a separately approved maintenance conversion. The uploader never
installs nginx snippets or renames a live nonempty webroot.

`npm run deploy:staging -- --skip-build --dry-run` requires the exact original
artifact manifest and successful preflight proof, then reads the target inventory
without uploading or changing any remote files. Normal staging retains mixed
Initial Consult meeting mode. Separate Phone/Zoom still requires explicit
`STAGING_NATIVE_ACTIVATION_APPROVED=true`; this flag is not provider acceptance.

Archived staging artifacts retain the explicit `STAGING_ARTIFACT_COMMIT` and
`STAGING_ARTIFACT_MANIFEST_SHA256` pin, plus the matching original preflight proof.
The pinned commit must be an ancestor of the clean current checkout and the
candidate HTTP runtime/snippets must match its proof. A metadata-only legacy
manifest cannot be upgraded to a verified release without rerunning preflight.

For an authorized promotion, `RELEASE_EXPECTED_TARGET_SHA256` must pin the reviewed
active inventory and `RELEASE_TARGET_QUIESCED=true` records that target writers
are held. The old `STAGING_EXPECTED_TARGET_SHA256` and `STAGING_TARGET_QUIESCED`
names remain compatible when the generic names are absent. `STAGING_TARGET_INVENTORY_FILE`
can save the read-only inventory privately. `STAGING_BASIC_AUTH_USER` and
`STAGING_BASIC_AUTH_PASSWORD` must be set together when the host is protected.
Credentials are sent through stdin and never stored in release files or logs.

Use `--inspect` for the current release/inventory and
`--rollback=<retained-release-id>` for verified rollback without a rebuild or
upload. Both candidate and public HTTP checks are mandatory. The joint launch
order and external acceptance remain owned by HIR-275.
