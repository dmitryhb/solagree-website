<script setup lang="ts">
const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value)
const normalizedRoutePath = computed(() => (
  currentRoute.value.path === '/' ? currentRoute.value.path : currentRoute.value.path.replace(/\/+$/, '')
))
const quizShellRoutes = new Set(['/quiz', '/quiz/embed'])
const isQuizRoute = computed(() => quizShellRoutes.has(normalizedRoutePath.value))
const showSiteHeader = computed(() => !isQuizRoute.value)
const isInternalShell = computed(() => normalizedRoutePath.value !== '/' && !isQuizRoute.value)
const siteHeaderKey = computed(() => (isInternalShell.value ? 'internal' : 'home'))
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
