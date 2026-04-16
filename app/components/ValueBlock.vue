<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="value-block">
    <span class="value-block__badge">{{ icon }}</span>
    <div class="space-y-3">
      <h3 class="value-block__title">
        {{ title }}
      </h3>
      <p class="value-block__body">
        {{ description }}
      </p>
    </div>
  </div>
</template>
