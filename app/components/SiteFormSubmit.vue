<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  submitting?: boolean
}>(), {
  submitting: false
})
</script>

<template>
  <button
    class="site-form-submit"
    type="submit"
    :disabled="submitting"
  >
    <span>{{ submitting ? 'SENDING...' : label }}</span>
    <img
      class="site-form-submit__icon"
      src="/icons/send.svg"
      alt=""
      width="16"
      height="16"
      aria-hidden="true"
    >
  </button>
</template>
