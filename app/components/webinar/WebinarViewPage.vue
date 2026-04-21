<script setup lang="ts">
import WebinarJoinPrompt from '~/components/webinar/WebinarJoinPrompt.vue'
import WebinarVideoFrame from '~/components/webinar/WebinarVideoFrame.vue'
</script>

<template>
  <main class="webinar-view-page">
    <div class="webinar-view-page__content">
      <WebinarVideoFrame />
      <WebinarJoinPrompt />
    </div>

    <SiteFooter />
  </main>
</template>
