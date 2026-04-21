<script setup lang="ts">
const route = useRoute()
const isQuizRoute = computed(() => route.path === '/quiz')
const showSiteHeader = computed(() => !isQuizRoute.value)
const isInternalShell = computed(() => route.path !== '/' && !isQuizRoute.value)
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
      <AppHeader v-if="showSiteHeader" />
      <NuxtPage
        :page-key="pageKey"
        :transition="pageTransition"
      />
    </div>
  </UApp>
</template>
