export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()
  const router = useRouter()
  const { trackPageView } = useGoogleAnalytics()

  nuxtApp.hook('page:finish', async () => {
    // Unhead flushes the document title after Nuxt finishes the page lifecycle.
    // The next frame observes that rendered title before the analytics event.
    await nextTick()
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))

    trackPageView(router.currentRoute.value.fullPath, document.title)
  })
})
