<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isNotFound = computed(() => props.error.statusCode === 404)

const title = computed(() => (isNotFound.value ? 'Page not found' : 'Something went wrong'))
const eyebrow = computed(() => (isNotFound.value ? '404' : String(props.error.statusCode || 'Error')))
const description = computed(() =>
  isNotFound.value
    ? 'The page you are looking for may have moved, or the link may no longer be available.'
    : 'We could not load this page. Please try again, or return home to continue.'
)

function handleHome() {
  clearError({ redirect: '/' })
}

function handleQuiz() {
  clearError({ redirect: '/#quiz' })
}
</script>

<template>
  <UApp>
    <div class="app-shell app-shell--internal">
      <SkipLink />
      <AppHeader />

      <div
        id="main-content"
        class="main-content-anchor"
        tabindex="-1"
      >
        <ErrorPageContent
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        >
          <template #actions>
            <button
              class="sol-button sol-button--primary"
              type="button"
              @click="handleHome"
            >
              Return home
            </button>

            <button
              class="sol-button sol-button--muted"
              type="button"
              @click="handleQuiz"
            >
              Take the quiz
            </button>
          </template>
        </ErrorPageContent>
      </div>
    </div>
  </UApp>
</template>
