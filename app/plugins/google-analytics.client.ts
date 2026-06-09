export default defineNuxtPlugin(() => {
  const route = useRoute()
  const router = useRouter()
  const { trackPageView } = useGoogleAnalytics()

  trackPageView(route.fullPath, document.title)

  router.afterEach((to) => {
    nextTick(() => {
      trackPageView(to.fullPath, document.title)
    })
  })
})
