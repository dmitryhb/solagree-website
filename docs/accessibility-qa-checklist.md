# Accessibility QA checklist (HIR-369)

Automated component tests cover everything that is programmatically
assertable (see `tests/accessibility-*.component.test.ts`). The behaviors
below depend on real browser focus/navigation and screen reader announcement
queues, which unit tests cannot exercise faithfully. Run this checklist
manually against `npm run dev` before releasing changes to forms or modals.

Test with: a keyboard only, plus at least one screen reader
(VoiceOver + Safari/Chrome on macOS, NVDA + Firefox or Chrome on Windows).
For each modal, also test with browser zoom at 200%.

## Footer network chooser modal (`SiteFooter`)

1. Activate "Join the Network" in the footer with the keyboard. Focus moves
   into the dialog and the dialog name ("Choose your application") is
   announced.
2. Press Tab and Shift+Tab repeatedly. Focus cycles only through the
   dialog's close button and the two application links — it never reaches
   the page behind the overlay.
3. While the dialog is open, the background page does not scroll (mouse
   wheel, touch, `Space`/`Page Down`).
4. Press Escape — the dialog closes and focus returns to the
   "Join the Network" button that opened it.
5. Close via the backdrop or the close button — focus still returns to the
   opener.
6. Navigate away (browser back / route change) while the dialog is open —
   body scrolling is restored afterwards.

## Co-branded consult modal (`CoBrandedConsultModal`)

1. Opening the modal moves focus to the first name field; background scroll
   is locked.
2. Tab/Shift+Tab stay inside the modal.
3. Escape closes the modal and restores focus to the opener — except while
   submitting, when close is intentionally suppressed.
4. After a successful submit, focus lands on the "Thank you. We received
   your request." heading and the success state is announced.
5. After a failed submit (e.g. portal stopped), the error message is
   announced assertively and receives focus.
6. Unmounting the host page while the modal is open restores body scroll.

## Forms (admin intake, consult request, contact, webinar, attorney, CDFA)

1. Trigger a submission failure (e.g. block the portal API request). The
   error is announced immediately (assertive, not polite) and focus moves to
   the error message; Tab from the message returns to the form controls.
2. After a successful submission that navigates (intake/consult/webinar/
   attorney/CDFA), focus lands on the destination page's main heading (or
   `#main-content` when no heading exists) — not on `body` or the removed
   submit button — and the new page content is announced.
3. After a successful contact form submission (in-place replacement), focus
   lands on the thank-you message and it is announced.
4. Native validation bubbles are still shown for empty required fields
   (focus behavior for those is browser-controlled and is intentionally not
   overridden).

## Field semantics

1. Admin intake privacy preference group announces its accessible name
   ("Privacy preference") when entering the radio group.
2. Attorney and CDFA phone fields: with a screen reader, the field announces
   the same instruction format; entering `415-555-1234` (CDFA) and
   `1-415-555-1234` or `415-555-1234` (attorney) validates successfully,
   while an invalid value is rejected by the browser with the title text.
3. CDFA service area field: the help text ("CDFAs can work remotely
   nationwide…") is announced when the field receives focus.
4. Bar states / specializations / license fieldsets: after an invalid
   submit, the error is announced and the checkboxes report themselves as
   invalid (e.g. NVDA reports "invalid").
5. Every page exposes exactly one `#main-content` target for the skip link.

## Regression notes

- `useModalDialog` (`app/composables/useModalDialog.ts`) is the single
  implementation of modal focus trapping, scroll locking, and focus
  restoration. Any new `aria-modal` dialog must use it.
- `focusPageDestination` (`app/utils/focus-destination.ts`) is the single
  implementation of post-navigation focus movement.
