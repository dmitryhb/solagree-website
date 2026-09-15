<script setup lang="ts">
import type { CoBrandedPageType } from '#shared/co-branded-page-variant'
import ApplicationSelectField from '~/components/application/ApplicationSelectField.vue'
import ApplicationTextField from '~/components/application/ApplicationTextField.vue'
import { useModalDialog } from '~/composables/useModalDialog'
import { usePortalFormSubmissionOptions } from '~/composables/usePortalFormSubmissionOptions'
import {
  getConsultRequestSubmissionErrorMessage,
  submitCoBrandedConsultRequest
} from '~/services/consult-request-api'
import type { CoBrandedConsultRequestFormState } from '~/types/consult-request'
import { validateNativeForm } from '~/utils/native-form-validation'

const props = defineProps<{
  open: boolean
  companyName: string
  partnerSlug: string
  pageType: CoBrandedPageType
}>()

const emit = defineEmits<{
  close: []
}>()

const portalSubmissionOptions = usePortalFormSubmissionOptions()
const sourceUrl = useSourceUrl()
const { trackEvent } = useGoogleAnalytics()

const formEl = ref<HTMLFormElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const successHeading = ref<HTMLElement | null>(null)
const submitted = ref(false)

const createInitialForm = (): CoBrandedConsultRequestFormState => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  smsOptIn: false,
  preferredContactMethod: '',
  spouseFirstName: '',
  spouseLastName: ''
})

const form = reactive<CoBrandedConsultRequestFormState>(createInitialForm())
const isAttorneyVariant = computed(() => props.pageType === 'standard')
const hasPhone = computed(() => Boolean(form.phone.trim()))

const {
  submitting,
  submissionResult,
  resetSubmissionResult,
  handleSubmit
} = useApplicationSubmission<CoBrandedConsultRequestFormState, Awaited<ReturnType<typeof submitCoBrandedConsultRequest>>>({
  validate: () => validateNativeForm(formEl.value),
  getFormState: () => form,
  submit: (formState) => submitCoBrandedConsultRequest(formState, {
    ...portalSubmissionOptions,
    pageType: props.pageType,
    referralCode: props.partnerSlug,
    sourceUrl
  }),
  onSuccess: async () => {
    trackEvent('consultation_booked', {
      consult_type: 'initial',
      co_branded_page_type: props.pageType,
      referral_code: props.partnerSlug,
      source: 'co_branded_consult_modal'
    })

    submitted.value = true
    await nextTick()
    successHeading.value?.focus()
  },
  errorTitle: '',
  getErrorMessage: getConsultRequestSubmissionErrorMessage
})

const resetForm = (): void => {
  Object.assign(form, createInitialForm())
  resetSubmissionResult()
  submitted.value = false
}

const handleClose = (): void => {
  if (submitting.value) {
    return
  }

  emit('close')
}

const modalDialog = useModalDialog({
  getContainer: () => panelEl.value,
  getInitialFocusTarget: () => formEl.value?.querySelector<HTMLInputElement>('#co-branded-first-name') ?? null,
  onRequestClose: handleClose
})

watch(
  () => form.phone.trim(),
  (phone) => {
    if (!phone) {
      form.smsOptIn = false
      form.preferredContactMethod = ''
    }
  }
)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      void modalDialog.deactivate()
      resetForm()
      return
    }

    void modalDialog.activate()
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
      :aria-describedby="isAttorneyVariant ? 'co-branded-conflict-explanation' : undefined"
      @keydown="modalDialog.handleKeydown"
    >
      <div
        class="co-branded-consult-modal__backdrop"
        aria-hidden="true"
        @click="handleClose"
      />

      <section
        ref="panelEl"
        class="co-branded-consult-modal__panel"
      >
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
          role="status"
          aria-live="polite"
        >
          <p class="co-branded-consult-modal__eyebrow">
            Request sent
          </p>
          <h2
            id="co-branded-consult-modal-title"
            ref="successHeading"
            tabindex="-1"
          >
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
          :aria-busy="submitting"
          @submit.prevent="handleSubmit"
        >
          <div class="co-branded-consult-modal__header">
            <p class="co-branded-consult-modal__eyebrow">
              {{ companyName }}
            </p>
            <h2 id="co-branded-consult-modal-title">
              Request a Solagree Initial Consult
            </h2>
          </div>

          <div class="co-branded-consult-modal__fields">
            <ApplicationTextField
              id="co-branded-first-name"
              v-model="form.firstName"
              label="First name"
              name="firstName"
              autocomplete="given-name"
              maxlength="60"
              :show-required-indicator="false"
              variant="co-branded"
              required
            />

            <ApplicationTextField
              id="co-branded-last-name"
              v-model="form.lastName"
              label="Last name"
              name="lastName"
              autocomplete="family-name"
              maxlength="60"
              :show-required-indicator="false"
              variant="co-branded"
              required
            />

            <ApplicationTextField
              id="co-branded-email"
              v-model="form.email"
              label="Email"
              name="email"
              type="email"
              autocomplete="email"
              maxlength="254"
              :show-required-indicator="false"
              variant="co-branded"
              required
            />

            <ApplicationTextField
              id="co-branded-phone"
              v-model="form.phone"
              label="Phone"
              optional-label="(optional)"
              name="phone"
              type="tel"
              autocomplete="tel-national"
              inputmode="tel"
              pattern="\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
              title="Use a 10-digit US phone number, e.g. 415-555-1234."
              maxlength="40"
              variant="co-branded"
            />

            <FormSmsOptInField
              id="co-branded-sms-opt-in"
              v-model="form.smsOptIn"
              :disabled="!hasPhone"
              label="I agree to receive text messages from Solagree about my consult request."
            />

            <ApplicationSelectField
              v-if="hasPhone"
              id="co-branded-preferred-contact"
              v-model="form.preferredContactMethod"
              label="Preferred contact method"
              optional-label="(optional)"
              name="preferredContactMethod"
              :options="[
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone' }
              ]"
              placeholder="No preference"
              :placeholder-disabled="false"
              variant="co-branded"
            />

            <template v-if="isAttorneyVariant">
              <p
                id="co-branded-conflict-explanation"
                class="co-branded-consult-modal__conflict-copy"
              >
                Before scheduling, we check for a conflict of interest. We will not contact your spouse — we only use this information internally to check our records.
              </p>

              <ApplicationTextField
                id="co-branded-spouse-first-name"
                v-model="form.spouseFirstName"
                label="Spouse first name"
                name="spouseFirstName"
                autocomplete="section-spouse given-name"
                maxlength="60"
                :show-required-indicator="false"
                variant="co-branded"
                required
              />

              <ApplicationTextField
                id="co-branded-spouse-last-name"
                v-model="form.spouseLastName"
                label="Spouse last name"
                name="spouseLastName"
                autocomplete="section-spouse family-name"
                maxlength="60"
                :show-required-indicator="false"
                variant="co-branded"
                required
              />
            </template>
          </div>

          <FormResultMessage
            v-if="submissionResult"
            class="co-branded-consult-modal__error"
            kind="error"
            :message="submissionResult.message"
          />

          <SiteFormSubmit
            class="co-branded-consult-modal__submit"
            label="Submit request"
            submitting-label="Submitting..."
            :icon="false"
            :submitting="submitting"
          />
        </form>
      </section>
    </div>
  </Teleport>
</template>
