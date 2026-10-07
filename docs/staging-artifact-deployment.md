# Website staging artifact deployment — HIR-618

`scripts/deploy-staging.sh` uploads the complete verified `.output/public` artifact to the fixed
`qa_solagree@solagree.qamachine.com:/home/qa_solagree/public_html` destination. It never deletes
remote files, changes nginx, or replaces hidden server configuration such as `.htaccess` and
`.well-known`. Existing `legal/partner-terms/**` versions and unclassified standalone legal history
must match incoming bytes when paths overlap. Generated `index.html` and `_payload.json` files under
`legal/{terms-of-service,privacy-policy,accessibility}/`, plus the `legal/index.html` redirect, update with the complete
application artifact under backup and hash verification. Other legal paths need explicit
classification before overlapping bytes can change. Old assets and unrelated remote content remain available.

## Inventory and provenance

Extract the reviewed archive into `.output/public`. For an artifact built before a later tooling
or merge commit, explicitly set `STAGING_ARTIFACT_COMMIT` to the full reviewed source SHA and
`STAGING_ARTIFACT_MANIFEST_SHA256` to the SHA-256 of the exact extracted manifest. The source must
be an ancestor of the deployment checkout. Destination/GA policy and every artifact file hash are
still checked. Without those paired pins the manifest must match the current HEAD.

Run `npm run deploy:staging -- --skip-build --dry-run`. This now performs a **read-only SSH target
inventory** and rsync preview. It requires remote Python 3 and rejects symlinks, non-regular entries,
unsafe target paths, path type conflicts, or changed existing immutable legal bytes. Set
`STAGING_TARGET_INVENTORY_FILE` to save the hash/path inventory in a local private file for review.
No file bodies or BasicAuth credentials are logged.

Mixed Initial Consult mode is required for the current staging window. A separate Phone/Zoom
artifact is refused unless a separately authorized operator explicitly sets
`STAGING_NATIVE_ACTIVATION_APPROVED=true`. This flag does not configure or open provider events.

## Approved upload

Hold external writers and staging traffic for the upload window. Set `STAGING_TARGET_QUIESCED=true`
to record that hold and `STAGING_EXPECTED_TARGET_SHA256` to the reviewed inventory SHA printed by
the preview. Provide the existing staging BasicAuth credentials through the protected environment.
Run `npm run deploy:staging -- --skip-build` with the same artifact pins and public staging policy.

Before rsync, the helper checks the target fingerprint again, creates a private full backup under
`/home/qa_solagree/website-backups/<timestamp>-<fingerprint-prefix>/public`, verifies the backup
against its saved `inventory.json`, and rechecks the live target for drift. Existing backup paths
are never overwritten. A mismatch stops before upload. No backup is created in dry-run mode.

Delivery uses `rsync -az --delay-updates --exclude='.*'` without deletion. It is not an atomic
site switch: keep the maintenance window until verification completes. Afterwards every uploaded
artifact file including the release manifest must match its local SHA-256, all prior remote-only
files and directories must still exist, and hidden configuration and prior immutable legal bytes
must be unchanged. Generated legal pages must match the new artifact. Then the shared authenticated
HTTP body/status/noindex/catalogue checks run.

The reviewed nginx noindex snippet requires its own inspected server configuration operation and
`nginx -t`; this static uploader deliberately provides no nginx installation path. Missing live
headers fail acceptance even when all uploaded file hashes match. `--skip-route-check` only skips
HTTP probes; it never skips artifact, inventory, backup, preservation or upload hash checks.

If upload or HTTP verification fails, retain the hold and inspect the verified backup. There is no
automatic rollback or deletion. Restore reviewed previous generated files from that backup while
preserving authentication and any externally added files; recheck hashes and HTTP before reopening
traffic. Native events, bookings, charges, refunds, messages and production are outside this helper.
