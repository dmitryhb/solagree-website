import { nextTick, onBeforeUnmount } from 'vue'

export interface UseModalDialogOptions {
  /**
   * Element that bounds the dialog. Tab and Shift+Tab wrap within its
   * focusable descendants so keyboard focus never reaches the page behind
   * the overlay.
   */
  getContainer: () => HTMLElement | null
  /**
   * Element focused when the dialog opens. Defaults to the container, which
   * lets screen readers announce the dialog before its controls are reached.
   */
  getInitialFocusTarget?: () => HTMLElement | null
  /**
   * Fallback focus target when the element that opened the dialog cannot be
   * recovered from document.activeElement (e.g. mouse clicks in Safari do
   * not move focus to buttons).
   */
  getRestoreFocusTarget?: () => HTMLElement | null
  /**
   * Invoked when Escape requests a close. The caller decides whether to
   * honor the request (e.g. ignore it while submitting).
   */
  onRequestClose: () => void
}

export interface UseModalDialogReturn {
  /** Locks page scroll, remembers the opener, and moves focus into the dialog. */
  activate: () => Promise<void>
  /** Restores page scroll and returns focus to the element that opened the dialog. */
  deactivate: () => Promise<void>
  /** Keydown handler implementing Escape-to-close and the Tab focus trap. */
  handleKeydown: (event: KeyboardEvent) => void
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Shared modal dialog behavior extracted from CoBrandedConsultModal:
 * initial focus, focus trapping, Escape handling, background scroll locking,
 * and focus restoration to the opener on close/unmount.
 */
export const useModalDialog = (options: UseModalDialogOptions): UseModalDialogReturn => {
  let previouslyFocusedElement: HTMLElement | null = null
  let previousBodyOverflow = ''
  let isPageScrollLocked = false

  const restorePageScroll = (): void => {
    if (!isPageScrollLocked) {
      return
    }

    document.body.style.overflow = previousBodyOverflow
    isPageScrollLocked = false
  }

  const getFocusableElements = (): HTMLElement[] => {
    return Array.from(options.getContainer()?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [])
  }

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      options.onRequestClose()
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const focusableElements = getFocusableElements()
    const firstFocusableElement = focusableElements[0]
    const lastFocusableElement = focusableElements.at(-1)

    if (!firstFocusableElement || !lastFocusableElement) {
      event.preventDefault()
      return
    }

    const activeElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const activeIndex = activeElement ? focusableElements.indexOf(activeElement) : -1

    if (activeIndex === -1) {
      // Focus sits on the dialog container (or another non-tabbable target
      // inside it); jump to the appropriate edge so Tab cannot escape.
      event.preventDefault()
      ;(event.shiftKey ? lastFocusableElement : firstFocusableElement).focus()
      return
    }

    if (event.shiftKey && activeIndex === 0) {
      event.preventDefault()
      lastFocusableElement.focus()
    } else if (!event.shiftKey && activeIndex === focusableElements.length - 1) {
      event.preventDefault()
      firstFocusableElement.focus()
    }
  }

  const activate = async (): Promise<void> => {
    // A mouse click does not move focus to the opener in every browser, so
    // an unfocused body is treated as "no opener remembered" and the caller's
    // explicit restore target (when provided) is used instead.
    const activeElement = document.activeElement

    previouslyFocusedElement = activeElement instanceof HTMLElement && activeElement !== document.body
      ? activeElement
      : null
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    isPageScrollLocked = true

    await nextTick()

    const focusTarget = options.getInitialFocusTarget?.() ?? options.getContainer()

    focusTarget?.focus()
  }

  const restoreOpenerFocus = (): void => {
    const restoreTarget = previouslyFocusedElement ?? options.getRestoreFocusTarget?.()

    restoreTarget?.focus()
    previouslyFocusedElement = null
  }

  const deactivate = async (): Promise<void> => {
    restorePageScroll()

    await nextTick()

    restoreOpenerFocus()
  }

  onBeforeUnmount(() => {
    restorePageScroll()
    restoreOpenerFocus()
  })

  return {
    activate,
    deactivate,
    handleKeydown
  }
}
