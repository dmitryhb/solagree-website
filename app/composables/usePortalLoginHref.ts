export const usePortalLoginHref = () => {
  const runtimeConfig = useRuntimeConfig()

  return computed(() => {
    const portalUrl = String(runtimeConfig.public.portalUrl || '').trim().replace(/\/+$/, '')

    return portalUrl || '/'
  })
}
