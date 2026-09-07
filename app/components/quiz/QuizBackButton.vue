<script setup lang="ts">
defineProps<{
  label: string
  disabled?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="quiz-back-button"
    :disabled="disabled"
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
