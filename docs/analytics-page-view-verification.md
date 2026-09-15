# Local page-view verification

HIR-607 records browser-level analytics evidence without sending data to Google.

Run the dedicated test with a fake measurement ID:

```sh
NUXT_PUBLIC_GA_MEASUREMENT_ID=G-HIR607LOCAL \
  npm exec -- playwright test -c playwright.google-analytics.config.ts
```

The test blocks every non-local request, including Google Tag Manager and Google Analytics, then captures local `dataLayer` page-view calls with the rendered `document.title` at emission time.

It verifies these cases:

| Case | Route | Expected and rendered title | Captured payload |
| --- | --- | --- | --- |
| Direct load with query | `/about-us?source=hir607` | `About Us \| Solagree` | Exact path, location, and title |
| SPA navigation | `/attorneys` | `Attorney Partners \| Solagree` | Exact path, location, and title |
| Query-only SPA navigation | `/faq?section=professional-partners` | `Frequently Asked Questions \| Solagree` | Exact path, location, and title |
| Hash-only SPA navigation | `/#how-it-works` | `Virtual Flat-Fee Divorce Without Court \| Solagree` | Exact path, location, and title |
| Rapid cancelled SPA navigation | `/cdfa` | `CDFA Partners \| Solagree` | One final page view only |
| Error route | `/404` | `Page Not Found \| Solagree` | Exact path, location, and title |
| Disabled analytics function | `/attorneys` | `Attorney Partners \| Solagree` | No page view |

The pre-fix browser capture showed duplicate direct-load page views and previous-route titles on SPA navigation. The successful router lifecycle waits for Nuxt's next render frame before emitting one page view, after the route head applies. Cancelled and superseded navigation callbacks do not emit.
