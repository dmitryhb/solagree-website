# Dependency remediation — HIR-660

Nuxt 4.6 requires Node ^22.22.3, ^24.15.0, or a supported newer major.
The repository .nvmrc selects 22.22.3. Local upgrade gates used the already
installed Node 24.19.0 without changing the shell default. Update build agents
and the Portal server runtime before deploying this dependency change.

Keep the Sharp, framework, email renderer, and mail transport updates in
separate review phases so each dependency change can be assessed and reverted.
Source commits alone do not authorize staging or production deployment.

Stable DevTools 3.4.2 remains enabled in development and is disabled whenever
`NODE_ENV=production`. Its one default `simple-git` import is incompatible
with the secured v4 API. The postinstall script patches only that import to
`{ simpleGit as Git }` before `nuxt prepare`; overrides pin DevTools 3.4.2,
simple-git 4.0.2, and its argv parser 2.0.1. The script is idempotent and fails
installation on a changed DevTools version or unexpected import. Atomic file
replacement avoids mutating a pnpm store hardlink. Do not skip install scripts.
Review and remove the patch and matching overrides when stable upstream
DevTools adopts the new API. This avoids opting into the DevTools v4 beta and
its different Vite requirements. Both development module loading and the
`branch`, `revparse`, and `status` calls used by build analysis are checked.

The remaining high advisories have no published patch as of 2026-10-09:

- [braces stack exhaustion (GHSA-vfj7-8cjw-p6xm)](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm):
  the Nuxt/Nitro build graph uses globby/micromatch with repository-controlled
  patterns. No application route accepts a glob pattern from a visitor, and
  the vulnerable package is absent from the generated server artifact.
- [node-forge signature verification (GHSA-86w9-cpqp-85rv)](https://github.com/advisories/GHSA-86w9-cpqp-85rv):
  listhen uses forge for local development certificate generation/import, not
  verification of attacker-supplied RSA signatures. It is absent from the
  generated server artifact. Application TLS uses the deployment proxy and
  Node/OpenSSL, not forge.

These are reachability exceptions, not claims that the installed packages are
patched. Reassess them if application code begins using these libraries or
build configuration starts accepting untrusted patterns/certificates. The low
esbuild advisory concerns its development server on Windows; supported build
hosts are macOS/Linux and production does not run that server.

Sources: [simple-git v4 migration](https://github.com/steveukx/git-js/blob/main/simple-git/CHANGELOG.md),
[stable versus v4 DevTools](https://github.com/nuxt/devtools),
[Nodemailer migration](https://github.com/nodemailer/nodemailer/blob/master/CHANGELOG.md).

The production-only npm audit reports zero critical, 11 high package entries
(propagated from the two unpatched advisories above), and one low entry. The
full audit additionally reports critical advisories in the development-only
[Vitest 3/Tinypool worker chain](https://github.com/advisories/GHSA-85c8-ppgw-ccpr).
That test runner consumes repository-controlled tests/options and is not
exposed by the static website. Upgrading the test toolchain remains separate
work; do not apply npm's suggested forced major upgrade or downgrade Nuxt to
the older version it suggests for the unpatched build-chain advisories.
