<script setup lang="ts">
import ArticleInlineContent from '~/components/blog/ArticleInlineContent.vue'
import SiteButton from '~/components/SiteButton.vue'
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
      <figure
        v-if="block.type === 'image'"
        class="article-rich-text__image"
      >
        <img
          :src="block.src"
          :alt="block.alt"
          loading="lazy"
          decoding="async"
        >
      </figure>
      <aside
        v-else-if="block.type === 'callout'"
        class="article-rich-text__callout"
      >
        <h2 class="article-rich-text__callout-title">
          <ArticleInlineContent :tokens="block.title" />
        </h2>
        <p>
          <ArticleInlineContent :tokens="block.body" />
        </p>
        <SiteButton
          :to="block.actionHref"
          size="sm"
        >
          {{ block.actionLabel }}
        </SiteButton>
      </aside>
      <h2 v-else-if="block.type === 'heading' && block.level === 2">
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
      <p
        v-else
        :class="{ 'article-rich-text__lead': index === 0 }"
      >
        <ArticleInlineContent :tokens="block.content" />
      </p>
    </template>
  </div>
</template>
