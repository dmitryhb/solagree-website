<script setup lang="ts">
const route = useRoute()
const appShell = computed(() => route.meta.appShell ?? 'internal')
const showSiteHeader = computed(() => appShell.value !== 'bare')
const isInternalShell = computed(() => appShell.value === 'internal')
const siteHeaderKey = computed(() => appShell.value)
const pageKey = computed(() => (route.path === '/' ? route.path : route.path.replace(/\/+$/, '')))
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
      <SkipLink />
      <AppHeader
        v-if="showSiteHeader"
        :key="siteHeaderKey"
      />
      <div
        id="main-content"
        class="main-content-anchor"
        tabindex="-1"
      >
        <NuxtPage
          :page-key="pageKey"
          :transition="pageTransition"
        />
      </div>
    </div>
  </UApp>
</template>
