# Verified Website promotion and rollback (HIR-624)

This is the Website artifact mechanism. The joint Portal/Website launch order,
provider readiness, authorization and feature-disable decisions remain in
HIR-275 and Portal `docs/phase-2-release-checklist.md`. Preparing a proof or
running fixtures does not authorize a live deployment or hosting conversion.

## Contract

A deployable release has the existing D1 `release-manifest.json` and a private
`.output/release-proof.json`. `npm run prepare:release -- staging` (or
`production`) requires a clean committed checkout and executes, in order:

1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run test:release-host`
5. `npm run generate`
6. `node scripts/verify-release-artifact.mjs`
7. `node scripts/verify-sitemap.mjs`

Nuxt's raw output includes the tracked Apache-only `public/.htaccess` template.
Release postgeneration removes only a regular `.output/public/.htaccess` whose
bytes exactly match `HEAD:public/.htaccess`, before creating the manifest or
proof. A changed template, symlink or any other hidden file fails closed. Host
BasicAuth files are never part of this packaged artifact and remain preserved.
The manifest writer, preparation, uploader and candidate host all execute the
same static artifact policy. Separate staging meeting mode still requires its
explicit native-activation approval at each policy boundary.

The command deletes any previous proof before starting. A failed command or
source change leaves no proof. A successful proof records the source commit,
Git tree, package-lock hash, every packaged artifact file hash, exact manifest hash,
successful fixed commands and the hashes of the candidate HTTP verifier and
nginx snippets. This is integrity evidence from a trusted local checkout, not
a cryptographic signature or an attestation against a malicious operator.
Never create or edit proofs by hand. Synthetic proofs exist only in tests.

The deployment wrappers set the same environment, Portal origins, GA policy
and Cal.com paths as before and run this preflight unless `--skip-build` is
used. `--skip-build` still requires the matching complete proof, clean source,
D1 manifest, sitemap and staging mixed-mode checks. Explicit archived staging
artifacts retain HIR-618's exact commit + manifest checksum pin, plus their
original source tree/lock proof and an unchanged candidate runtime contract.
An environment or GA mismatch fails before upload. No test sends provider or
analytics events.

`--dry-run --skip-build` validates the local artifact/proof and reads the target
inventory. It creates no remote store, lock, backup, candidate or rsync upload.
`--inspect` reads the target inventory without requiring local generated output.
Both operations use the fixed reviewed SSH destinations. Staging retains
BasicAuth and never changes `.htaccess` or nginx configuration. Credentials go
through stdin, never command arguments, proof files or release metadata.
`--skip-route-check` is rejected.

## Store, transactions and retained content

Production uses `/home/solagree/website-releases` as `solagree` (SSH transport
`ubuntu@15.204.253.205`). Staging uses
`ubuntu@solagree.qamachine.com:/home/qa_solagree/website-releases`, using
existing `sudo -n -u root` transport for Python and rsync. Staging releases and
served trees are root-owned, with private bundles mode 0700. The protected
`/home/qa_solagree` ancestor remains root-owned and non-writable to the app
owner. No sudoers, app home permissions or production ownership are changed.
The sibling `public_html` must be absent for explicit initialization, or an
absolute symlink to `website-releases/releases/<64-character-id>/public`.
A live real directory, escaping symlink, symlink entry or special file fails
closed. No automatic legacy-directory rename is attempted.

For a privileged staging publisher, isolated candidate nginx explicitly uses the
existing `www-data` worker and its normal supplementary groups. This keeps the
prepared host's protected ancestor permissions intact. Production and non-root
publishers retain their existing worker behavior; callers cannot select a user.

The private store has `incoming/<random-token>` and `releases/<id>`. A single
nonblocking filesystem lock serializes initialization, promotion and rollback.
Every write operation checks the operator's reviewed active inventory pin.
Concurrent uploads use separate incoming directories, and a candidate whose
active pin became stale cannot switch traffic.

Upload uses rsync deletion only inside its new private incoming directory.
It never rsyncs or deletes the active webroot. The helper verifies the entire
uploaded original artifact, proof and runtime inventory. It composes a separate
served tree, then verifies it with temporary loopback nginx and the existing
shared route HTTP contract. Dynamic routes (including a query-string probe)
need HTTP 200, HTML, exact fallback bytes and noindex/nofollow. The webinar
catalogue must have exact generated bytes. Its explicit trusted HTTP context
requires indexability for isolated candidates and public production, and
`noindex, nofollow` for public staging. Host derives public context from the
verified destination policy, preserving staging global crawler protection.
Missing context fails closed, and no environment flag relaxes this check. Production
also retains the true `/about/` 301 contract. A previously initialized public
host's HTTP/BasicAuth contract is checked before upload.

The complete candidate public tree and original private bundle are sealed by
hash inventories. The release id hashes both inventories. After rechecking the
candidate and active inventories, `os.replace` switches one webroot symlink on
the same filesystem. Readers see a complete previous or next tree. The shared
HTTP contract is checked again through the public hostname (staging auth and
production pre-DNS resolve/TLS behavior retained). A failure restores the old
symlink while still holding the lock, or removes the initial symlink on failed
first bootstrap. Only successful public checks produce an acceptance record.
A failed upload or pre-switch check never changes the active release.
An abrupt process/host interruption after the atomic switch can leave a complete
candidate active before public acceptance is recorded. `--inspect` reports that
missing acceptance, further promotions refuse, and the operator can explicitly
roll back to a retained accepted release without rebuilding. No background
recovery or remote scheduler is installed.

Composition preserves:

- hidden server files/directories such as `.htaccess` and `.well-known`;
- remote-only files and directories recorded in the active sealed inventory;
- versioned Partner Terms, their metadata and unclassified legal history;
- every prior `_nuxt/` asset except mutable `_nuxt/builds/latest.json`.

A differing same-name retained asset or immutable legal document fails.
For an ordinary remote-only file, a differing first claim by the next manifest
also fails, in both promotion and rollback. An identical first claim can become
managed; subsequent changes to a file already owned by the active manifest are
allowed. A prior release's ownership alone never authorizes rollback to replace
a currently remote-only file with differing bytes.
Generated `legal/index.html`, and HTML/payloads for terms-of-service,
privacy-policy and accessibility remain updatable. Files owned by the previous
artifact but absent from the next artifact are removed from the candidate,
except the preserved classes above. An obsolete generated HTML page therefore
does not survive merely because an earlier release contained it. File/directory
collisions fail closed rather than deleting remote content. Artifact-supplied
hidden configuration and `.conf`, `.ini` or `.php` files are rejected.

There is no automatic garbage collection. Retained bundles enable rollback,
and cumulative old hashed assets keep lazy imports working for tabs opened
before promotion or rollback. The required real nginx + Chromium fixture proves
both directions with actual browser `import()` requests. Operators must monitor
free space before release. Any future cleanup needs a separately reviewed
retention window and open-tab/cache policy; do not prune incoming or retained
releases while a transaction is running.

## Prepared-host prerequisites and legacy migration handoff

These scripts have not inspected or converted either live host. A hosting
operator must separately review and authorize the conversion before deployment:

1. Record the current real webroot inventory, file ownership/permissions,
   hidden BasicAuth/ACME files, legal history, remote-only content, nginx root,
   header includes, TLS and `_nuxt` cache policy. Identify previously managed
   files from the prior manifest; if absent, classify them explicitly. Create a
   private full backup and verify its inventory and restoration procedure.
2. Confirm Python 3, Node 22+, curl, rsync and nginx are available to the app
   owner. Production sudo must allow the existing transport user to run Python
   and rsync as `solagree`; no root-owned mutable public output is required.
   Confirm the web server can traverse/read the release public directories.
3. Review the actual nginx site configuration and install the repository's
   dynamic noindex and legacy redirect policies as a separate change, retaining
   BasicAuth, security headers, ACME handling and TLS. Test nginx before reload.
   Keep `public_html` as the configured root, permit its controlled symlink,
   disable `open_file_cache` for it, and verify old assets' MIME/cache behavior.
   The release mechanism never installs snippets or reloads public nginx.
4. Prepare a verified current-environment artifact with its genuine preflight
   proof. Prepare reviewed conversion tooling that composes it with the backed-up
   hidden/remote-only/legal files and prior hashed assets, and seals the full
   inventory in this store format. An unknown legacy artifact cannot be labelled
   verified or become a normal rollback target. Preserve the verified backup as
   the explicit maintenance rollback until a new baseline has passed acceptance.
5. Schedule a maintenance hold for all target writers and traffic during the
   real-directory-to-symlink conversion. POSIX cannot atomically replace a live
   nonempty directory with a symlink. The separately reviewed conversion must
   keep the backup, validate the composed baseline before switching, restore the
   original directory on failure, and record baseline id plus public acceptance.
   Do not use `RELEASE_INITIALIZE=true` to bypass preservation of a legacy site.
6. Confirm public authorized route responses, immutable asset loading and
   backup recovery on the prepared host. Record the exact hosting change,
   environment, baseline id, commit, manifest/proof hashes and owner in HIR-275's
   release evidence. Resume traffic/writers only after the operator's acceptance.

Until that reviewed conversion exists, a real-directory refusal is the intended
outcome. First bootstrap is supported only for an actually empty prepared host
with `RELEASE_INITIALIZE=true` and the SHA-256 fingerprint of its absent root.
Neither bootstrap nor conversion is performed by local tests.

## Authorized release and rollback operation

Use the same explicit `NUXT_PUBLIC_GA_MEASUREMENT_ID` for proof generation,
inspection and promotion when analytics is enabled. Missing/empty disables it.
After the separate live-release authorization and prepared-host acceptance:

```bash
# Local committed checkout. Select all reviewed public build settings first.
NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT=staging npm run prepare:release -- staging
npm run deploy:staging -- --skip-build --dry-run

# Copy the exact inventory hash from the reviewed dry-run. Hold target writers.
RELEASE_EXPECTED_TARGET_SHA256=<reviewed-active-hash> \
RELEASE_TARGET_QUIESCED=true npm run deploy:staging -- --skip-build
```

Production uses the equivalent `production`/`deploy:production` commands.
Record the printed new and previous release ids. Keep a private copy of both
manifest and proof in the release evidence. No environment override can redirect
these commands to an unreviewed host or Portal origin.

Rollback needs a retained release id and matching target environment/GA policy.
It does not run npm, regenerate output, require the old source checkout, or
upload files. It verifies the target's sealed inventories, original proof and
successful acceptance record, composes its original artifact with the current
preserved files/assets, runs candidate checks, and atomically switches. The
result may have a new id because assets introduced after the target release
remain available to open tabs.

```bash
npm run deploy:staging -- --inspect
RELEASE_EXPECTED_TARGET_SHA256=<reviewed-active-hash> \
RELEASE_TARGET_QUIESCED=true npm run deploy:staging -- --rollback=<retained-release-id>
```

Use Website-before-Portal rollback ordering from HIR-275 when the older Portal
lacks the Website catalogue/API contract. A release lock or stale inventory
failure is a stop-and-reinspect condition; never force it by changing a pin
without reviewing the current target. External target writers must stay held
through candidate verification and public acceptance. A public failure is
reported separately from local fixture evidence.

## Reproducible local evidence

`npm test` includes proof, source/env mismatch, preservation, upload corruption,
legacy/escape refusal and rollback proof tests. `npm run test:release-host` uses
the actual Python helper, a cached `nginx:1.29-alpine` image (`--pull=never`) and
local Chromium. Provision Docker and a compatible Playwright browser before
preflight; `RELEASE_CHROMIUM_EXECUTABLE` can select a known local Chromium binary.
On macOS the fixture also recognizes the installed Google Chrome binary.
A managed sandbox may need an approved local process launch for Chromium.
Missing tooling fails this required gate rather than skipping it. Containers
are isolated, bound to loopback and cleaned up. No live SSH, nginx installation,
scheduler changes or provider/analytics sends occur in these fixtures.

After preparing the exact clean commit, run `npm run test:prepared-release` for
the genuine-artifact regression. It uses that checkout's actual generated
manifest and successful proof with the real release client and Python helper,
redirecting SSH/rsync and all public HTTP requests exclusively into isolated
local nginx. It verifies successful promotion while preserving seeded host auth
and ACME files. This post-proof check is separate from synthetic failure fixtures
and makes no live-host or provider requests.
