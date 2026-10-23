import { installMarketingOriginRuntime, parseBrowserMarketingCapture } from '~/services/marketing-origin'
import { normalizePortalApiBaseUrl } from '~/services/portal-api'

/** Captures route touches independently of quiz/conversion events, with no participant data. */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const journeyId = useState<string | null>('marketing-journey-id', () => null)
  const storageKey = 'solagree-marketing-origin-v1'
  let remembered = parseBrowserMarketingCapture(localStorage.getItem(storageKey))
  journeyId.value = null
  let queue: Promise<unknown> = Promise.resolve()
  const capture = () => {
    const operation = queue.catch(() => {}).then(async () => {
      const route = router.currentRoute.value
      const code = typeof route.query.ref === 'string' ? route.query.ref : route.path.match(/^\/co-branded\/([^/]+)/)?.[1] ?? null
      const entrySurface = route.path.startsWith('/co-branded/') ? 'co_branded'
        : route.path.startsWith('/book-a-solagree-consult') ? 'booking'
          : route.path.includes('quiz') ? 'quiz' : 'website'
      const response = await $fetch<{ context: { journeyId: string, proof: string }, expiresAt: string }>(
        `${normalizePortalApiBaseUrl(config.public.portalApiBaseUrl)}/api/marketing-origin/capture`, {
          method: 'POST', body: { context: remembered?.context ?? null, referralCode: code, entrySurface }
        })
      remembered = response
      localStorage.setItem(storageKey, JSON.stringify(response))
      journeyId.value = response.context.journeyId
      return response.context
    })
    queue = operation
    return operation
  }
  installMarketingOriginRuntime({
    capture,
    storage: sessionStorage,
    clear: () => { remembered = null; localStorage.removeItem(storageKey); journeyId.value = null }
  })
  router.afterEach((_to, _from, failure) => { if (!failure) void capture().catch(() => {}) })
  // Attribution outages never create guessed credit. Form submission will retry and surface failure.
  void capture().catch(() => {})
})
