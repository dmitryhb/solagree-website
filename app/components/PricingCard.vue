<script setup lang="ts">
import type { PricingPlan } from '~/types/pricing'

defineProps<{
  plan: PricingPlan
}>()
</script>

<template>
  <article
    class="pricing-card"
    :class="{ 'pricing-card--featured': plan.featured }"
  >
    <div class="pricing-card__content">
      <div class="pricing-card__header">
        <p class="pricing-card__name">
          {{ plan.name }}
        </p>

        <span
          v-if="plan.badge"
          class="pricing-card__badge"
        >
          {{ plan.badge }}
        </span>
      </div>

      <p
        v-if="plan.eyebrow"
        class="pricing-card__eyebrow"
      >
        {{ plan.eyebrow }}
      </p>

      <div class="pricing-card__price">
        <span class="pricing-card__amount">{{ plan.price }}</span>
        <span class="pricing-card__cadence">{{ plan.cadence }}</span>
      </div>

      <p class="pricing-card__description">
        {{ plan.description }}
      </p>

      <div class="pricing-card__includes">
        <p class="pricing-card__includes-title">
          For cases involving
        </p>

        <ul class="pricing-card__features">
          <li
            v-for="feature in plan.features"
            :key="feature"
            class="pricing-card__feature"
          >
            {{ feature }}
          </li>
        </ul>
      </div>
    </div>

    <SiteButton
      v-if="plan.ctaLabel && plan.ctaTo"
      class="pricing-card__cta"
      :to="plan.ctaTo"
      :variant="plan.featured ? 'secondary' : 'muted'"
      block
    >
      {{ plan.ctaLabel }}
    </SiteButton>

    <div class="pricing-card__note">
      <span class="pricing-card__note-label">Best for</span>
      <p>{{ plan.note }}</p>
    </div>
  </article>
</template>
