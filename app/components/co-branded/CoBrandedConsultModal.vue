<script setup lang="ts">
import type { ConsultType } from '#shared/types/consult-request'
import {
  getConsultRequestSubmissionErrorMessage,
  submitCoBrandedConsultRequest
} from '~/services/consult-request-api'
import { isPortalApiConfigurationError } from '~/services/portal-api'
import type { ConsultRequestFetcher } from '~/services/consult-request-api'

const props = defineProps<{
  open: boolean
  companyName: string
  partnerSlug: string
  consultType: ConsultType
}>()

const emit = defineEmits<{
  close: []
}>()

const runtimeConfig = useRuntimeConfig()
const sourceUrl = useSourceUrl()

const formEl = ref<HTMLFormElement | null>(null)
const firstNameInput = ref<HTMLInputElement | null>(null)
const submitting = ref(false)
const submitted = ref(false)
const submissionError = ref('')
const form = reactive({
  firstName: '',
  lastName: '',
  email: ''
})

const title = computed(() => (
  props.consultType === 'attorney'
    ? 'Request a Solagree attorney consultation'
    : 'Request a Solagree consultation'
))

const resetForm = (): void => {
  form.firstName = ''
  form.lastName = ''
  form.email = ''
  submissionError.value = ''
  submitted.value = false
}

const handleClose = (): void => {
  if (submitting.value) {
    return
  }

  emit('close')
}

const handleSubmit = async (): Promise<void> => {
  if (submitting.value) {
    return
  }

  submissionError.value = ''

  if (!formEl.value?.checkValidity()) {
    formEl.value?.reportValidity()
    return
  }

  submitting.value = true

  try {
    await submitCoBrandedConsultRequest(form, {
      portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
      fetcher: $fetch as unknown as ConsultRequestFetcher,
      consultType: props.consultType,
      referralCode: props.partnerSlug,
      sourceUrl
    })

    submitted.value = true
  } catch (error) {
    if (isPortalApiConfigurationError(error)) {
      console.error(error)
    }

    submissionError.value = getConsultRequestSubmissionErrorMessage(error)
  } finally {
    submitting.value = false
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) {
      resetForm()
      return
    }

    await nextTick()
    firstNameInput.value?.focus()
  }
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="co-branded-consult-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="co-branded-consult-modal-title"
      @keydown.esc="handleClose"
    >
      <button
        class="co-branded-consult-modal__backdrop"
        type="button"
        aria-label="Close consultation form"
        @click="handleClose"
      />

      <section class="co-branded-consult-modal__panel">
        <button
          class="co-branded-consult-modal__close"
          type="button"
          aria-label="Close consultation form"
          :disabled="submitting"
          @click="handleClose"
        >
          <span aria-hidden="true" />
        </button>

        <div
          v-if="submitted"
          class="co-branded-consult-modal__state"
        >
          <p class="co-branded-consult-modal__eyebrow">
            Request sent
          </p>
          <h2 id="co-branded-consult-modal-title">
            Thank you. We received your request.
          </h2>
          <p>
            Solagree and {{ companyName }} have been notified. Someone will follow up with next steps.
          </p>
          <button
            class="co-branded-consult-modal__submit"
            type="button"
            @click="handleClose"
          >
            Close
          </button>
        </div>

        <form
          v-else
          ref="formEl"
          class="co-branded-consult-modal__form"
          @submit.prevent="handleSubmit"
        >
          <div class="co-branded-consult-modal__header">
            <p class="co-branded-consult-modal__eyebrow">
              {{ companyName }}
            </p>
            <h2 id="co-branded-consult-modal-title">
              {{ title }}
            </h2>
          </div>

          <div class="co-branded-consult-modal__fields">
            <label>
              <span>First name</span>
              <input
                ref="firstNameInput"
                v-model="form.firstName"
                name="firstName"
                type="text"
                autocomplete="given-name"
                required
              >
            </label>

            <label>
              <span>Last name</span>
              <input
                v-model="form.lastName"
                name="lastName"
                type="text"
                autocomplete="family-name"
                required
              >
            </label>

            <label>
              <span>Email</span>
              <input
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
              >
            </label>
          </div>

          <p
            v-if="submissionError"
            class="co-branded-consult-modal__error"
            role="alert"
          >
            {{ submissionError }}
          </p>

          <button
            class="co-branded-consult-modal__submit"
            type="submit"
            :disabled="submitting"
          >
            {{ submitting ? 'Submitting...' : 'Submit request' }}
          </button>
        </form>
      </section>
    </div>
  </Teleport>
</template>
