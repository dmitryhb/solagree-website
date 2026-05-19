<script setup lang="ts">
useSolagreeSeo({
  title: 'Application Received',
  description: 'Your Solagree attorney partner application has been received.',
  noIndex: true,
  path: '/attorney-application/sent'
})
</script>

<template>
  <ApplicationSentPage
    title-id="attorney-application-sent-title"
    description="Our team will review your application and email you with next steps. We usually respond within 1-2 business days."
  />
</template>
