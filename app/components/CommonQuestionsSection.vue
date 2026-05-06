<script setup lang="ts">
import type { AccordionItem } from '~/types/accordion'

const commonQuestionItems: AccordionItem[] = [
  {
    label: "What if we can't agree on everything?",
    value: 'what-if-we-cant-agree-on-everything',
    content:
      "That's exactly why binding arbitration is built into the process. You don't have to agree on everything to move forward. If you get stuck after mediation, a neutral arbitrator makes the final decisions. You still reach resolution - you're not starting over with court litigation."
  },
  {
    label: 'How do I get my spouse on board with Solagree?',
    value: 'how-do-i-get-my-spouse-on-board-with-solagree',
    content:
      "Here are a few approaches:\nShare this website so they can explore Solagree on their own\nFocus on the benefits - faster resolution, less conflict, predictable costs\nConnect them with their own attorney - We can refer them to a network attorney who works with Solagree\nSchedule a consultation to discuss the best approach for your situation, and we'll help you navigate next steps."
  },
  {
    label: 'How is Solagree different from traditional divorce?',
    value: 'how-is-solagree-different-from-traditional-divorce',
    content:
      "Solagree is entirely online with a structured three-phase process: expert information gathering, mediation, and binding arbitration if needed. Both parties are bound from the start to complete the process, so you're guaranteed to reach resolution. You work with professional neutrals (not judges), and the fees are predictable."
  },
  {
    label: 'Do we both need attorneys?',
    value: 'do-we-both-need-attorneys',
    content:
      'Not required, but recommended. We can connect you with network attorneys who specialize in Solagree cases, or you can work with your own attorney. Having legal guidance helps protect your interests throughout the process.'
  },
  {
    label: 'Is the arbitration binding?',
    value: 'is-the-arbitration-binding',
    content:
      "Yes, in most states. The arbitration award becomes a legally binding resolution that's filed with the court. This ensures both parties reach a final outcome."
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
        default-value="what-if-we-cant-agree-on-everything"
        numbered
      />
    </div>
  </section>
</template>
