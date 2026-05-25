<script setup lang="ts">
import AdminIntakeForm from '~/components/admin-intake/AdminIntakeForm.vue'

defineProps<{
  slug: string
}>()
</script>

<template>
  <main class="consult-request-page">
    <section class="consult-request-page__content">
      <AdminIntakeForm :slug="slug" />
    </section>

    <SiteFooter />
  </main>
</template>
