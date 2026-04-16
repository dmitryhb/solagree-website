<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <button
    type="button"
    class="quiz-primary-action"
  >
    {{ label }}
  </button>
</template>
