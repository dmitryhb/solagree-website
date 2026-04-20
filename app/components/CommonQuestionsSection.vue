<script setup lang="ts">
import type { AccordionItem } from '~/types/accordion'

const commonQuestionItems: AccordionItem[] = [
  {
    label: 'Question 1',
    value: 'question-1',
    content:
      "Unlike traditional mediation where either party can walk away, Solagree includes binding arbitration. Both parties commit to the process upfront. Where mediation doesn't resolve issues, an arbitrator decides. You reach resolution."
  },
  {
    label: 'Question 2',
    value: 'question-2',
    content:
      'Solagree combines structured mediation, financial guidance, and a clear decision path so couples can keep the process moving.'
  },
  {
    label: 'Question 3',
    value: 'question-3',
    content:
      'The process is designed for couples who need expert support and want to avoid the cost and uncertainty of traditional litigation.'
  },
  {
    label: 'Question 4',
    value: 'question-4',
    content:
      'Independent professionals help guide the process while Solagree provides the framework for reaching a final resolution.'
  },
  {
    label: 'Question 5',
    value: 'question-5',
    content:
      'The quiz is the fastest way to understand whether the Solagree process may fit your situation.'
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
      <div class="common-questions-section__copy">
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
          to="/quiz"
          size="sm"
        >
          Is Solagree right for you?
        </SiteButton>
      </div>

      <BaseAccordion
        class="common-questions-section__accordion"
        :items="commonQuestionItems"
        default-value="question-1"
        numbered
      />
    </div>
  </section>
</template>
