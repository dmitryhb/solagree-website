---
id: solagree-website/resources/build-validation-entrypoint
scope: repo
repositories:
  - solagree-website
domains:
  - frontend
kind: invariant
summary: Git-managed resource content validation must execute from a production build entrypoint, not only a runtime route, to fail every production build.
evidence:
  - repository: solagree-website
    path: package.json
  - repository: solagree-website
    path: scripts/validate-resource-content.mjs
verifiedAt: 2026-08-21
---

Run the resource content module from a build lifecycle entrypoint so invalid entries fail before Nuxt bundles the app. The entrypoint must be executable outside Nuxt configuration and support the `#shared` alias used by the content module. Server-route imports alone are not a build-time guarantee. The current `prebuild` command invokes `scripts/validate-resource-content.mjs`.
