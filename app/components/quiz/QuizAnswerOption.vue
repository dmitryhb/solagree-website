<script setup lang="ts">
defineProps<{
  id: string
  value: string
  name: string
  label: string
  checked?: boolean
}>()
</script>

<template>
  <label class="quiz-answer-option">
    <input
      :id="id"
      class="quiz-answer-option__control"
      type="radio"
      :name="name"
      :value="value"
      :checked="checked"
    >
    <span class="quiz-answer-option__label">
      {{ label }}
    </span>
  </label>
</template>
