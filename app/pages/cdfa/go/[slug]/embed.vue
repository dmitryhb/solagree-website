<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug || '').trim())
</script>

<template>
  <CoBrandedPageRouteShell
    mode="embed"
    page-type="cdfa"
    :seo-path="`/cdfa/go/${slug}/embed`"
    no-index
    wrapper-class="co-branded-page-route--embed"
  />
</template>
