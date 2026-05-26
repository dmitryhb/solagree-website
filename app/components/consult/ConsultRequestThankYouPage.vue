<script setup lang="ts">
import type { ConsultRequestThankYouContent } from '~/types/consult-request'

defineProps<{
  content: ConsultRequestThankYouContent
}>()
</script>

<template>
  <main class="consult-request-page">
    <section
      class="consult-request-page__content consult-request-page__content--sent"
      aria-labelledby="consult-request-sent-title"
    >
      <div class="consult-request-sent">
        <h1
          id="consult-request-sent-title"
          class="consult-request-sent__title"
        >
          {{ content.title }}
        </h1>

        <div class="consult-request-sent__copy">
          <p><strong>Within 1 business day, you'll receive:</strong></p>
          <ul>
            <li>• {{ content.paymentItem }}</li>
            <li>• Your calendar invite and meeting details (sent after payment)</li>
          </ul>

          <p><strong>On the call, we'll:</strong></p>
          <ul>
            <li
              v-for="item in content.callItems"
              :key="item"
            >
              • {{ item }}
            </li>
          </ul>

          <p>Looking forward to connecting!</p>
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
