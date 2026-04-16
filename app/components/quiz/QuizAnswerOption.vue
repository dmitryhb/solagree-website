<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <button
    type="button"
    class="quiz-answer-option"
    :aria-pressed="false"
  >
    {{ label }}
  </button>
</template>
