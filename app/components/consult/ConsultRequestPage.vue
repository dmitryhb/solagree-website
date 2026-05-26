<script setup lang="ts">
import ConsultRequestForm from '~/components/consult/ConsultRequestForm.vue'
import type { ConsultRequestPageContent } from '~/types/consult-request'

defineProps<{
  content: ConsultRequestPageContent
}>()
</script>

<template>
  <main class="consult-request-page">
    <section class="consult-request-page__content">
      <ConsultRequestForm :content="content" />
    </section>

    <SiteFooter />
  </main>
</template>
