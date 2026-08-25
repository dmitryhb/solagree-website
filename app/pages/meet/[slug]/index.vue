<script setup lang="ts">
import AdminIntakePage from '~/components/admin-intake/AdminIntakePage.vue'
import { verifyAdminIntakeSlug } from '~/services/admin-intake-api'
import type { AdminIntakeSlugVerification } from '~/services/admin-intake-api'
import { isPortalApiConfigurationError } from '~/services/portal-api'

const VERIFICATION_UNAVAILABLE_STATUS_MESSAGE = 'We could not verify this intake link right now. Please try again.'
const VERIFICATION_FALLBACK_STATUS_CODE = 502

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slug = computed(() => String(route.params.slug || '').trim())
const asyncDataKey = computed(() => `admin-intake-slug:${slug.value}`)

const getPortalErrorStatusCode = (error: unknown): number | null => {
  if (typeof error !== 'object' || error === null || !('statusCode' in error)) {
    return null
  }

  const { statusCode } = error as { statusCode?: unknown }

  return typeof statusCode === 'number' ? statusCode : null
}

/**
 * Converts a portal verification failure into the route error that should be
 * surfaced, never labelling an upstream failure as a missing slug.
 */
const createVerificationRouteError = (error: unknown) => {
  if (isPortalApiConfigurationError(error)) {
    return createError({
      statusCode: 500,
      statusMessage: VERIFICATION_UNAVAILABLE_STATUS_MESSAGE,
      fatal: true
    })
  }

  const statusCode = getPortalErrorStatusCode(error)

  if (statusCode === 404) {
    return createError({ statusCode: 404, fatal: true })
  }

  if (statusCode !== null && statusCode >= 400) {
    return createError({
      statusCode,
      statusMessage: VERIFICATION_UNAVAILABLE_STATUS_MESSAGE,
      fatal: true
    })
  }

  return createError({
    statusCode: VERIFICATION_FALLBACK_STATUS_CODE,
    statusMessage: VERIFICATION_UNAVAILABLE_STATUS_MESSAGE,
    fatal: true
  })
}

const {
  data: slugVerification,
  error: verificationError,
  status
} = await useAsyncData(
  asyncDataKey,
  async (): Promise<AdminIntakeSlugVerification> => {
    try {
      return await verifyAdminIntakeSlug(slug.value, {
        portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
        fetcher: $fetch as <TResponse>(request: string) => Promise<TResponse>
      })
    } catch (portalError) {
      throw createVerificationRouteError(portalError)
    }
  },
  {
    watch: [slug]
  }
)

/**
 * Resolves the error that must be surfaced for the currently verified slug:
 * a fatal 404 only when the portal confirmed the slug is missing, and the
 * preserved upstream status for 5xx, timeout, network, configuration, and
 * malformed-payload failures.
 */
const routeError = computed(() => {
  if (status.value === 'error') {
    return verificationError.value ?? createError({
      statusCode: VERIFICATION_FALLBACK_STATUS_CODE,
      statusMessage: VERIFICATION_UNAVAILABLE_STATUS_MESSAGE,
      fatal: true
    })
  }

  if (status.value !== 'success') {
    return null
  }

  if (slugVerification.value?.status === 'missing') {
    return createError({ statusCode: 404, fatal: true })
  }

  if (slugVerification.value?.status === 'invalid-response') {
    return createError({
      statusCode: VERIFICATION_FALLBACK_STATUS_CODE,
      statusMessage: VERIFICATION_UNAVAILABLE_STATUS_MESSAGE,
      fatal: true
    })
  }

  return null
})

if (routeError.value) {
  throw routeError.value
}

watch(routeError, (intakeRouteError) => {
  if (intakeRouteError) {
    showError(intakeRouteError)
  }
})

/**
 * Gating on `status === 'success'` guarantees the form only renders for the
 * slug that was verified: Nuxt hands the previous slug's data to the new key
 * while a parameter navigation refetch is still pending.
 */
const isSlugVerified = computed(() => status.value === 'success' && slugVerification.value?.status === 'verified')
const isVerifyingSlug = computed(() => status.value === 'idle' || status.value === 'pending')

useSolagreeSeo({
  title: 'Intake Form',
  description: 'Complete your Solagree intake form.',
  noIndex: true,
  path: computed(() => `/meet/${slug.value}`)
})
</script>

<template>
  <AdminIntakePage
    v-if="isSlugVerified"
    :slug="slug"
  />

  <div
    v-else-if="isVerifyingSlug"
    class="admin-intake-route__state"
    role="status"
    aria-label="Verifying intake link"
  >
    <p class="admin-intake-route__state-message">
      Verifying your intake link…
    </p>
  </div>
</template>
