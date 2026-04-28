<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug || '').trim())
</script>

<template>
  <CoBrandedPageRouteShell
    mode="embed"
    :seo-path="`/co-branded/${slug}/embed`"
    no-index
    wrapper-class="co-branded-page-route--embed"
  />
</template>
