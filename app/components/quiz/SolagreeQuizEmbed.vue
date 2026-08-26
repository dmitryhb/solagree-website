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
      showInstructions: props.hostConfig?.display?.showInstructions,
      headingLevel: props.hostConfig?.display?.headingLevel ?? 1
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
