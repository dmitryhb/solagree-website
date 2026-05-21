<script setup lang="ts">
interface AboutAudienceCard {
  title: string
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
  heading: string
  body: string
  helper?: {
    label: string
    to: string
    suffix: string
  }
  cta: {
    label: string
    to: string
    variant: 'primary' | 'secondary'
  }
}

const audienceCards: readonly AboutAudienceCard[] = [
  {
    title: 'Considering Divorce',
    image: {
      src: '/images/about-considering-divorce.png',
      alt: 'Person seated on a sofa using a laptop.',
      width: 946,
      height: 544
    },
    heading: 'See If Solagree Is Right for You',
    body: "Take our quick quiz to find out if you're a fit and what your next step should be.",
    helper: {
      label: 'Schedule a consultation',
      to: '/book-a-solagree-consult',
      suffix: ' or'
    },
    cta: {
      label: 'Take the Quiz',
      to: '/quiz',
      variant: 'primary'
    }
  },
  {
    title: 'Attorneys & CDFAs',
    image: {
      src: '/images/about-attorneys-cdfas.png',
      alt: 'Professional advisor working from a desk during a virtual call.',
      width: 946,
      height: 544
    },
    heading: 'Join Our Network',
    body: "We're partnering with Attorneys and CDFAs nationwide who believe there's a better way to serve divorcing families.",
    cta: {
      label: 'Attorneys',
      to: '/attorneys',
      variant: 'secondary'
    }
  }
] as const
</script>

<template>
  <section
    class="about-audience-section"
    aria-label="Solagree paths"
  >
    <div class="about-audience-section__inner">
      <article
        v-for="(card, index) in audienceCards"
        :key="card.title"
        v-appear="{ delay: index * 100, variant: 'scale' }"
        class="about-audience-card"
      >
        <div class="about-audience-card__content">
          <h2 class="about-audience-card__title">
            {{ card.title }}
          </h2>

          <img
            class="about-audience-card__image"
            :src="card.image.src"
            :alt="card.image.alt"
            :width="card.image.width"
            :height="card.image.height"
            loading="lazy"
            decoding="async"
          >

          <div class="about-audience-card__copy">
            <h3 class="about-audience-card__heading">
              {{ card.heading }}
            </h3>
            <p class="about-audience-card__body">
              {{ card.body }}
            </p>
            <p
              v-if="card.helper"
              class="about-audience-card__helper"
            >
              <NuxtLink :to="card.helper.to">
                {{ card.helper.label }}
              </NuxtLink>{{ card.helper.suffix }}
            </p>
          </div>
        </div>

        <SiteButton
          class="about-audience-card__button"
          :class="`about-audience-card__button--${card.cta.variant}`"
          :to="card.cta.to"
          :variant="card.cta.variant"
        >
          {{ card.cta.label }}
        </SiteButton>
      </article>
    </div>
  </section>
</template>
