<script setup lang="ts">
import ContactPage from '~/components/contact/ContactPage.vue'

useSolagreeSeo({
  title: 'Contact Us',
  description:
    'Contact Solagree for divorce process questions, consultation requests, professional partnerships, and client support.',
  path: '/contact',
  image: '/images/contact-person.webp'
})
</script>

<template>
  <ContactPage />
</template>
