<script setup lang="ts">
import type { AccordionItem } from '~/types/accordion'

const commonQuestionItems: AccordionItem[] = [
  {
    label: 'How do I get my spouse to agree?',
    value: 'how-do-i-get-my-spouse-on-board-with-solagree',
    contentHtml:
      '<a href="/book-a-solagree-consult">Schedule a consultation</a>'
  },
  {
    label: 'How is Solagree Different?',
    value: 'how-is-solagree-different-from-traditional-divorce',
    content:
      'Solagree is entirely virtual with a structured three-phase process: expert information gathering, mediation, and arbitration to finalize your binding document. Both parties are bound from the start to complete the process, so you\'re more assured to reach resolution. You work with professional neutrals (not judges), and the fees are predictable.'
  },
  {
    label: 'Do we both need attorneys?',
    value: 'do-we-both-need-attorneys',
    content:
      'Not necessarily required, but recommended. We can connect you with network attorneys who are versed in handling Solagree cases, or you can work with your own attorney. Having legal guidance helps protect your interests throughout the process.'
  },
  {
    label: 'Is the arbitration binding?',
    value: 'is-the-arbitration-binding',
    contentHtml:
      "All processes must be adapted to your state&rsquo;s legal requirements, and for this reason we always recommend a consult with one of our network attorneys. You can <a href=\"/book-a-solagree-consult\">request one here</a>."
  }
]
</script>

<template>
  <section
    id="common-questions"
    class="common-questions-section"
    aria-labelledby="common-questions-title"
  >
    <div class="common-questions-section__inner">
      <div
        v-appear
        class="common-questions-section__copy"
      >
        <h2
          id="common-questions-title"
          class="common-questions-section__title"
        >
          Common Questions
        </h2>

        <div class="common-questions-section__intro">
          <p>
            Solagree offers a structured alternative to traditional divorce litigation - combining expert financial guidance,
            mediation, and binding arbitration.
          </p>
          <p>
            Our process is designed for couples who can't agree on everything but want to avoid lengthy court battles and
            reach resolution efficiently.
          </p>
        </div>

        <SiteButton
          class="common-questions-section__cta"
          to="#quiz"
          size="sm"
        >
          Is Solagree right for you?
        </SiteButton>
      </div>

      <BaseAccordion
        v-appear="{ delay: 100 }"
        class="common-questions-section__accordion"
        :items="commonQuestionItems"
        default-value="how-do-i-get-my-spouse-on-board-with-solagree"
        numbered
      />
    </div>
  </section>
</template>
