<script setup lang="ts">
import {
  attorneyApplicationInitialState,
  attorneyMediationOptions,
  attorneyYesNoOptions
} from '~/data/attorney-application'
import { stateOptions } from '~/data/us-states'
import type {
  AttorneyApplicationApiErrorResponse,
  AttorneyApplicationApiResponse,
  AttorneyApplicationFormState,
  AttorneyApplicationResult
} from '~/types/attorney-application'

const currentYear = new Date().getFullYear()

const runtimeConfig = useRuntimeConfig()
const formEl = ref<HTMLFormElement | null>(null)
const hasAttemptedSubmit = ref(false)
const submitting = ref(false)
const submissionResult = ref<AttorneyApplicationResult | null>(null)

const form = reactive<AttorneyApplicationFormState>({
  ...attorneyApplicationInitialState,
  barStates: [...attorneyApplicationInitialState.barStates],
  licenseNumbers: [...attorneyApplicationInitialState.licenseNumbers]
})

const hasBarStateError = computed(() => hasAttemptedSubmit.value && form.barStates.length === 0)
const hasLicenseNumberError = computed(() =>
  hasAttemptedSubmit.value && form.licenseNumbers.some((licenseNumber) => !licenseNumber.trim())
)

watch(
  () => form.disciplinaryFinding,
  (value) => {
    if (value !== 'yes') {
      form.disciplinaryExplanation = ''
    }
  }
)

function addLicenseNumber() {
  form.licenseNumbers.push('')
}

function removeLicenseNumber(index: number) {
  if (form.licenseNumbers.length === 1) {
    form.licenseNumbers[0] = ''
    return
  }

  form.licenseNumbers.splice(index, 1)
}

function getPortalApiBaseUrl() {
  return String(runtimeConfig.public.portalApiBaseUrl || '').replace(/\/+$/, '')
}

function getSubmissionErrorMessage(error: unknown) {
  if (
    typeof error === 'object'
    && error !== null
    && 'data' in error
    && typeof error.data === 'object'
    && error.data !== null
    && 'message' in error.data
    && typeof error.data.message === 'string'
  ) {
    return error.data.message
  }

  if (
    typeof error === 'object'
    && error !== null
    && 'statusMessage' in error
    && typeof error.statusMessage === 'string'
  ) {
    return error.statusMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'We could not submit your application. Please try again.'
}

async function handleSubmit() {
  if (submitting.value) {
    return
  }

  hasAttemptedSubmit.value = true
  submissionResult.value = null

  const hasCustomErrors = hasBarStateError.value || hasLicenseNumberError.value

  if (!formEl.value?.checkValidity() || hasCustomErrors) {
    formEl.value?.reportValidity()
    return
  }

  submitting.value = true

  try {
    const portalApiBaseUrl = getPortalApiBaseUrl()
    const response = await $fetch<AttorneyApplicationApiResponse | AttorneyApplicationApiErrorResponse>(
      `${portalApiBaseUrl}/api/attorney-applications`,
      {
        method: 'POST',
        body: {
          ...form,
          licenseNumbers: form.licenseNumbers.map(licenseNumber => licenseNumber.trim())
        }
      }
    )

    if ('error' in response) {
      throw new Error(response.message)
    }

    submissionResult.value = {
      kind: 'success',
      title: 'Application received',
      message: 'Thank you. Our team will review your application and email you with next steps.'
    }
  } catch (error) {
    submissionResult.value = {
      kind: 'error',
      title: 'Submission failed',
      message: getSubmissionErrorMessage(error)
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section
    class="attorney-application-form"
    aria-labelledby="attorney-application-title"
  >
    <h1
      id="attorney-application-title"
      class="attorney-application-form__title"
    >
      Attorney Partners
    </h1>

    <form
      ref="formEl"
      class="attorney-application-form__form"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <div class="attorney-application-form__field">
        <label for="attorney-name">
          Name<span aria-hidden="true">*</span>
        </label>
        <input
          id="attorney-name"
          v-model="form.name"
          name="name"
          type="text"
          autocomplete="name"
          placeholder="Type here..."
          required
        >
      </div>

      <div class="attorney-application-form__field">
        <label for="attorney-company">
          Company<span aria-hidden="true">*</span>
        </label>
        <input
          id="attorney-company"
          v-model="form.company"
          name="company"
          type="text"
          autocomplete="organization"
          placeholder="Type here..."
          required
        >
      </div>

      <div class="attorney-application-form__field">
        <label for="attorney-email">
          Email<span aria-hidden="true">*</span>
        </label>
        <input
          id="attorney-email"
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="hello@example.com..."
          required
        >
      </div>

      <div class="attorney-application-form__field">
        <label for="attorney-phone">
          Phone Number<span aria-hidden="true">*</span>
        </label>
        <input
          id="attorney-phone"
          v-model="form.phone"
          name="phone"
          type="tel"
          autocomplete="tel"
          placeholder="1-415-555-1234..."
          required
        >
      </div>

      <div class="attorney-application-form__field">
        <label for="attorney-address">
          Address<span aria-hidden="true">*</span>
        </label>
        <textarea
          id="attorney-address"
          v-model="form.address"
          name="address"
          rows="3"
          autocomplete="street-address"
          placeholder="Type here..."
          required
        />
      </div>

      <fieldset
        class="attorney-application-form__fieldset"
        :class="{ 'attorney-application-form__fieldset--invalid': hasBarStateError }"
      >
        <legend>
          State(s) of Bar License<span aria-hidden="true">*</span>
        </legend>
        <p
          id="attorney-bar-states-hint"
          class="attorney-application-form__hint"
        >
          Select all that apply.
        </p>

        <div
          class="attorney-application-form__state-list"
          :aria-describedby="hasBarStateError ? 'attorney-bar-states-hint attorney-bar-states-error' : 'attorney-bar-states-hint'"
          :aria-invalid="hasBarStateError ? 'true' : undefined"
        >
          <label
            v-for="state in stateOptions"
            :key="state.value"
            class="attorney-application-form__checkbox-card"
          >
            <input
              v-model="form.barStates"
              type="checkbox"
              name="barStates"
              :value="state.value"
            >
            <span>{{ state.label }}</span>
          </label>
        </div>

        <p
          v-if="hasBarStateError"
          id="attorney-bar-states-error"
          class="attorney-application-form__error"
          role="alert"
        >
          Select at least one state.
        </p>
      </fieldset>

      <fieldset class="attorney-application-form__fieldset">
        <legend>
          License #<span aria-hidden="true">*</span>
        </legend>

        <div class="attorney-application-form__license-list">
          <div
            v-for="(_, index) in form.licenseNumbers"
            :key="index"
            class="attorney-application-form__license-row"
          >
            <label
              class="sr-only"
              :for="`attorney-license-${index}`"
            >
              License number {{ index + 1 }}
            </label>
            <input
              :id="`attorney-license-${index}`"
              v-model="form.licenseNumbers[index]"
              :name="`licenseNumber-${index}`"
              type="text"
              placeholder="Type here..."
              :aria-invalid="hasAttemptedSubmit && !form.licenseNumbers[index]?.trim() ? 'true' : undefined"
              :aria-describedby="hasLicenseNumberError ? 'attorney-license-error' : undefined"
              required
            >
            <button
              class="attorney-application-form__small-action"
              type="button"
              :aria-label="`Remove license number ${index + 1}`"
              @click="removeLicenseNumber(index)"
            >
              Remove
            </button>
          </div>
        </div>

        <button
          class="attorney-application-form__add-license"
          type="button"
          @click="addLicenseNumber"
        >
          Add another License #
        </button>

        <p
          v-if="hasLicenseNumberError"
          id="attorney-license-error"
          class="attorney-application-form__error"
          role="alert"
        >
          Enter a license number for every license field.
        </p>
      </fieldset>

      <div class="attorney-application-form__field">
        <label for="attorney-licensure-year">
          Year of initial licensure<span aria-hidden="true">*</span>
        </label>
        <input
          id="attorney-licensure-year"
          v-model="form.initialLicensureYear"
          name="initialLicensureYear"
          type="number"
          inputmode="numeric"
          min="1900"
          :max="currentYear"
          placeholder="YYYY"
          required
        >
      </div>

      <div class="attorney-application-form__field attorney-application-form__field--select">
        <label for="attorney-good-standing">
          License in good standing<span aria-hidden="true">*</span>
        </label>
        <select
          id="attorney-good-standing"
          v-model="form.goodStanding"
          name="goodStanding"
          required
        >
          <option
            value=""
            disabled
          >
            Select...
          </option>
          <option
            v-for="option in attorneyYesNoOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="attorney-application-form__field attorney-application-form__field--select">
        <label for="attorney-disciplinary-finding">
          Have you ever been subject to a disciplinary finding?<span aria-hidden="true">*</span>
        </label>
        <p
          id="attorney-disciplinary-finding-hint"
          class="attorney-application-form__hint"
        >
          A positive answer does not necessarily disqualify you.
        </p>
        <select
          id="attorney-disciplinary-finding"
          v-model="form.disciplinaryFinding"
          name="disciplinaryFinding"
          aria-describedby="attorney-disciplinary-finding-hint"
          required
        >
          <option
            value=""
            disabled
          >
            Select...
          </option>
          <option
            v-for="option in attorneyYesNoOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div
        v-if="form.disciplinaryFinding === 'yes'"
        class="attorney-application-form__field"
      >
        <label for="attorney-disciplinary-explanation">
          Please explain<span aria-hidden="true">*</span>
        </label>
        <textarea
          id="attorney-disciplinary-explanation"
          v-model="form.disciplinaryExplanation"
          name="disciplinaryExplanation"
          rows="3"
          placeholder="Type here..."
          required
        />
      </div>

      <div class="attorney-application-form__field attorney-application-form__field--select">
        <label for="attorney-mediation-experience">
          Do you have a mediation certification or a mediation practice?<span aria-hidden="true">*</span>
        </label>
        <select
          id="attorney-mediation-experience"
          v-model="form.mediationExperience"
          name="mediationExperience"
          required
        >
          <option
            value=""
            disabled
          >
            Select...
          </option>
          <option
            v-for="option in attorneyMediationOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="attorney-application-form__field attorney-application-form__field--select">
        <label for="attorney-neutral-interest">
          Interested in Solagree cases as a neutral mediator or arbitrator?<span aria-hidden="true">*</span>
        </label>
        <select
          id="attorney-neutral-interest"
          v-model="form.neutralInterest"
          name="neutralInterest"
          required
        >
          <option
            value=""
            disabled
          >
            Select...
          </option>
          <option
            v-for="option in attorneyYesNoOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="attorney-application-form__field">
        <label for="attorney-adr-networks">
          Have you participated in other ADR family law networks or organizations?
        </label>
        <textarea
          id="attorney-adr-networks"
          v-model="form.adrNetworks"
          name="adrNetworks"
          rows="3"
          placeholder="If so, please list them here..."
        />
      </div>

      <div class="attorney-application-form__field attorney-application-form__field--select">
        <label for="attorney-consultation-interest">
          Are you interested in taking 30-45 min flat fee ($250) pre-enrollment consultation calls as an attorney advocate?<span aria-hidden="true">*</span>
        </label>
        <select
          id="attorney-consultation-interest"
          v-model="form.consultationInterest"
          name="consultationInterest"
          required
        >
          <option
            value=""
            disabled
          >
            Select...
          </option>
          <option
            v-for="option in attorneyYesNoOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <label class="attorney-application-form__terms">
        <input
          v-model="form.termsAccepted"
          name="termsAccepted"
          type="checkbox"
          required
        >
        <span>
          I have read and agree to the
          <NuxtLink
            to="/legal/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            terms and conditions
          </NuxtLink>.
        </span>
      </label>

      <button
        class="attorney-application-form__submit"
        type="submit"
        :disabled="submitting"
      >
        <span>{{ submitting ? 'SENDING...' : 'SEND' }}</span>
        <img
          class="attorney-application-form__submit-icon"
          src="/icons/send.svg"
          alt=""
          width="16"
          height="16"
          aria-hidden="true"
        >
      </button>

      <div
        v-if="submissionResult"
        class="attorney-application-form__result"
        :class="`attorney-application-form__result--${submissionResult.kind}`"
        role="status"
        aria-live="polite"
      >
        <p class="attorney-application-form__result-title">
          {{ submissionResult.title }}
        </p>
        <p>{{ submissionResult.message }}</p>
      </div>
    </form>
  </section>
</template>
