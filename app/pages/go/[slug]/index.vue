<script setup lang="ts">
definePageMeta({
  appShell: 'bare'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || '').trim())
</script>

<template>
  <CoBrandedPageRouteShell
    mode="page"
    :seo-path="`/go/${slug}`"
    no-index
  />
</template>
