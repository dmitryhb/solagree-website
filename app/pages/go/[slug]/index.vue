<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug || '').trim())
</script>

<template>
  <CoBrandedPageRouteShell
    mode="page"
    :seo-path="`/go/${slug}`"
  />
</template>
