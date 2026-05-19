<script setup lang="ts">
useSolagreeSeo({
  title: 'Application Received',
  description: 'Your Solagree CDFA Network application has been received.',
  noIndex: true,
  path: '/cdfa-application/sent'
})
</script>

<template>
  <ApplicationSentPage
    title-id="cdfa-application-sent-title"
    description="Our team will review your CDFA® Network application and email you with next steps. We usually respond within 1-2 business days."
  />
</template>
