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
      <header
        v-appear
        class="pricing-section__header"
      >
        <h2
          id="pricing-title"
          class="pricing-section__title"
        >
          Choose Your Track
        </h2>
        <p class="pricing-section__intro">
          Solagree's platform fees include the core process: neutral experts, mediation, arbitration, and final award.
        </p>
      </header>

      <div class="pricing-section__grid">
        <PricingCard
          v-for="(plan, index) in pricingPlans"
          :key="plan.name"
          :plan="plan"
          v-appear="{ delay: index * 80, variant: 'scale' }"
        />
      </div>

      <p class="pricing-section__note">
        Your attorney continues to provide strategic guidance throughout the Solagree process.<br>
        Discuss their fee structure directly with your attorney.
      </p>
    </div>
  </section>
</template>
