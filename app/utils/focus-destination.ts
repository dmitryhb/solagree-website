import { nextTick } from 'vue'

/**
 * Moves keyboard focus to the current page's primary destination content
 * after a client-side navigation (or in-place content replacement) so screen
 * reader and keyboard users are not left on a removed submit button or body.
 *
 * Prefers the first main heading inside #main-content; falls back to the
 * #main-content anchor itself, which app.vue keeps focusable via
 * tabindex="-1".
 */
export const focusPageDestination = async (): Promise<void> => {
  await nextTick()

  const mainContent = document.getElementById('main-content')

  if (!(mainContent instanceof HTMLElement)) {
    return
  }

  const destinationHeading = mainContent.querySelector<HTMLElement>('h1, h2')

  if (destinationHeading) {
    destinationHeading.setAttribute('tabindex', '-1')
    destinationHeading.focus()
    return
  }

  mainContent.focus()
}
