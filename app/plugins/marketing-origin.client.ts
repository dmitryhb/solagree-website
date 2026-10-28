import { createSafeBrowserStorage } from '~/utils/browser-storage'
import { installMarketingOriginRuntime, parseBrowserMarketingCapture } from '~/services/marketing-origin'
import { normalizePortalApiBaseUrl } from '~/services/portal-api'

/** Captures route touches independently of quiz/conversion events, with no participant data. */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const journeyId = useState<string | null>('marketing-journey-id', () => null)
  const storage = createSafeBrowserStorage(() => window.localStorage)
  const submissionStorage = createSafeBrowserStorage(() => window.sessionStorage)
  const storageKey = 'solagree-marketing-origin-v1'
  let remembered = parseBrowserMarketingCapture(storage.getItem(storageKey))
  journeyId.value = null
  let queue: Promise<unknown> = Promise.resolve()
  const capture = () => {
    // Snapshot the observed entry before prior network calls finish or navigation changes it.
    const route = router.currentRoute.value
    const coBrandedSlug = route.path.match(/^\/(?:(?:cdfa\/)?go|co-branded)\/([^/]+)(?:\/embed)?\/?$/)?.[1] ?? null
    const code = typeof route.query.ref === 'string' ? route.query.ref : coBrandedSlug
    const entrySurface = coBrandedSlug ? 'co_branded'
      : route.path.startsWith('/book-a-solagree-consult') ? 'booking'
        : route.path.includes('quiz') ? 'quiz' : 'website'
    const operation = queue.catch(() => {}).then(async () => {
      const response = await $fetch<{ context: { journeyId: string, proof: string }, expiresAt: string }>(
        `${normalizePortalApiBaseUrl(config.public.portalApiBaseUrl)}/api/marketing-origin/capture`, {
          method: 'POST', body: { context: remembered?.context ?? null, referralCode: code, entrySurface }
        })
      remembered = response
      storage.setItem(storageKey, JSON.stringify(response))
      journeyId.value = response.context.journeyId
      return response.context
    })
    queue = operation
    return operation
  }
  installMarketingOriginRuntime({
    capture,
    storage: submissionStorage,
    clear: () => { remembered = null; storage.removeItem(storageKey); journeyId.value = null }
  })
  router.afterEach((_to, _from, failure) => { if (!failure) void capture().catch(() => {}) })
  // Attribution outages never create guessed credit. Form submission will retry and surface failure.
  void capture().catch(() => {})
})
