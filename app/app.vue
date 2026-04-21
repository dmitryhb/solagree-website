<script setup lang="ts">
const route = useRoute()
const normalizedRoutePath = computed(() => (route.path === '/' ? route.path : route.path.replace(/\/+$/, '')))
const isQuizRoute = computed(() => normalizedRoutePath.value === '/quiz')
const showSiteHeader = computed(() => !isQuizRoute.value)
const isInternalShell = computed(() => normalizedRoutePath.value !== '/' && !isQuizRoute.value)
const pageKey = computed(() => normalizedRoutePath.value)
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
