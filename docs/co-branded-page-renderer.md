# Co-branded page renderer

The co-branded attorney and CDFA routes share one Vue renderer. Variant copy lives in typed content modules under `app/templates/co-branded-page`, while `CoBrandedPageRenderer` owns the common semantic structure.

## Variant selection

The route `pageType` is the authoritative discriminator. `resolveCoBrandedPageContent` uses only `pageType`, so a stale cross-variant `templateId` cannot select the wrong public page. Portal configuration normalization continues to validate CTA and logo URLs before they reach the renderer.

## Interaction contract

- Consultation links retain their approved `href` and open one shared consultation modal through Vue events.
- FAQ items use native `details` and `summary` keyboard behavior. `CoBrandedFaqAccordion` keeps at most one disclosure open.
- Page mode includes the optional partner logo, partner contact block, legal links, and current year. Embed mode omits the partner logo and footer.
- Partner-provided text uses Vue interpolation and attribute bindings, which escape it as text.

No runtime template compiler, `v-html`, or delegated DOM listeners are used by the co-branded renderer.
