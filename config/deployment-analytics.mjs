/** Resolve deployment identity independently from Nuxt's production build mode. */
export function deploymentAnalytics(env = process.env) {
  const environment = env.NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT ?? 'dev'
  if (!['dev', 'staging', 'production'].includes(environment)) {
    throw new Error('NUXT_PUBLIC_DEPLOYMENT_ENVIRONMENT must be dev, staging or production')
  }
  // Missing and explicitly empty IDs both disable analytics in every environment.
  // In particular, staging generation must never inherit a production property.
  const measurementId = (env.NUXT_PUBLIC_GA_MEASUREMENT_ID ?? '').trim()
  if (measurementId && !/^G-[A-Z0-9]+$/.test(measurementId)) {
    throw new Error('NUXT_PUBLIC_GA_MEASUREMENT_ID must be a GA4 measurement ID or empty')
  }
  return { environment, ga: { enabled: Boolean(measurementId), measurementId } }
}
