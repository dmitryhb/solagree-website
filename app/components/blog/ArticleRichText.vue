<script setup lang="ts">
import ArticleInlineContent from '~/components/blog/ArticleInlineContent.vue'
import { parseArticleBody } from '~/utils/article-content'

const props = defineProps<{
  body: string
}>()

const blocks = computed(() => parseArticleBody(props.body))
</script>

<template>
  <div class="article-rich-text">
    <template
      v-for="(block, index) in blocks"
      :key="index"
    >
      <h2 v-if="block.type === 'heading' && block.level === 2">
        <ArticleInlineContent :tokens="block.content" />
      </h2>
      <h3 v-else-if="block.type === 'heading' && block.level === 3">
        <ArticleInlineContent :tokens="block.content" />
      </h3>
      <h4 v-else-if="block.type === 'heading'">
        <ArticleInlineContent :tokens="block.content" />
      </h4>
      <ol v-else-if="block.type === 'list' && block.ordered">
        <li
          v-for="(item, itemIndex) in block.items"
          :key="itemIndex"
        >
          <ArticleInlineContent :tokens="item" />
        </li>
      </ol>
      <ul v-else-if="block.type === 'list'">
        <li
          v-for="(item, itemIndex) in block.items"
          :key="itemIndex"
        >
          <ArticleInlineContent :tokens="item" />
        </li>
      </ul>
      <p v-else>
        <ArticleInlineContent :tokens="block.content" />
      </p>
    </template>
  </div>
</template>
