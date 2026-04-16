<script setup lang="ts">
defineProps<{
  title: string
  body: string
}>()
</script>

<template>
  <div class="quiz-explainer">
    <h3 class="quiz-explainer__title">
      {{ title }}
    </h3>
    <p class="quiz-explainer__body">
      {{ body }}
    </p>
  </div>
</template>
