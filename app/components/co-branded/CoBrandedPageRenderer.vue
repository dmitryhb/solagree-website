<script setup lang="ts">
import CoBrandedConsultModal from '~/components/co-branded/CoBrandedConsultModal.vue'
import { renderCoBrandedPageTemplate } from '~/templates/co-branded-page'
import type { CoBrandedPagePublicConfig } from '#shared/types/co-branded-page'
import type { CoBrandedPageRenderMode } from '~/types/co-branded-page'

const props = defineProps<{
  config: CoBrandedPagePublicConfig
  mode: CoBrandedPageRenderMode
}>()

const rendererRef = ref<HTMLElement | null>(null)
const isConsultModalOpen = ref(false)
const renderedTemplate = computed(() => renderCoBrandedPageTemplate(props.config, props.mode))

const openConsultModal = (): void => {
  isConsultModalOpen.value = true
}

const closeConsultModal = (): void => {
  isConsultModalOpen.value = false
}

/**
 * Keeps template-rendered FAQ details panels in sync with the single-open
 * accordion behavior used by the Vue BaseAccordion on regular site pages.
 */
const handleAccordionToggle = (event: Event): void => {
  const toggledItem = event.target instanceof HTMLDetailsElement
    ? event.target
    : null

  if (!toggledItem?.open || !toggledItem.classList.contains('co-branded-page__accordion-item')) {
    return
  }

  const accordion = toggledItem.closest('.co-branded-page__questions-accordion')

  accordion
    ?.querySelectorAll<HTMLDetailsElement>('.co-branded-page__accordion-item[open]')
    .forEach((item) => {
      if (item !== toggledItem) {
        item.open = false
      }
    })
}

const handleTemplateClick = (event: MouseEvent): void => {
  const target = event.target instanceof Element
    ? event.target
    : null
  const trigger = target?.closest('[data-co-branded-consult-trigger]')

  if (!trigger) {
    return
  }

  event.preventDefault()
  openConsultModal()
}

onMounted(() => {
  rendererRef.value?.addEventListener('toggle', handleAccordionToggle, true)
  rendererRef.value?.addEventListener('click', handleTemplateClick)
})

onBeforeUnmount(() => {
  rendererRef.value?.removeEventListener('toggle', handleAccordionToggle, true)
  rendererRef.value?.removeEventListener('click', handleTemplateClick)
})
</script>

<template>
  <!--
    Template HTML is static and rendered by Handlebars, which escapes text by
    default. Partner-controlled URLs are normalized through named allowlist
    helpers before reaching this component.
  -->
  <div
    ref="rendererRef"
    v-html="renderedTemplate"
  />

  <CoBrandedConsultModal
    :open="isConsultModalOpen"
    :company-name="config.companyName"
    :partner-slug="config.slug"
    :page-type="config.pageType"
    @close="closeConsultModal"
  />
</template>
