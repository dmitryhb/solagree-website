<script setup lang="ts">
import { renderCoBrandedPageTemplate } from '~/templates/co-branded-page'
import type { CoBrandedPagePublicConfig } from '#shared/types/co-branded-page'
import type { CoBrandedPageRenderMode } from '~/types/co-branded-page'

const props = defineProps<{
  config: CoBrandedPagePublicConfig
  mode: CoBrandedPageRenderMode
}>()

const renderedTemplate = computed(() => renderCoBrandedPageTemplate(props.config, props.mode))
</script>

<template>
  <!--
    Template HTML is static and rendered by Handlebars, which escapes text by
    default. Partner-controlled URLs are normalized through named allowlist
    helpers before reaching this component.
  -->
  <div v-html="renderedTemplate" />
</template>
