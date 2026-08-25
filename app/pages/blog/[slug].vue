<script setup lang="ts">
import BlogArticlePage from '~/components/blog/BlogArticlePage.vue'
import { resourceContentEntries, publishedArticles } from '~/data/resource-content'
import { getArticlePath, buildArticleStructuredData } from '~/utils/article-seo'
import { getPublishedArticleBySlug } from '#shared/resource-content-validation'

const route = useRoute()
const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
const article = getPublishedArticleBySlug(resourceContentEntries, slug)

if (!article) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const runtimeConfig = useRuntimeConfig()
const articlePath = getArticlePath(article)
const articleUrl = `${runtimeConfig.public.siteUrl.replace(/\/+$/, '')}${articlePath}`
const curatedRelatedArticles = article.relatedArticleSlugs?.flatMap((relatedSlug) => {
  const relatedArticle = publishedArticles.find(candidate => candidate.slug === relatedSlug)

  return relatedArticle ? [relatedArticle] : []
})
const relatedArticles = curatedRelatedArticles?.length
  ? curatedRelatedArticles.slice(0, 2)
  : publishedArticles.filter(candidate => candidate.slug !== article.slug).slice(0, 2)

useSolagreeSeo({
  title: article.seo.title,
  description: article.seo.description,
  image: article.social.image,
  path: articlePath,
  structuredData: [buildArticleStructuredData(article, runtimeConfig.public.siteUrl)],
  type: 'article'
})
</script>

<template>
  <BlogArticlePage
    :article="article"
    :related-articles="relatedArticles"
    :share-url="articleUrl"
  />
</template>
