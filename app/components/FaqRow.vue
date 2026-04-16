<script setup lang="ts">
defineProps<{
  question: string
  answer: string
}>()
</script>

<template>
  <details class="faq-row">
    <summary>
      <span>{{ question }}</span>
      <span
        class="faq-row__indicator"
        aria-hidden="true"
      >
        +
      </span>
    </summary>
    <p class="faq-row__body">
      {{ answer }}
    </p>
  </details>
</template>
