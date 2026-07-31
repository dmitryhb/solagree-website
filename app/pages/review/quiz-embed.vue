<script setup lang="ts">
import SolagreeQuizEmbed from '~/components/quiz/SolagreeQuizEmbed.vue'
import type { QuizHostEvent } from '~/data/quiz-types'

const events = ref<QuizHostEvent[]>([])
const hostConfig = {
  hostId: 'review-embed-host',
  analytics: {
    enabled: true,
    trackingId: 'review-analytics'
  },
  bridge: {
    postMessage: false
  },
  ctas: {
    'solagree-consult': {
      href: 'https://example.com/book-solagree',
      trackingId: 'cta-solagree-review',
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  }
} as const

const handleHostEvent = (event: QuizHostEvent) => {
  events.value = [event, ...events.value].slice(0, 8)
}

useSolagreeSeo({
  title: 'Quiz Embed Review | Solagree',
  description: 'Internal signoff surface for the Solagree quiz embed contract.',
  noIndex: true,
  path: '/review/quiz-embed'
})
</script>

<template>
  <main class="page-shell">
    <div class="section-shell space-y-8 py-8">
      <div class="space-y-2">
        <p class="eyebrow">
          Embed review
        </p>
        <h1 class="editorial-display max-w-3xl">
          Host-configured quiz shell
        </h1>
        <p class="prose-copy max-w-2xl">
          This surface hides the standalone header, injects review CTA targets, and logs bounded host events.
        </p>
      </div>

      <SolagreeQuizEmbed
        :host-config="hostConfig"
        @host-event="handleHostEvent"
      />

      <section class="rounded-[24px] border border-[rgba(62,64,89,0.12)] bg-white px-5 py-4 shadow-[0_16px_36px_rgba(62,64,89,0.08)]">
        <h2 class="section-title text-[1.5rem]">
          Recent host events
        </h2>
        <pre class="mt-4 overflow-x-auto rounded-[18px] bg-[rgba(62,64,89,0.92)] p-4 text-sm leading-6 text-white">{{ JSON.stringify(events, null, 2) }}</pre>
      </section>
    </div>
  </main>
</template>
