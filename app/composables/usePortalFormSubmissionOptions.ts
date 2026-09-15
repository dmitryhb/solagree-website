import { websitePortalFetcher } from '~/services/portal-api'

export const usePortalFormSubmissionOptions = () => {
  const runtimeConfig = useRuntimeConfig()

  return {
    portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
    fetcher: websitePortalFetcher
  } as const
}
