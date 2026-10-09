import type { ProfessionalTermsAvailability } from '#shared/types/professional-terms'
import { normalizePortalApiBaseUrl } from '~/services/portal-api'

/** Loads and checks the approved document, retaining retryable failures separately from unavailability. */
export const useProfessionalTerms = () => {
  const terms = ref<ProfessionalTermsAvailability>({ available: false, current: null })
  const status = ref<'loading' | 'ready' | 'unavailable' | 'error'>('loading')
  const portalApiBaseUrl = useRuntimeConfig().public.portalApiBaseUrl
  let generation = 0

  const refresh = async (): Promise<void> => {
    const requestGeneration = ++generation
    status.value = 'loading'
    terms.value = { available: false, current: null }
    try {
      const baseUrl = normalizePortalApiBaseUrl(portalApiBaseUrl)
      const response = await $fetch<ProfessionalTermsAvailability>(`${baseUrl}/api/public/professional-terms`, { timeout: 15000 })
      if (requestGeneration !== generation) return
      if (response?.available === false) {
        status.value = 'unavailable'
        return
      }
      if (response?.available !== true || response.current?.documentId !== 'solagree-partner-terms'
        || !response.current.version?.trim() || !response.current.url
        || new URL(response.current.url).protocol !== 'https:') throw new Error('Invalid terms response')
      terms.value = response
      status.value = 'ready'
    } catch {
      if (requestGeneration === generation) status.value = 'error'
    }
  }

  onMounted(() => { void refresh() })
  return { terms, status, refresh }
}
