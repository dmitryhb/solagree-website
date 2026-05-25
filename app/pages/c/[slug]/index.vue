<script setup lang="ts">
import AdminIntakePage from '~/components/admin-intake/AdminIntakePage.vue'
import { verifyAdminIntakeSlug } from '~/services/admin-intake-api'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slug = computed(() => String(route.params.slug || '').trim())

const { data: slugValid } = await useAsyncData(
  `admin-intake-slug:${slug.value}`,
  () => verifyAdminIntakeSlug(slug.value, {
    portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
    fetcher: $fetch as <TResponse>(request: string) => Promise<TResponse>
  })
)

if (!slugValid.value) {
  throw createError({ statusCode: 404, fatal: true })
}

useSolagreeSeo({
  title: 'Intake Form',
  description: 'Complete your Solagree intake form.',
  noIndex: true,
  path: `/c/${slug.value}`
})
</script>

<template>
  <AdminIntakePage :slug="slug" />
</template>
