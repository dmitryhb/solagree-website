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

---

# HIR-388 Design QA

- Source visual truth: `/var/folders/zy/px1txbsj5hj8v2xbp6hf09c80000gn/T/codex-clipboard-c8c0db8d-f786-4329-90b5-60d9aec8a4a2.png`
- Desktop implementation: `/var/folders/zy/px1txbsj5hj8v2xbp6hf09c80000gn/T/hir-388-desktop-final.png`
- Mobile implementation: `/var/folders/zy/px1txbsj5hj8v2xbp6hf09c80000gn/T/hir-388-mobile.png`
- Combined comparison: `/var/folders/zy/px1txbsj5hj8v2xbp6hf09c80000gn/T/hir-388-comparison.png`
- Desktop viewport: `1510 × 1012` CSS pixels
- Mobile viewport: `390 × 844` CSS pixels
- Source pixels: `2276 × 1526`, normalized to `1510 × 1012` for the combined comparison
- Implementation pixels: `1510 × 1012` desktop and `390 × 844` mobile
- Density normalization: source scaled to the implementation pixel dimensions; implementation captured at browser viewport density
- State: Stacie Sanders selected, consultant details visible, Cal.com calendar loaded

## Full-view comparison evidence

The combined comparison verifies the reference's primary structure: a persistent consultant-information column sits beside the scheduling surface. The implementation intentionally retains the Solagree page header, typography, palette, card radius, and Cal.com embed rather than cloning Calendly branding.

No separate focused crop was needed because the consultant headshot, name, biography, duration, meeting methods, and column boundary remain readable in the normalized full-view comparison. The standalone desktop and mobile captures were also inspected at their original dimensions.

## Required fidelity surfaces

- Fonts and typography: existing Solagree families and hierarchy are retained; the sidebar uses the established navigation face for compact labels and headings.
- Spacing and layout rhythm: desktop uses a bordered two-column shell with a clear vertical divider; mobile stacks the sidebar above the embed without horizontal overflow.
- Colors and visual tokens: all surfaces, borders, radii, shadows, text colors, and focus styles use existing Solagree tokens.
- Image quality and asset fidelity: the approved Stacie headshot loads from the existing production asset and keeps a circular, uncropped presentation. E2E now asserts a non-zero natural image width.
- Copy and content: the approved consultant biography is shown with `30 min` and `Phone Call or Zoom`. `First Available` uses neutral team copy and no invented portrait.

## Findings

No actionable P0, P1, or P2 differences remain for the requested scope.

Intentional product constraint: selected date/time and timezone remain owned by the live Cal.com embed instead of being duplicated in the website sidebar. This avoids stale cross-origin booking data while still matching the reference's consultant-details pattern.

## Interaction and responsive checks

- Consultant selection swaps the Cal.com event and focuses the new sidebar.
- `Change consultant` restores the selector and focus to the selected radio.
- Desktop keeps the sidebar beside the embed.
- Mobile stacks the sidebar above the embed with `scrollWidth === innerWidth`.
- Approved headshot loads successfully.
- Browser console reported no errors.

## Comparison history

### Pass 1

- Earlier P0/P1/P2 findings: none in the browser-rendered comparison.
- Fixes made during design QA: none required.
- Post-fix evidence: not applicable; desktop and mobile captures passed on the first visual comparison.

## Implementation checklist

- [x] Consultant identity and approved biography
- [x] Duration and Phone/Zoom methods
- [x] Neutral First Available treatment
- [x] Desktop side-by-side layout
- [x] Mobile stacked layout
- [x] Focus-management regression coverage
- [x] Real headshot asset coverage

final result: passed
