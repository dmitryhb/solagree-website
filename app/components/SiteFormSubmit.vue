<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  /** Label rendered (and politely announced) while the request is in flight. */
  submittingLabel?: string
  submitting?: boolean
  /** Whether to render the default trailing send icon. */
  icon?: boolean
}>(), {
  submittingLabel: 'SENDING...',
  submitting: false,
  icon: true
})
</script>

<template>
  <button
    class="site-form-submit"
    type="submit"
    :disabled="submitting"
  >
    <span aria-live="polite">{{ submitting ? submittingLabel : label }}</span>
    <slot name="icon">
      <img
        v-if="icon"
        class="site-form-submit__icon"
        src="/icons/send.svg"
        alt=""
        width="16"
        height="16"
        aria-hidden="true"
      >
    </slot>
  </button>
</template>
