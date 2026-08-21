<script setup lang="ts">
import type { ArticleInlineToken } from '~/types/article-rich-text'

defineProps<{
  tokens: ArticleInlineToken[]
}>()
</script>

<template>
  <template
    v-for="(token, index) in tokens"
    :key="`${token.type}-${index}`"
  >
    <a
      v-if="token.type === 'link'"
      :href="token.href"
      :target="token.href.startsWith('http') ? '_blank' : undefined"
      :rel="token.href.startsWith('http') ? 'noopener noreferrer' : undefined"
    >{{ token.value }}</a>
    <strong v-else-if="token.type === 'emphasis'">{{ token.value }}</strong>
    <template v-else>{{ token.value }}</template>
  </template>
</template>
