<script setup lang="ts">
withDefaults(defineProps<{
  href: string
  label: string
  arrow?: boolean
}>(), {
  arrow: false
})

defineEmits<{
  activate: []
}>()
</script>

<template>
  <a
    :href="href"
    class="co-branded-page__primary-cta co-branded-page__primary-cta--light"
    :class="{ 'co-branded-page__primary-cta--arrow': arrow }"
    @click.prevent="$emit('activate')"
  >
    {{ label }}
    <img
      v-if="arrow"
      class="button-arrow-icon"
      src="/icons/arrow.svg"
      alt=""
    >
  </a>
</template>
