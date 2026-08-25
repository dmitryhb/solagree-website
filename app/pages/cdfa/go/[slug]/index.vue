<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug || '').trim())
</script>

<template>
  <CoBrandedPageRouteShell
    mode="page"
    page-type="cdfa"
    :seo-path="`/cdfa/go/${slug}`"
    no-index
  />
</template>
