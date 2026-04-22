<script setup lang="ts">
import WatchWebinarForm from '~/components/webinar/WatchWebinarForm.vue'
import WebinarRegistrationIntro from '~/components/webinar/WebinarRegistrationIntro.vue'
</script>

<template>
  <main class="webinar-registration-page">
    <div class="webinar-registration-page__content">
      <WebinarRegistrationIntro v-appear />
      <WatchWebinarForm v-appear="{ delay: 100, variant: 'scale' }" />
    </div>

    <SiteFooter />
  </main>
</template>
