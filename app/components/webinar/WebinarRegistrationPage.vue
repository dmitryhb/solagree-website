<script setup lang="ts">
import { attorneyWebinarRegistrationContent } from '~/data/webinar-registration'
import WatchWebinarForm from '~/components/webinar/WatchWebinarForm.vue'
import WebinarRegistrationIntro from '~/components/webinar/WebinarRegistrationIntro.vue'
import type { WebinarRegistrationContent } from '~/types/webinar'

interface WebinarRegistrationPageProps {
  content?: WebinarRegistrationContent
}

withDefaults(defineProps<WebinarRegistrationPageProps>(), {
  content: () => attorneyWebinarRegistrationContent
})
</script>

<template>
  <main class="webinar-registration-page">
    <div class="webinar-registration-page__content">
      <WebinarRegistrationIntro
        v-appear
        :content="content"
      />
      <WatchWebinarForm
        v-appear="{ delay: 100, variant: 'scale' }"
        :subtitle="content.formSubtitle"
        :redirect-path="content.formRedirectPath"
        :submission-type="content.submissionType"
      />
    </div>

    <SiteFooter />
  </main>
</template>
