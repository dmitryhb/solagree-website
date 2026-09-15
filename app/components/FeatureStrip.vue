<script setup lang="ts">
defineProps<{
  items: readonly string[]
}>()
</script>

<template>
  <section class="feature-strip" aria-label="Solagree benefits">
    <ul>
      <li v-for="item in items" :key="item">
        {{ item }}
      </li>
    </ul>
  </section>
</template>
