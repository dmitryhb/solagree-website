<script setup lang="ts">
const props = withDefaults(defineProps<{
  alt: string
  /** Chooses whether an editorial photo crops or a publisher logo stays fully visible. */
  fit?: 'contain' | 'cover'
  src?: string
}>(), {
  fit: 'cover',
  src: ''
})

const imageUnavailable = ref(false)
const hasImage = computed(() => Boolean(props.src.trim()) && !imageUnavailable.value)

const showFallback = (): void => {
  imageUnavailable.value = true
}
</script>

<template>
  <div
    class="blog-media"
    :class="{ 'blog-media--contain': fit === 'contain' }"
  >
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
