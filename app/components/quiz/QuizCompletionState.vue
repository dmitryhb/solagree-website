<script setup lang="ts">
defineProps<{
  title: string
  body: string
}>()
</script>

<template>
  <div class="quiz-completion-state">
    <h3 class="quiz-completion-state__title">
      {{ title }}
    </h3>
    <p class="quiz-completion-state__body">
      {{ body }}
    </p>
  </div>
</template>
