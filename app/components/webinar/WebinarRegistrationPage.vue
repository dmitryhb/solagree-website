<script setup lang="ts">
import WatchWebinarForm from '~/components/webinar/WatchWebinarForm.vue'
import WebinarRegistrationIntro from '~/components/webinar/WebinarRegistrationIntro.vue'
</script>

<template>
  <main class="webinar-registration-page">
    <div class="webinar-registration-page__content">
      <WebinarRegistrationIntro />
      <WatchWebinarForm />
    </div>

    <SiteFooter />
  </main>
</template>
