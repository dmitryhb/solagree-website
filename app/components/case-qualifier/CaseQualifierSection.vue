<script setup lang="ts">
import { solagreeSocialLinksByIcon } from '~/data/social-links'
import { solagreeCaseQualifierCopy } from '~/data/case-qualifier'
import { solagreeCaseQualifierCriterionGroups } from '~/data/case-qualifier-schema'
import type {
  CaseQualifierCriterionId,
  CaseQualifierHostConfigInput,
  CaseQualifierHostEvent
} from '~/data/case-qualifier-types'

const props = defineProps<{
  hostConfig?: CaseQualifierHostConfigInput
}>()

const emit = defineEmits<{
  hostEvent: [event: CaseQualifierHostEvent]
}>()

const caseQualifierSession = useCaseQualifierSession()
const caseQualifierHost = useCaseQualifierHost(caseQualifierSession, {
  hostConfig: toRef(props, 'hostConfig'),
  onEvent: event => emit('hostEvent', event)
})
const caseQualifierBodyRef = ref<HTMLElement | null>(null)
const linkedInSocialLink = solagreeSocialLinksByIcon.linkedin
const titleTag = computed(() => `h${caseQualifierHost.hostConfig.value.display.headingLevel}`)
const sectionClasses = computed(() => ({
  'case-qualifier-section--standalone': caseQualifierHost.hostConfig.value.mode === 'standalone',
  'case-qualifier-section--embedded': caseQualifierHost.hostConfig.value.mode === 'embedded'
}))

const getCaseQualifierScrollBehavior = (): ScrollBehavior => {
  if (!import.meta.client) {
    return 'auto'
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

const handleCriterionChange = (payload: {
  criterionId: CaseQualifierCriterionId
  selected: boolean
}): void => {
  caseQualifierHost.handleCriterionChange(payload.criterionId, payload.selected)
}

const handleReset = async (): Promise<void> => {
  caseQualifierHost.handleReset()
  await nextTick()

  const firstCriterion = caseQualifierBodyRef.value?.querySelector<HTMLInputElement>(
    '[data-criterion-id="simple-estate"]'
  )

  firstCriterion?.focus({ preventScroll: true })
  caseQualifierBodyRef.value?.scrollIntoView({
    behavior: getCaseQualifierScrollBehavior(),
    block: 'start'
  })
}
</script>

<template>
  <section
    class="case-qualifier-section"
    :class="sectionClasses"
    aria-labelledby="case-qualifier-title"
  >
    <div class="case-qualifier-section__layout">
      <header
        v-if="caseQualifierHost.hostConfig.value.display.showShellHeader"
        class="case-qualifier-section__shell-header"
      >
        <NuxtLink
          to="/"
          class="case-qualifier-section__logo-link"
          aria-label="Solagree home"
        >
          <img
            class="case-qualifier-section__logo"
            src="/solagree-logo.svg"
            alt="Solagree"
          >
        </NuxtLink>
        <a
          class="case-qualifier-section__contact-link"
          :href="linkedInSocialLink.href"
          :aria-label="linkedInSocialLink.ariaLabel"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Us
        </a>
      </header>

      <article
        ref="caseQualifierBodyRef"
        class="case-qualifier"
        :data-case-qualifier-ready="caseQualifierSession.hasRestoredPersistedState.value ? 'true' : 'false'"
      >
        <header class="case-qualifier__header">
          <component
            :is="titleTag"
            id="case-qualifier-title"
            class="case-qualifier__title"
          >
            {{ solagreeCaseQualifierCopy.title }}
          </component>
          <p class="case-qualifier__subtitle">
            {{ solagreeCaseQualifierCopy.subtitle }}
          </p>
        </header>

        <div class="case-qualifier__layout">
          <div class="case-qualifier__questions">
            <p
              v-if="caseQualifierHost.hostConfig.value.display.showInstructions"
              class="case-qualifier__instructions"
            >
              {{ solagreeCaseQualifierCopy.instructions }}
            </p>

            <CaseQualifierCriterionGroup
              v-for="(group, index) in solagreeCaseQualifierCriterionGroups"
              :key="group.id"
              :group="group"
              :group-number="index + 1"
              :selected-criterion-ids="caseQualifierSession.selectedCriterionIds.value"
              @change="handleCriterionChange"
            />
          </div>

          <CaseQualifierAssessmentPanel
            :score="caseQualifierSession.score.value"
            :result="caseQualifierHost.resolvedResultView.value"
            :heading-level="caseQualifierHost.hostConfig.value.display.headingLevel"
            @cta="caseQualifierHost.handleResultCtaClick"
            @reset="handleReset"
          />
        </div>
      </article>
    </div>
  </section>
</template>
