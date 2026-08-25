<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

withDefaults(defineProps<{
  /**
   * Visual and accessibility variant. Errors announce assertively through
   * role="alert"; success results announce politely through role="status".
   */
  kind: 'error' | 'success'
  /** Optional bold heading rendered above the message or slot content. */
  title?: string
  /**
   * Plain result message. Alternatively, provide richer content through the
   * default slot; the message prop takes precedence when both are given.
   */
  message?: string
}>(), {
  title: '',
  message: ''
})

const resultEl = ref<HTMLElement | null>(null)

// The result replaces the context the user was acting on — the submit button
// is re-enabled or the form swaps out — so focus moves to the message once it
// renders (HIR-369 contract: errors use role="alert" plus focus, success uses
// role="status" plus focus of the replacement content).
onMounted(async () => {
  await nextTick()
  resultEl.value?.focus()
})
</script>

<template>
  <div
    ref="resultEl"
    class="form-result-message"
    :class="`form-result-message--${kind}`"
    :role="kind === 'error' ? 'alert' : 'status'"
    :aria-live="kind === 'error' ? undefined : 'polite'"
    tabindex="-1"
  >
    <p
      v-if="title"
      class="form-result-message__title"
    >
      {{ title }}
    </p>
    <p v-if="message">
      {{ message }}
    </p>
    <slot v-if="!message" />
  </div>
</template>
