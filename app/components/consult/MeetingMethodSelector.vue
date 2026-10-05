<script setup lang="ts">
import type { InitialConsultMeetingMethod } from '#shared/initial-consult-booking'

defineProps<{
  selectedMethod: InitialConsultMeetingMethod | null
}>()

const emit = defineEmits<{
  select: [method: InitialConsultMeetingMethod]
}>()

const methods = [
  { id: 'phone', label: 'Phone call', description: 'Your consultant will call the number you provide.' },
  { id: 'zoom', label: 'Zoom', description: 'Join using your Zoom meeting link.' }
] as const
</script>

<template>
  <fieldset class="meeting-method-selector">
    <legend>How we’ll meet</legend>
    <label
      v-for="method in methods"
      :key="method.id"
      class="meeting-method-selector__option"
    >
      <input
        type="radio"
        name="initial-consult-meeting-method"
        :value="method.id"
        :checked="selectedMethod === method.id"
        @change="emit('select', method.id)"
      >
      <span>
        <strong>{{ method.label }}</strong>
        <span class="meeting-method-selector__description">{{ method.description }}</span>
      </span>
    </label>
  </fieldset>
</template>

<style scoped lang="scss">
.meeting-method-selector {
  display: block;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;

  legend {
    margin-bottom: 12px;
    font-weight: 600;
  }

  &__option {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
    border: 1px solid currentColor;
    border-radius: 8px;
    cursor: pointer;

    & + & {
      margin-top: 12px;
    }

    &:has(input:focus-visible) {
      outline: 2px solid currentColor;
      outline-offset: 3px;
    }

    input {
      flex-shrink: 0;
      margin-top: 5px;
    }
  }

  &__description {
    display: block;
    margin-top: 4px;
    font-size: 0.875em;
  }
}
</style>
