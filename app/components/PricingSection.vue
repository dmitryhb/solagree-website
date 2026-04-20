<script setup lang="ts">
import { pricingPlans } from '~/data/pricing-plans'
</script>

<template>
  <section
    id="pricing"
    class="pricing-section"
    aria-labelledby="pricing-title"
  >
    <div class="pricing-section__inner">
      <header class="pricing-section__header">
        <h2
          id="pricing-title"
          class="pricing-section__title"
        >
          Transparent flat-fee pricing.
        </h2>
      </header>

      <div class="pricing-section__grid">
        <PricingCard
          v-for="plan in pricingPlans"
          :key="plan.name"
          :plan="plan"
        />
      </div>
    </div>
  </section>
</template>
