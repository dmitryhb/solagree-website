<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <button
    type="button"
    class="quiz-back-button"
  >
    <span
      class="quiz-back-button__icon"
      aria-hidden="true"
    >
      arrow_back
    </span>
    <span>{{ label }}</span>
  </button>
</template>
