<script setup lang="ts">
defineProps<{
  label: string
  disabled?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="quiz-primary-action"
    :disabled="disabled"
  >
    {{ label }}
  </button>
</template>
