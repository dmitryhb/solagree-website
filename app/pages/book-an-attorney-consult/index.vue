<script setup lang="ts">
import ConsultRequestPage from '~/components/consult/ConsultRequestPage.vue'
import { attorneyConsultRequestContent } from '~/data/consult-request'

useSolagreeSeo({
  title: 'Book an Attorney Consult',
  description: 'Request an attorney consult and tell us how our team should contact you.',
  path: '/book-an-attorney-consult'
})
</script>

<template>
  <ConsultRequestPage :content="attorneyConsultRequestContent" />
</template>
