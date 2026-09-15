<script setup lang="ts">
import { pricingPlans } from '~/data/pricing-plans'

withDefaults(defineProps<{
  showNote?: boolean
  animateCards?: boolean
  headingId?: string
}>(), {
  showNote: true,
  animateCards: true,
  headingId: 'pricing-title'
})
</script>

<template>
  <section
    id="pricing"
    class="pricing-section"
    :aria-labelledby="headingId"
  >
    <div class="pricing-section__inner">
      <header v-if="$slots.header" class="pricing-section__header">
        <slot name="header" />
      </header>
      <header v-else v-appear class="pricing-section__header">
        <h2 :id="headingId" class="pricing-section__title">Find Your Track</h2>
        <p class="pricing-section__intro">Discover Solagree-CORE. These baseline pricing tiers include our structured flat-fee process: neutral experts, mediation, arbitration, and your final award.</p>
      </header>

      <div class="pricing-section__grid">
        <template
          v-for="(plan, index) in pricingPlans"
          :key="plan.name"
        >
          <PricingCard
            v-if="animateCards"
            :plan="plan"
            v-appear="{ delay: index * 80, variant: 'scale' }"
          />
          <PricingCard
            v-else
            :plan="plan"
          />
        </template>
      </div>

      <div v-if="showNote" class="pricing-section__note">
        <h2 class="section-title">Need legal guidance?</h2>
        <p>We recommend working with an attorney throughout the Solagree process. We can connect you with network attorneys who specialize in Solagree cases.</p>
        <p>For higher-conflict or complex cases requiring extended support, the Solagree-COMPASS program is available.</p>
      </div>
    </div>
  </section>
</template>
