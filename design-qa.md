# News & Press Design QA

## Scope

- Page: `/news`
- Primary Figma reference: `/var/folders/zy/px1txbsj5hj8v2xbp6hf09c80000gn/T/codex-clipboard-54b9be55-39d6-4cbf-9d91-333948da886c.png`
- Reported dark-card example: `/var/folders/zy/px1txbsj5hj8v2xbp6hf09c80000gn/T/codex-clipboard-9ae752de-a0dc-4b1e-ac34-9a758e0c21a7.png`
- Desktop implementation: `.codex-artifacts/news-press-implementation-final-1564x868.png`
- Mobile implementation: `.codex-artifacts/news-press-mobile.png`

## Capture Conditions

- Primary reference: 1564 × 868 px.
- Desktop implementation: 1564 × 868 px, captured from a 1564 × 950 CSS-pixel viewport at DPR 1 and cropped below the 82 px shared site header so the page-content state matches the reference.
- Mobile implementation: 390 × 1000 px at DPR 1.
- State: News & Press loaded, navigation closed, no overlays.
- Full comparison: `.codex-artifacts/news-press-comparison-final.png` places the reference and normalized implementation side by side at equal size.
- Focused card comparison: `.codex-artifacts/news-press-card-surface-comparison.png` places the reported dark publisher-art surface beside the final lighter card treatment.

## Findings

- No actionable P0, P1, or P2 differences remain.
- Typography: the existing Solagree Lora display and Open Sans/Poppins supporting families preserve the reference hierarchy. The title, intro, featured headline, summary, and CTA wrap cleanly at desktop and mobile sizes.
- Spacing and layout: the featured release now occupies the above-the-fold position shown in the reference, with a wide image, right-side copy, rounded image corners, and a responsive single-column mobile layout.
- Colors and tokens: media cards and their publisher-art wells now use the lighter `--color-surface-warm` token (`#f5eee1`) instead of the darker stone token (`#e4ded5`). The page background, ink, plum, and yellow CTA continue using existing Solagree tokens.
- Image quality: the new feature image is a 1672 × 941 WebP at 49 KB with a suitable editorial crop and no visible compression artifacts. Existing podcast artwork remains sharp and uses `object-fit: contain`.
- Copy and content: the full press-release title, conference summary, and “Read the Full Release” action match the supplied design. Remaining media dates render in descending order: May 14, 2026; April 22, 2026; December 27, 2025; November 21, 2025.
- Interaction: the feature action exposes a valid HTTPS destination, opens in a new tab with `noopener noreferrer`, and has an explicit accessible label.
- Responsive behavior: at 390 px, the feature image, headline, summary, and CTA stack without clipping or visible horizontal overflow.

## Comparison History

1. Baseline evidence showed no featured release, entry order based on source-array position, and dark stone backgrounds behind publisher artwork.
2. The featured press record and image were added; the published-news selector was changed to newest-first date sorting; the first passing component view exposed the feature above Recent Media.
3. The card and publisher-art surfaces were changed to the lighter warm token. Focused desktop evidence confirms the date order and the corrected background.
4. Final normalized desktop and mobile captures found no blocking or moderate fidelity issues.

## Accepted P3 Differences

- The generated featured photo follows the reference composition, business-editorial tone, patterned blouse, and laptop subject, but does not reproduce the source person's identity or exact crop.
- The shared production site header is intentionally excluded from the normalized reference comparison because the supplied Figma crop begins at page content.

final result: passed
