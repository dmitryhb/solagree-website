<script setup lang="ts">
import type { AccordionItem } from '~/types/accordion'

withDefaults(defineProps<{
  items: AccordionItem[]
  defaultValue?: string
  numbered?: boolean
}>(), {
  defaultValue: undefined,
  numbered: false
})

const accordionUi = {
  root: 'base-accordion__root',
  item: 'base-accordion__item',
  header: 'base-accordion__header',
  trigger: 'base-accordion__trigger',
  label: 'base-accordion__label-wrap',
  content: 'base-accordion__content',
  body: 'base-accordion__body'
}
</script>

<template>
  <UAccordion
    class="base-accordion"
    :items="items"
    :default-value="defaultValue"
    :ui="accordionUi"
    collapsible
  >
    <template #default="{ item, index }">
      <span class="base-accordion__label">
        <span
          v-if="numbered"
          class="base-accordion__number"
          aria-hidden="true"
        >
          {{ index + 1 }}.
        </span>
        {{ item.label }}
      </span>
    </template>

    <template #trailing="{ open }">
      <span
        class="base-accordion__indicator"
        aria-hidden="true"
      >
        {{ open ? '-' : '+' }}
      </span>
    </template>

    <template #body="{ item }">
      <p
        v-if="item.contentHtml"
        class="base-accordion__text"
        v-html="item.contentHtml"
      />
      <p
        v-else
        class="base-accordion__text"
      >
        {{ item.content }}
      </p>
    </template>
  </UAccordion>
</template>
