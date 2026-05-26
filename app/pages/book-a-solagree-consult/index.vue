<script setup lang="ts">
import ConsultRequestPage from '~/components/consult/ConsultRequestPage.vue'
import { initialConsultRequestContent } from '~/data/consult-request'

useSolagreeSeo({
  title: 'Book a Solagree Consult',
  description: 'Request a Solagree consult and tell us how our team should contact you.',
  path: '/book-a-solagree-consult'
})
</script>

<template>
  <ConsultRequestPage :content="initialConsultRequestContent" />
</template>
