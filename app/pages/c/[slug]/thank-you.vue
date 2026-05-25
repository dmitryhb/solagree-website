<script setup lang="ts">
import AdminIntakeThankYouPage from '~/components/admin-intake/AdminIntakeThankYouPage.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug || '').trim())

useSolagreeSeo({
  title: 'Intake Received',
  description: 'Your Solagree intake form has been received.',
  noIndex: true,
  path: `/c/${slug.value}/thank-you`
})
</script>

<template>
  <AdminIntakeThankYouPage />
</template>
