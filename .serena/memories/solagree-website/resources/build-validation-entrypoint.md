---
id: solagree-website/resources/build-validation-entrypoint
scope: repo
repositories:
  - solagree-website
domains:
  - frontend
kind: invariant
summary: Git-managed resource content validation must load from Nuxt configuration, not only a runtime route, to fail every production build.
evidence:
  - repository: solagree-website
    path: nuxt.config.ts
verifiedAt: 2026-08-21
---

Import the resource content module from Nuxt configuration so invalid entries fail config evaluation before a production bundle is built. Server-route imports alone are not a build-time guarantee.
