<script setup lang="ts">
import { renderCoBrandedPageTemplate } from '~/templates/co-branded-page'
import type { CoBrandedPagePublicConfig } from '#shared/types/co-branded-page'
import type { CoBrandedPageRenderMode } from '~/types/co-branded-page'

const props = defineProps<{
  config: CoBrandedPagePublicConfig
  mode: CoBrandedPageRenderMode
}>()

const rendererRef = ref<HTMLElement | null>(null)
const renderedTemplate = computed(() => renderCoBrandedPageTemplate(props.config, props.mode))

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

onMounted(() => {
  rendererRef.value?.addEventListener('toggle', handleAccordionToggle, true)
})

onBeforeUnmount(() => {
  rendererRef.value?.removeEventListener('toggle', handleAccordionToggle, true)
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
</template>
