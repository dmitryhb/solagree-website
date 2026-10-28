import type { ProfessionalTermsAvailability } from '#shared/types/professional-terms'
import { fetchFromPortal, normalizePortalApiBaseUrl, websitePortalFetcher } from '~/services/portal-api'

/** Loads the portal's current approved document in the browser for the static website. */
export const useProfessionalTerms = () => {
  const terms = ref<ProfessionalTermsAvailability>({ available: false, current: null })
  const portalApiBaseUrl = useRuntimeConfig().public.portalApiBaseUrl

  const refresh = async (): Promise<void> => {
    try {
      const baseUrl = normalizePortalApiBaseUrl(portalApiBaseUrl)
      const response = await fetchFromPortal<ProfessionalTermsAvailability>(`${baseUrl}/api/public/professional-terms`, { fetcher: websitePortalFetcher })
      terms.value = response?.available === true && response.current?.version && response.current.url
        ? response
        : { available: false, current: null }
    } catch {
      terms.value = { available: false, current: null }
    }
  }

  onMounted(() => { void refresh() })

  return { terms, refresh }
}
