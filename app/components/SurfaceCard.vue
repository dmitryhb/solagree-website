<script setup lang="ts">
withDefaults(defineProps<{
  as?: string
  tone?: 'light' | 'muted' | 'dark'
  padding?: 'md' | 'lg'
}>(), {
  as: 'article',
  tone: 'light',
  padding: 'lg'
})
</script>

<template>
  <component
    :is="as"
    :class="[
      'surface-card',
      tone !== 'light' && `surface-card--${tone}`,
      `surface-card--padded-${padding}`
    ]"
  >
    <slot />
  </component>
</template>
