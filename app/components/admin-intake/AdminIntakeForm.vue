<script setup lang="ts">
import ApplicationTextField from '~/components/application/ApplicationTextField.vue'
import { usePortalFormSubmissionOptions } from '~/composables/usePortalFormSubmissionOptions'
import {
  adminIntakeInitialState,
  adminIntakePageContent,
  privacyPreferenceOptions
} from '~/data/admin-intake'
import {
  getAdminIntakeSubmissionErrorMessage,
  submitAdminIntake
} from '~/services/admin-intake-api'
import { useSourceUrl } from '~/composables/useSourceUrl'
import { focusPageDestination } from '~/utils/focus-destination'
import { validateNativeForm } from '~/utils/native-form-validation'
import type { AdminIntakeFormState } from '~/types/admin-intake'

const props = defineProps<{
  slug: string
}>()

const portalSubmissionOptions = usePortalFormSubmissionOptions()

const formEl = ref<HTMLFormElement | null>(null)

const form = reactive<AdminIntakeFormState>({
  ...adminIntakeInitialState
})

const thankYouPath = computed(() => `/meet/${encodeURIComponent(props.slug)}/${adminIntakePageContent.thankYouPath}`)

const sourceUrl = useSourceUrl()

const {
  submitting,
  submissionResult,
  handleSubmit
} = useApplicationSubmission<AdminIntakeFormState, Awaited<ReturnType<typeof submitAdminIntake>>>({
  validate: () => validateNativeForm(formEl.value),
  getFormState: () => form,
  submit: (formState) => submitAdminIntake(formState, props.slug, {
    ...portalSubmissionOptions,
    sourceUrl: sourceUrl
  }),
  onSuccess: async () => {
    await navigateTo(thankYouPath.value)
    await focusPageDestination()
  },
  errorTitle: 'Request not sent',
  getErrorMessage: getAdminIntakeSubmissionErrorMessage
})
</script>

<template>
  <section
    class="request-form admin-intake-form"
    aria-labelledby="admin-intake-title"
  >
    <div class="request-form__intro">
      <p class="eyebrow">
        {{ adminIntakePageContent.eyebrow }}
      </p>
      <h1
        id="admin-intake-title"
        class="request-form__title"
      >
        {{ adminIntakePageContent.title }}
      </h1>
      <p class="request-form__copy">
        {{ adminIntakePageContent.description }}
      </p>
    </div>

    <form
      ref="formEl"
      class="request-form__form"
      :aria-busy="submitting"
      @submit.prevent="handleSubmit"
    >
      <fieldset class="admin-intake-form__fieldset">
        <legend class="admin-intake-form__fieldset-legend">
          Your Information
        </legend>

        <ApplicationTextField
          id="intake-primary-first-name"
          v-model="form.primaryFirstName"
          label="First name"
          name="primaryFirstName"
          autocomplete="given-name"
          maxlength="80"
          required
        />

        <ApplicationTextField
          id="intake-primary-last-name"
          v-model="form.primaryLastName"
          label="Last name"
          name="primaryLastName"
          autocomplete="family-name"
          maxlength="80"
          required
        />

        <ApplicationTextField
          id="intake-primary-email"
          v-model="form.primaryEmail"
          label="Email"
          name="primaryEmail"
          type="email"
          autocomplete="email"
          placeholder="hello@example.com"
          required
        />
      </fieldset>

      <fieldset class="admin-intake-form__fieldset">
        <legend class="admin-intake-form__fieldset-legend">
          Your Spouse’s Information
        </legend>

        <ApplicationTextField
          id="intake-spouse-first-name"
          v-model="form.spouseFirstName"
          label="First name"
          name="spouseFirstName"
          autocomplete="off"
          maxlength="80"
          required
        />

        <ApplicationTextField
          id="intake-spouse-last-name"
          v-model="form.spouseLastName"
          label="Last name"
          name="spouseLastName"
          autocomplete="off"
          maxlength="80"
          required
        />

        <ApplicationTextField
          id="intake-spouse-email"
          v-model="form.spouseEmail"
          label="Email"
          name="spouseEmail"
          type="email"
          autocomplete="off"
          placeholder="hello@example.com"
        />
      </fieldset>

      <div class="admin-intake-form__privacy">
        <p
          id="privacy-preference-label"
          class="admin-intake-form__privacy-label"
        >
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

      <FormResultMessage
        v-if="submissionResult"
        kind="error"
        :title="submissionResult.title"
        :message="submissionResult.message"
      />
    </form>
  </section>
</template>
