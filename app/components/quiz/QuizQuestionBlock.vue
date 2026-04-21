<script setup lang="ts">
import type { QuizQuestionDefinition, QuizQuestionValue } from '~/data/quiz-types'

const props = defineProps<{
  question: QuizQuestionDefinition
  value?: QuizQuestionValue
}>()

const emit = defineEmits<{
  singleChange: [payload: { questionId: QuizQuestionDefinition['id'], value: string | undefined }]
  multiChange: [payload: { questionId: QuizQuestionDefinition['id'], value: string, checked: boolean }]
}>()

const legendId = computed(() => `${props.question.id}-legend`)
const descriptionId = computed(() => `${props.question.id}-description`)
</script>

<template>
  <fieldset
    class="quiz-question-block"
    :aria-describedby="question.description ? descriptionId : undefined"
  >
    <legend
      :id="legendId"
      class="quiz-question-block__title"
    >
      {{ question.title }}
    </legend>

    <p
      v-if="question.description"
      :id="descriptionId"
      class="quiz-question-block__description"
    >
      {{ question.description }}
    </p>

    <QuizSelectField
      v-if="question.kind === 'select'"
      :id="question.id"
      :options="question.options"
      :value="typeof value === 'string' ? value : undefined"
      :placeholder="question.placeholder"
      :labelled-by="legendId"
      :described-by="question.description ? descriptionId : undefined"
      @update:value="emit('singleChange', { questionId: question.id, value: $event })"
    />

    <QuizAnswerGroup
      v-else
      :name="question.id"
      :type="question.kind"
      :options="question.options"
      :value="value"
      @change="question.kind === 'multi-select'
        ? emit('multiChange', { questionId: question.id, ...$event })
        : emit('singleChange', { questionId: question.id, value: $event.value })"
    />
  </fieldset>
</template>
