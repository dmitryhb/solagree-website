<script setup lang="ts">
const route = useRoute()
const isInternalShell = computed(() => route.path !== '/')
</script>

<template>
  <UApp>
    <div
      class="app-shell"
      :class="{ 'app-shell--internal': isInternalShell }"
    >
      <AppHeader />
      <NuxtPage />
    </div>
  </UApp>
</template>
