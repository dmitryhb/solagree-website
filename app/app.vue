<script setup lang="ts">
const router = useRouter()
const currentRoute = router.currentRoute
const appShell = ref(currentRoute.value.meta.appShell ?? 'internal')

const removeAfterEach = router.afterEach((to, _from, failure) => {
  if (!failure) {
    appShell.value = to.meta.appShell ?? 'internal'
  }
})

onScopeDispose(removeAfterEach)

const showSiteHeader = computed(() => appShell.value !== 'bare')
const isInternalShell = computed(() => appShell.value === 'internal')
const siteHeaderKey = computed(() => appShell.value)
const pageKey = computed(() => (
  currentRoute.value.path === '/' ? currentRoute.value.path : currentRoute.value.path.replace(/\/+$/, '')
))
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
