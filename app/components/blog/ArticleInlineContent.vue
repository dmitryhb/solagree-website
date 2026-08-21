<script setup lang="ts">
import type { ArticleInlineToken } from '~/types/article-rich-text'

defineProps<{
  tokens: ArticleInlineToken[]
}>()

/** Identifies links that leave Solagree and need a protected new browsing context. */
const isExternalHttpLink = (href: string): boolean => /^https?:\/\//i.test(href)
</script>

<template>
  <template
    v-for="(token, index) in tokens"
    :key="`${token.type}-${index}`"
  >
    <a
      v-if="token.type === 'link'"
      :href="token.href"
      :target="isExternalHttpLink(token.href) ? '_blank' : undefined"
      :rel="isExternalHttpLink(token.href) ? 'noopener noreferrer' : undefined"
    >{{ token.value }}</a>
    <strong v-else-if="token.type === 'emphasis'">{{ token.value }}</strong>
    <template v-else>{{ token.value }}</template>
  </template>
</template>
