<script setup lang="ts">
import ConsultRequestThankYouPage from '~/components/consult/ConsultRequestThankYouPage.vue'
import { attorneyConsultThankYouContent } from '~/data/consult-request'

useSolagreeSeo({
  title: 'Attorney Consult Request Received',
  description: 'Your Solagree attorney consult request has been received.',
  noIndex: true,
  path: '/book-an-attorney-consult/thank-you'
})
</script>

<template>
  <ConsultRequestThankYouPage :content="attorneyConsultThankYouContent" />
</template>
