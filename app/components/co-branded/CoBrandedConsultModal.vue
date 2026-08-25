<script setup lang="ts">
import type { CoBrandedPageType } from '#shared/co-branded-page-variant'
import {
  getConsultRequestSubmissionErrorMessage,
  submitCoBrandedConsultRequest
} from '~/services/consult-request-api'
import { isPortalApiConfigurationError, websitePortalFetcher } from '~/services/portal-api'
import type { CoBrandedConsultRequestFormState } from '~/types/consult-request'

const props = defineProps<{
  open: boolean
  companyName: string
  partnerSlug: string
  pageType: CoBrandedPageType
}>()

const emit = defineEmits<{
  close: []
}>()

const runtimeConfig = useRuntimeConfig()
const sourceUrl = useSourceUrl()
const { trackEvent } = useGoogleAnalytics()

const formEl = ref<HTMLFormElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const firstNameInput = ref<HTMLInputElement | null>(null)
const errorEl = ref<HTMLElement | null>(null)
const successHeading = ref<HTMLElement | null>(null)
const submitting = ref(false)
const submitted = ref(false)
const submissionError = ref('')
let previouslyFocusedElement: HTMLElement | null = null
let previousBodyOverflow = ''
let isPageScrollLocked = false

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

const resetForm = (): void => {
  Object.assign(form, createInitialForm())
  submissionError.value = ''
  submitted.value = false
}

const restorePageScroll = (): void => {
  if (!isPageScrollLocked) {
    return
  }

  document.body.style.overflow = previousBodyOverflow
  isPageScrollLocked = false
}

const handleClose = (): void => {
  if (submitting.value) {
    return
  }

  emit('close')
}

const getFocusableElements = (): HTMLElement[] => {
  return Array.from(panelEl.value?.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ) ?? [])
}

const handleDialogKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    handleClose()
    return
  }

  if (event.key !== 'Tab') {
    return
  }

  const focusableElements = getFocusableElements()
  const firstFocusableElement = focusableElements[0]
  const lastFocusableElement = focusableElements.at(-1)

  if (!firstFocusableElement || !lastFocusableElement) {
    event.preventDefault()
    return
  }

  if (event.shiftKey && document.activeElement === firstFocusableElement) {
    event.preventDefault()
    lastFocusableElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
    event.preventDefault()
    firstFocusableElement.focus()
  }
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
      fetcher: websitePortalFetcher,
      pageType: props.pageType,
      referralCode: props.partnerSlug,
      sourceUrl
    })

    trackEvent('consultation_booked', {
      consult_type: 'initial',
      co_branded_page_type: props.pageType,
      referral_code: props.partnerSlug,
      source: 'co_branded_consult_modal'
    })

    submitted.value = true
    await nextTick()
    successHeading.value?.focus()
  } catch (error) {
    if (isPortalApiConfigurationError(error)) {
      console.error(error)
    }

    submissionError.value = getConsultRequestSubmissionErrorMessage(error)
    await nextTick()
    errorEl.value?.focus()
  } finally {
    submitting.value = false
  }
}

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
  async (isOpen) => {
    if (!isOpen) {
      restorePageScroll()
      resetForm()
      await nextTick()
      previouslyFocusedElement?.focus()
      previouslyFocusedElement = null
      return
    }

    previouslyFocusedElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    isPageScrollLocked = true

    await nextTick()
    firstNameInput.value?.focus()
  }
)

onBeforeUnmount(() => {
  restorePageScroll()
  previouslyFocusedElement?.focus()
})
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
      @keydown="handleDialogKeydown"
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
            <label for="co-branded-first-name">
              <span>First name</span>
              <input
                id="co-branded-first-name"
                ref="firstNameInput"
                v-model="form.firstName"
                name="firstName"
                type="text"
                autocomplete="given-name"
                maxlength="60"
                required
              >
            </label>

            <label for="co-branded-last-name">
              <span>Last name</span>
              <input
                id="co-branded-last-name"
                v-model="form.lastName"
                name="lastName"
                type="text"
                autocomplete="family-name"
                maxlength="60"
                required
              >
            </label>

            <label for="co-branded-email">
              <span>Email</span>
              <input
                id="co-branded-email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                maxlength="254"
                required
              >
            </label>

            <label for="co-branded-phone">
              <span>Phone <small>(optional)</small></span>
              <input
                id="co-branded-phone"
                v-model="form.phone"
                name="phone"
                type="tel"
                autocomplete="tel-national"
                inputmode="tel"
                pattern="\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
                title="Use a 10-digit US phone number, e.g. 415-555-1234."
                maxlength="40"
              >
            </label>

            <FormSmsOptInField
              id="co-branded-sms-opt-in"
              v-model="form.smsOptIn"
              :disabled="!hasPhone"
              label="I agree to receive text messages from Solagree about my consult request."
            />

            <label
              v-if="hasPhone"
              for="co-branded-preferred-contact"
            >
              <span>Preferred contact method <small>(optional)</small></span>
              <select
                id="co-branded-preferred-contact"
                v-model="form.preferredContactMethod"
                name="preferredContactMethod"
              >
                <option value="">
                  No preference
                </option>
                <option value="email">
                  Email
                </option>
                <option value="phone">
                  Phone
                </option>
              </select>
            </label>

            <template v-if="isAttorneyVariant">
              <p
                id="co-branded-conflict-explanation"
                class="co-branded-consult-modal__conflict-copy"
              >
                Before scheduling, we check for a conflict of interest. We will not contact your spouse — we only use this information internally to check our records.
              </p>

              <label for="co-branded-spouse-first-name">
                <span>Spouse first name</span>
                <input
                  id="co-branded-spouse-first-name"
                  v-model="form.spouseFirstName"
                  name="spouseFirstName"
                  type="text"
                  autocomplete="section-spouse given-name"
                  maxlength="60"
                  required
                >
              </label>

              <label for="co-branded-spouse-last-name">
                <span>Spouse last name</span>
                <input
                  id="co-branded-spouse-last-name"
                  v-model="form.spouseLastName"
                  name="spouseLastName"
                  type="text"
                  autocomplete="section-spouse family-name"
                  maxlength="60"
                  required
                >
              </label>
            </template>
          </div>

          <p
            v-if="submissionError"
            ref="errorEl"
            class="co-branded-consult-modal__error"
            role="alert"
            tabindex="-1"
          >
            {{ submissionError }}
          </p>

          <button
            class="co-branded-consult-modal__submit"
            type="submit"
            :disabled="submitting"
          >
            <span aria-live="polite">
              {{ submitting ? 'Submitting...' : 'Submit request' }}
            </span>
          </button>
        </form>
      </section>
    </div>
  </Teleport>
</template>
