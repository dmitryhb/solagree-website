<script setup lang="ts">
const props = defineProps<{
  id: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <div class="sms-opt-in">
    <label
      class="sms-opt-in__label"
      :for="props.id"
    >
      <input
        :id="props.id"
        class="sms-opt-in__checkbox"
        type="checkbox"
        name="smsOptIn"
        :checked="props.modelValue"
        @change="updateValue"
      >
      <span>Yes, I agree to receive text messages from Solagree.</span>
    </label>

    <p class="sms-opt-in__disclaimer">
      By checking this box, you agree to receive text messages from Solagree regarding your inquiry, case status updates, appointment reminders, and service information. Message frequency varies. Message and data rates may apply. Text HELP for help. Text STOP to unsubscribe. View our
      <NuxtLink to="/legal/privacy-policy">
        Privacy Policy
      </NuxtLink>
      and
      <NuxtLink to="/legal/terms-of-service">
        Terms of Service
      </NuxtLink>.
    </p>
  </div>
</template>
