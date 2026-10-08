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

## Responsive layout

The hero uses two columns above the 1100px compact-desktop boundary. At and below that
boundary, the copy and photo stack so the desktop heading and description never
paint over the photo. This applies to attorney and CDFA routes in both public
page and embed mode; the renderer must not introduce horizontal document
overflow at any responsive width. Mobile track cards use a zero-minimum grid
column and wrap their headings so card content cannot widen the page.
