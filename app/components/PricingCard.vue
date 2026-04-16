<script setup lang="ts">
defineProps<{
  plan: string
  price: string
  cadence: string
  description: string
  features: string[]
  featured?: boolean
  ctaLabel: string
  ctaTo?: string
}>()
</script>

<template>
  <SurfaceCard
    :tone="featured ? 'dark' : 'light'"
    class="pricing-card h-full"
  >
    <div class="space-y-3">
      <p class="eyebrow">
        {{ plan }}
      </p>
      <div class="pricing-card__price">
        <span class="pricing-card__amount">{{ price }}</span>
        <span class="pricing-card__cadence">{{ cadence }}</span>
      </div>
      <p class="prose-copy !max-w-none">
        {{ description }}
      </p>
    </div>

    <ul class="pricing-card__features">
      <li
        v-for="feature in features"
        :key="feature"
        class="pricing-card__feature"
      >
        {{ feature }}
      </li>
    </ul>

    <SiteButton
      :to="ctaTo"
      :variant="featured ? 'primary' : 'secondary'"
      block
    >
      {{ ctaLabel }}
    </SiteButton>
  </SurfaceCard>
</template>
