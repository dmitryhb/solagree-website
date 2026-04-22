import type { DirectiveBinding } from 'vue'

type AppearanceRevealVariant = 'fade' | 'scale' | 'slide'

type AppearanceRevealOptions = {
  delay?: number
  variant?: AppearanceRevealVariant
}

const APPEARANCE_VISIBLE_CLASS = 'is-visible'

/**
 * Normalizes directive input so templates can pass either a delay number or a
 * small options object without duplicating class/style logic.
 */
const getAppearanceRevealOptions = (binding: DirectiveBinding<number | AppearanceRevealOptions | undefined>) => {
  if (typeof binding.value === 'number') {
    return {
      delay: binding.value,
      variant: 'slide' as const
    }
  }

  return {
    delay: binding.value?.delay ?? 0,
    variant: binding.value?.variant ?? 'slide'
  }
}

/**
 * Adds stable reveal classes before the observer runs, keeping markup usage
 * declarative while centralizing timing and reduced-motion behavior.
 */
const prepareAppearanceRevealElement = (
  element: HTMLElement,
  binding: DirectiveBinding<number | AppearanceRevealOptions | undefined>
) => {
  const options = getAppearanceRevealOptions(binding)

  element.classList.add('appearance-reveal', `appearance-reveal--${options.variant}`)
  element.style.setProperty('--appearance-delay', `${Math.max(options.delay, 0)}ms`)
}

export default defineNuxtPlugin((nuxtApp) => {
  const observer = import.meta.client && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue
          }

          entry.target.classList.add(APPEARANCE_VISIBLE_CLASS)
          observer?.unobserve(entry.target)
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
      }
    )
    : null

  nuxtApp.vueApp.directive('appear', {
    getSSRProps: (binding) => {
      const options = getAppearanceRevealOptions(binding)

      return {
        class: `appearance-reveal appearance-reveal--${options.variant}`,
        style: {
          '--appearance-delay': `${Math.max(options.delay, 0)}ms`
        }
      }
    },
    created: (element: HTMLElement, binding) => {
      prepareAppearanceRevealElement(element, binding)
    },
    mounted: (element: HTMLElement, binding) => {
      prepareAppearanceRevealElement(element, binding)

      if (!observer) {
        element.classList.add(APPEARANCE_VISIBLE_CLASS)
        return
      }

      observer.observe(element)
    },
    unmounted: (element: HTMLElement) => {
      observer?.unobserve(element)
    }
  })
})
