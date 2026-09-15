<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CoBrandedPageFaqContent } from '~/types/co-branded-page'

const props = defineProps<{
  items: readonly CoBrandedPageFaqContent[]
}>()

const openItemIndex = ref<number | null>(0)

const handleToggle = (index: number, event: Event): void => {
  const item = event.currentTarget instanceof HTMLDetailsElement
    ? event.currentTarget
    : null

  if (!item) {
    return
  }

  if (item.open) {
    openItemIndex.value = index
  } else if (openItemIndex.value === index) {
    openItemIndex.value = null
  }
}

watch(
  () => props.items,
  () => {
    openItemIndex.value = 0
  }
)
</script>

<template>
  <div class="co-branded-page__questions-accordion">
    <details
      v-for="(item, index) in items"
      :key="item.question"
      class="co-branded-page__accordion-item"
      :open="openItemIndex === index"
      @toggle="handleToggle(index, $event)"
    >
      <summary>
        <span>{{ item.question }}</span>
        <span
          class="co-branded-page__accordion-icon"
          aria-hidden="true"
        />
      </summary>

      <div
        v-if="item.grouped"
        class="co-branded-page__accordion-content"
      >
        <p
          v-for="paragraph in item.paragraphs"
          :key="paragraph"
        >
          {{ paragraph }}
        </p>
        <ul v-if="item.bullets">
          <li
            v-for="bullet in item.bullets"
            :key="bullet"
          >
            {{ bullet }}
          </li>
        </ul>
      </div>

      <template v-else>
        <p
          v-for="paragraph in item.paragraphs"
          :key="paragraph"
        >
          {{ paragraph }}
        </p>
      </template>
    </details>
  </div>
</template>
