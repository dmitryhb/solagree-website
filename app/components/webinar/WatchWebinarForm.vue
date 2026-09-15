<script setup lang="ts">
import ApplicationSelectField from '~/components/application/ApplicationSelectField.vue'
import ApplicationTextField from '~/components/application/ApplicationTextField.vue'
import { usePortalFormSubmissionOptions } from '~/composables/usePortalFormSubmissionOptions'
import { stateOptions } from '~/data/us-states'
import { attorneyWebinarRegistrationContent } from '~/data/webinar-registration'
import {
  getWebinarRegistrationErrorMessage,
  submitWebinarRegistration
} from '~/services/webinar-registration-api'
import { focusPageDestination } from '~/utils/focus-destination'
import { validateNativeForm } from '~/utils/native-form-validation'
import type { WebinarFormState, WebinarRegistrationContent } from '~/types/webinar'

interface WatchWebinarFormProps {
  subtitle?: string
  redirectPath?: string
  submissionType?: WebinarRegistrationContent['submissionType']
}

const props = withDefaults(defineProps<WatchWebinarFormProps>(), {
  subtitle: attorneyWebinarRegistrationContent.formSubtitle,
  redirectPath: attorneyWebinarRegistrationContent.formRedirectPath,
  submissionType: attorneyWebinarRegistrationContent.submissionType
})

const portalSubmissionOptions = usePortalFormSubmissionOptions()
const formEl = ref<HTMLFormElement | null>(null)
const form = reactive<WebinarFormState>({
  businessEmail: '',
  firstName: '',
  lastName: '',
  companyName: '',
  state: ''
})

const sourceUrl = useSourceUrl()

const {
  submitting,
  submissionResult,
  handleSubmit
} = useApplicationSubmission<WebinarFormState, Awaited<ReturnType<typeof submitWebinarRegistration>>>({
  validate: () => validateNativeForm(formEl.value),
  getFormState: () => form,
  submit: (formState) => submitWebinarRegistration(formState, {
    ...portalSubmissionOptions,
    submissionType: props.submissionType,
    sourceUrl
  }),
  onSuccess: async () => {
    await navigateTo(props.redirectPath)
    await focusPageDestination()
  },
  errorTitle: '',
  getErrorMessage: getWebinarRegistrationErrorMessage
})
</script>

<template>
  <section
    class="watch-webinar-form"
    aria-labelledby="watch-webinar-title"
  >
    <h2
      id="watch-webinar-title"
      class="watch-webinar-form__title"
    >
      Watch Now
    </h2>

    <p class="watch-webinar-form__subtitle">
      {{ subtitle }}
    </p>

    <form
      ref="formEl"
      class="watch-webinar-form__form"
      :aria-busy="submitting"
      @submit.prevent="handleSubmit"
    >
      <ApplicationTextField
        id="webinar-business-email"
        v-model="form.businessEmail"
        class="watch-webinar-form__field--full"
        label="Business email"
        name="businessEmail"
        type="email"
        autocomplete="email"
        placeholder="Business email*"
        label-visually-hidden
        variant="webinar"
        required
      />

      <div class="watch-webinar-form__row">
        <ApplicationTextField
          id="webinar-first-name"
          v-model="form.firstName"
          label="First name"
          name="firstName"
          autocomplete="given-name"
          placeholder="First name *"
          label-visually-hidden
          variant="webinar"
          required
        />

        <ApplicationTextField
          id="webinar-last-name"
          v-model="form.lastName"
          label="Last name"
          name="lastName"
          autocomplete="family-name"
          placeholder="Last name *"
          label-visually-hidden
          variant="webinar"
          required
        />
      </div>

      <div class="watch-webinar-form__row">
        <ApplicationTextField
          id="webinar-company-name"
          v-model="form.companyName"
          label="Company name"
          name="companyName"
          autocomplete="organization"
          placeholder="Company name"
          label-visually-hidden
          variant="webinar"
        />

        <ApplicationSelectField
          id="webinar-state"
          v-model="form.state"
          label="State"
          name="state"
          :options="stateOptions"
          placeholder="Select state*"
          label-visually-hidden
          variant="webinar"
          required
        />
      </div>

      <SiteFormSubmit
        class="watch-webinar-form__submit"
        label="Watch Now"
        submitting-label="Submitting..."
        :submitting="submitting"
      >
        <template #icon>
          <span
            class="watch-webinar-form__submit-icon"
            aria-hidden="true"
          >
            &rarr;
          </span>
        </template>
      </SiteFormSubmit>

      <FormResultMessage
        v-if="submissionResult"
        class="watch-webinar-form__status"
        kind="error"
        :message="submissionResult.message"
      />
    </form>

    <p class="watch-webinar-form__contact">
      Looking for other information?
      <NuxtLink to="/contact">
        Get in touch.
      </NuxtLink>
    </p>
  </section>
</template>
