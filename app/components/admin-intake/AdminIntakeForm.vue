<script setup lang="ts">
import {
  adminIntakeInitialState,
  adminIntakePageContent,
  privacyPreferenceOptions
} from '~/data/admin-intake'
import {
  getAdminIntakeSubmissionErrorMessage,
  submitAdminIntake
} from '~/services/admin-intake-api'
import { isPortalApiConfigurationError, websitePortalFetcher } from '~/services/portal-api'
import { useSourceUrl } from '~/composables/useSourceUrl'
import type {
  AdminIntakeFormState,
  AdminIntakeResult
} from '~/types/admin-intake'

const props = defineProps<{
  slug: string
}>()

const runtimeConfig = useRuntimeConfig()

const formEl = ref<HTMLFormElement | null>(null)
const submitting = ref(false)
const submissionResult = ref<AdminIntakeResult | null>(null)

const form = reactive<AdminIntakeFormState>({
  ...adminIntakeInitialState
})

const thankYouPath = computed(() => `/meet/${encodeURIComponent(props.slug)}/${adminIntakePageContent.thankYouPath}`)

const sourceUrl = useSourceUrl()

const handleSubmit = async () => {
  if (submitting.value) {
    return
  }

  submissionResult.value = null

  if (!formEl.value?.checkValidity()) {
    formEl.value?.reportValidity()
    return
  }

  submitting.value = true

  try {
    await submitAdminIntake(form, props.slug, {
      portalApiBaseUrl: runtimeConfig.public.portalApiBaseUrl,
      fetcher: websitePortalFetcher,
      sourceUrl: sourceUrl
    })

    await navigateTo(thankYouPath.value)
  } catch (error) {
    if (isPortalApiConfigurationError(error)) {
      console.error(error)
    }

    submissionResult.value = {
      title: 'Request not sent',
      message: getAdminIntakeSubmissionErrorMessage(error)
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section
    class="consult-request-form admin-intake-form"
    aria-labelledby="admin-intake-title"
  >
    <div class="consult-request-form__intro">
      <p class="eyebrow">
        {{ adminIntakePageContent.eyebrow }}
      </p>
      <h1
        id="admin-intake-title"
        class="consult-request-form__title"
      >
        {{ adminIntakePageContent.title }}
      </h1>
      <p class="consult-request-form__copy">
        {{ adminIntakePageContent.description }}
      </p>
    </div>

    <form
      ref="formEl"
      class="consult-request-form__form"
      @submit.prevent="handleSubmit"
    >
      <fieldset class="admin-intake-form__fieldset">
        <legend class="admin-intake-form__fieldset-legend">
          Your Information
        </legend>

        <div class="consult-request-form__field">
          <label for="intake-primary-first-name">
            First name<span aria-hidden="true">*</span>
          </label>
          <input
            id="intake-primary-first-name"
            v-model="form.primaryFirstName"
            name="primaryFirstName"
            type="text"
            autocomplete="given-name"
            placeholder="Type here..."
            maxlength="80"
            required
          >
        </div>

        <div class="consult-request-form__field">
          <label for="intake-primary-last-name">
            Last name<span aria-hidden="true">*</span>
          </label>
          <input
            id="intake-primary-last-name"
            v-model="form.primaryLastName"
            name="primaryLastName"
            type="text"
            autocomplete="family-name"
            placeholder="Type here..."
            maxlength="80"
            required
          >
        </div>

        <div class="consult-request-form__field">
          <label for="intake-primary-email">
            Email<span aria-hidden="true">*</span>
          </label>
          <input
            id="intake-primary-email"
            v-model="form.primaryEmail"
            name="primaryEmail"
            type="email"
            autocomplete="email"
            placeholder="hello@example.com"
            required
          >
        </div>
      </fieldset>

      <fieldset class="admin-intake-form__fieldset">
        <legend class="admin-intake-form__fieldset-legend">
          Your Spouse’s Information
        </legend>

        <div class="consult-request-form__field">
          <label for="intake-spouse-first-name">
            First name<span aria-hidden="true">*</span>
          </label>
          <input
            id="intake-spouse-first-name"
            v-model="form.spouseFirstName"
            name="spouseFirstName"
            type="text"
            autocomplete="off"
            placeholder="Type here..."
            maxlength="80"
            required
          >
        </div>

        <div class="consult-request-form__field">
          <label for="intake-spouse-last-name">
            Last name<span aria-hidden="true">*</span>
          </label>
          <input
            id="intake-spouse-last-name"
            v-model="form.spouseLastName"
            name="spouseLastName"
            type="text"
            autocomplete="off"
            placeholder="Type here..."
            maxlength="80"
            required
          >
        </div>

        <div class="consult-request-form__field">
          <label for="intake-spouse-email">
            Email
          </label>
          <input
            id="intake-spouse-email"
            v-model="form.spouseEmail"
            name="spouseEmail"
            type="email"
            autocomplete="off"
            placeholder="hello@example.com"
          >
        </div>
      </fieldset>

      <div class="admin-intake-form__privacy">
        <p class="admin-intake-form__privacy-label">
          Privacy preference<span aria-hidden="true">*</span>
        </p>
        <div
          class="admin-intake-form__privacy-options"
          role="radiogroup"
          aria-labelledby="privacy-preference-label"
          aria-required="true"
        >
          <label
            v-for="option in privacyPreferenceOptions"
            :key="option.value"
            class="admin-intake-form__radio-label"
          >
            <input
              v-model="form.privacyPreference"
              class="admin-intake-form__radio"
              type="radio"
              name="privacyPreference"
              :value="option.value"
              required
            >
            <span class="admin-intake-form__radio-text">
              <span class="admin-intake-form__radio-title">{{ option.label }}</span>
              <span class="admin-intake-form__radio-help">{{ option.helpText }}</span>
            </span>
          </label>
        </div>
      </div>

      <SiteFormSubmit
        label="SUBMIT"
        :submitting="submitting"
      />

      <div
        v-if="submissionResult"
        class="consult-request-form__result consult-request-form__result--error"
        role="status"
        aria-live="polite"
      >
        <p class="consult-request-form__result-title">
          {{ submissionResult.title }}
        </p>
        <p>{{ submissionResult.message }}</p>
      </div>
    </form>
  </section>
</template>
