<script setup lang="ts">
import type { LegalPageContent } from '~/types/legal'

defineProps<{
  page: LegalPageContent
}>()

interface LegalTextSegment {
  text: string
  href?: string
}

const linkedTextPattern = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:https?:\/\/)?(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,}(?::\d+)?(?:\/[^\s]*)?)/gi
const trailingPunctuationPattern = /[),.;:]+$/

const getLinkHref = (value: string) => {
  if (value.includes('@')) {
    return `mailto:${value}`
  }

  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

const getLinkedTextSegments = (text: string): LegalTextSegment[] => {
  const segments: LegalTextSegment[] = []
  let lastIndex = 0

  for (const match of text.matchAll(linkedTextPattern)) {
    const matchedText = match[0]
    const matchIndex = match.index ?? 0

    if (matchIndex > lastIndex) {
      segments.push({ text: text.slice(lastIndex, matchIndex) })
    }

    const trailingPunctuation = matchedText.match(trailingPunctuationPattern)?.[0] ?? ''
    const linkText = trailingPunctuation ? matchedText.slice(0, -trailingPunctuation.length) : matchedText

    segments.push({
      text: linkText,
      href: getLinkHref(linkText)
    })

    if (trailingPunctuation) {
      segments.push({ text: trailingPunctuation })
    }

    lastIndex = matchIndex + matchedText.length
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) })
  }

  return segments.length > 0 ? segments : [{ text }]
}
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
      <p class="legal-document__revision">
        {{ page.revisionLabel }}
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
          <template
            v-for="(segment, segmentIndex) in getLinkedTextSegments(block.text)"
            :key="`${block.type}-${index}-segment-${segmentIndex}`"
          >
            <a
              v-if="segment.href"
              class="legal-document__link"
              :href="segment.href"
              rel="noopener noreferrer"
              target="_blank"
            >
              {{ segment.text }}
            </a>
            <template v-else>
              {{ segment.text }}
            </template>
          </template>
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
            <template
              v-for="(segment, segmentIndex) in getLinkedTextSegments(item.text)"
              :key="`${item.label ?? 'item'}-${segmentIndex}`"
            >
              <a
                v-if="segment.href"
                class="legal-document__link"
                :href="segment.href"
                rel="noopener noreferrer"
                target="_blank"
              >
                {{ segment.text }}
              </a>
              <template v-else>
                {{ segment.text }}
              </template>
            </template>
          </li>
        </ul>
      </template>
    </div>
  </article>
</template>
