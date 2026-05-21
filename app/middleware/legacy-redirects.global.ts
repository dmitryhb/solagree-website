import { findLegacyRedirectTarget } from '~/data/legacy-redirects'

export default defineNuxtRouteMiddleware((to) => {
  const redirectTarget = findLegacyRedirectTarget(to.path)

  if (redirectTarget === undefined) {
    return undefined
  }

  return navigateTo(redirectTarget, { redirectCode: 301 })
})
