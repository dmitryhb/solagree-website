<script setup lang="ts">
const props = withDefaults(defineProps<{
  alt: string
  src?: string
}>(), {
  src: ''
})

const imageUnavailable = ref(false)
const hasImage = computed(() => Boolean(props.src.trim()) && !imageUnavailable.value)

const showFallback = (): void => {
  imageUnavailable.value = true
}
</script>

<template>
  <div class="blog-media">
    <img
      v-if="hasImage"
      :src="src"
      :alt="alt"
      loading="lazy"
      @error="showFallback"
    >
    <div
      v-else
      class="blog-media__fallback"
      aria-hidden="true"
    >
      <span>Solagree</span>
    </div>
  </div>
</template>
