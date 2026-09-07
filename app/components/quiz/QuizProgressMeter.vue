<script setup lang="ts">
defineProps<{
  value: number
}>()
</script>

<template>
  <div
    class="quiz-progress-meter"
    role="progressbar"
    aria-label="Quiz progress"
    :aria-valuenow="value"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="quiz-progress-meter__fill"
      :style="{ width: `${value}%` }"
    />
  </div>
</template>
