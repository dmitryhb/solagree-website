export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { trackPageView } = useGoogleAnalytics()

  router.afterEach(async (to, _from, failure) => {
    if (failure) {
      return
    }

    // Unhead flushes the document title after Nuxt finishes the page lifecycle.
    // The next frame observes that rendered title before the analytics event.
    await nextTick()
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))

    // A later navigation can settle before this callback reaches the next frame.
    // Its page view owns the rendered title, so the superseded route must not emit.
    if (router.currentRoute.value.fullPath !== to.fullPath) {
      return
    }

    trackPageView(to.fullPath, document.title)
  })
})
