<script setup lang="ts">
const route = useRoute()
const isInternalShell = computed(() => route.path !== '/')
const pageKey = computed(() => route.path)
const pageTransition = {
  name: 'page-appear',
  mode: 'out-in',
  appear: true
} as const
</script>

<template>
  <UApp>
    <div
      class="app-shell"
      :class="{ 'app-shell--internal': isInternalShell }"
    >
      <AppHeader />
      <NuxtPage
        :page-key="pageKey"
        :transition="pageTransition"
      />
    </div>
  </UApp>
</template>
