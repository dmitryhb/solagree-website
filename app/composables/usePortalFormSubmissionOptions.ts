import { getCurrentScope, onScopeDispose } from 'vue'
import { websitePortalFetcher } from '~/services/portal-api'

export const usePortalFormSubmissionOptions = () => {
  const runtimeConfig = useRuntimeConfig()
  const controller = new AbortController()
  if (getCurrentScope()) onScopeDispose(() => controller.abort())

  return {
    portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
    fetcher: websitePortalFetcher,
    signal: controller.signal
  } as const
}
