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
      <figure
        v-else-if="block.type === 'image'"
        class="article-rich-text__figure"
      >
        <img
          :src="block.src"
          :alt="block.alt"
          loading="lazy"
          decoding="async"
        >
        <figcaption
          v-if="block.alt"
          class="article-rich-text__figure-caption"
        >
          {{ block.alt }}
        </figcaption>
      </figure>
      <aside
        v-else-if="block.type === 'callout'"
        class="article-rich-text__callout"
        :data-variant="block.variant"
      >
        <p
          v-if="block.title"
          class="article-rich-text__callout-title"
        >
          {{ block.title }}
        </p>
        <div class="article-rich-text__callout-content">
          <ArticleInlineContent :tokens="block.content" />
        </div>
      </aside>
      <p v-else>
        <ArticleInlineContent :tokens="block.content" />
      </p>
    </template>
  </div>
</template>
