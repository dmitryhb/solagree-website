<script setup lang="ts">
import QuizSection from '~/components/quiz/QuizSection.vue'
import type { QuizHostConfigInput, QuizHostEvent } from '~/data/quiz-types'

const props = defineProps<{
  hostConfig?: QuizHostConfigInput
}>()

const emit = defineEmits<{
  hostEvent: [event: QuizHostEvent]
}>()

const embeddedHostConfig = computed<QuizHostConfigInput>(() => {
  return {
    ...props.hostConfig,
    mode: props.hostConfig?.mode ?? 'embedded',
    display: {
      showShellHeader: props.hostConfig?.display?.showShellHeader ?? false,
      showExplainer: props.hostConfig?.display?.showExplainer
    }
  }
})
</script>

<template>
  <QuizSection
    :host-config="embeddedHostConfig"
    @host-event="emit('hostEvent', $event)"
  />
</template>
