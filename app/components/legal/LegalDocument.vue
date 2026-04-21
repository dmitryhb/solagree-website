<script setup lang="ts">
import type { LegalPageContent } from '~/types/legal'

defineProps<{
  page: LegalPageContent
}>()
</script>

<template>
  <article class="legal-document">
    <header class="legal-document__header">
      <h2 class="legal-document__title">
        {{ page.title }}
      </h2>
      <p class="legal-document__source">
        {{ page.sourceLabel }}
      </p>
    </header>

    <div class="legal-document__body">
      <template
        v-for="(block, index) in page.blocks"
        :key="`${block.type}-${index}`"
      >
        <p
          v-if="block.type === 'text'"
          class="legal-document__paragraph"
        >
          {{ block.text }}
        </p>

        <h3
          v-else-if="block.type === 'heading'"
          class="legal-document__section-title"
        >
          {{ block.text }}
        </h3>

        <p
          v-else-if="block.type === 'subheading'"
          class="legal-document__subheading"
        >
          {{ block.text }}
        </p>

        <ul
          v-else
          class="legal-document__list"
        >
          <li
            v-for="item in block.items"
            :key="`${item.label ?? 'item'}-${item.text}`"
          >
            <strong v-if="item.label">{{ item.label }}:</strong>
            {{ item.text }}
          </li>
        </ul>
      </template>
    </div>
  </article>
</template>
