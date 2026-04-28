<script setup lang="ts">
import { renderCoBrandedPageTemplate } from '~/templates/co-branded-page'
import type { CoBrandedPagePublicConfig, CoBrandedPageRenderMode } from '~/types/co-branded-page'

const props = defineProps<{
  config: CoBrandedPagePublicConfig
  mode: CoBrandedPageRenderMode
}>()

const renderedTemplate = computed(() => renderCoBrandedPageTemplate(props.config, props.mode))
</script>

<template>
  <div v-html="renderedTemplate" />
</template>
