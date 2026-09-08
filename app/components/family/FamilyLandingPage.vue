<script setup lang="ts">
import FamilyPricingCard from './FamilyPricingCard.vue'
import WebinarVideoFrame from '~/components/webinar/WebinarVideoFrame.vue'
import { howItWorksPhases } from '~/data/how-it-works-phases'
import { pricingPlans } from '~/data/family-pricing-plans'
import type { FamilyLandingPage } from '~/data/family-landing-pages'

const props = defineProps<{ page: FamilyLandingPage }>()
useSolagreeSeo({
  title: () => props.page.title,
  description: () => props.page.description,
  path: () => props.page.path,
  image: () => props.page.hero.src
})
</script>

<template>
  <main class="family-page" :class="`family-page--${page.theme}`">
    <section class="family-page__hero" aria-labelledby="family-title">
      <div class="family-page__hero-inner">
        <div class="family-page__hero-copy">
          <p class="family-page__eyebrow">{{ page.eyebrow }}</p>
          <h1 id="family-title" class="family-page__seo-title">{{ page.title }}</h1>
          <p class="family-page__headline">{{ page.headline }}</p>
          <p class="family-page__description">{{ page.description }}</p>
          <SiteButton to="/quiz" :variant="page.theme === 'military' ? 'secondary' : 'primary'" size="sm">Take the Quiz</SiteButton>
        </div>
        <img class="family-page__hero-image" :src="page.hero.src" :alt="page.hero.alt" width="1400" height="1000" fetchpriority="high" decoding="async">
      </div>
    </section>

    <section class="co-branded-page__feature-strip family-page__feature-strip" aria-label="Solagree benefits">
      <ul><li>Resolve Faster</li><li>Predictable Pricing</li><li>Entirely Virtual</li><li>Binding Process</li></ul>
    </section>

    <section class="family-page__concerns family-page__section" aria-labelledby="family-concerns-title">
      <h2 id="family-concerns-title">You're Not Just Facing Divorce.<br>You're Facing This Too.</h2>
      <div class="family-page__concern-grid">
        <article v-for="concern in page.concerns" :key="concern.question" class="family-page__concern">
          <h3>{{ concern.question }}</h3><p>{{ concern.answer }}</p>
        </article>
      </div>
    </section>

    <section class="family-page__specialists family-page__section" aria-labelledby="family-specialists-title">
      <h2 id="family-specialists-title">What you get with <span>Solagree</span></h2>
      <div class="family-page__specialist-grid">
        <article v-for="specialist in page.specialists" :key="specialist.title" class="family-page__specialist">
          <img :src="specialist.iconSrc" alt="" width="88" height="88" loading="lazy">
          <h3>{{ specialist.title }}</h3><p>{{ specialist.description }}</p>
        </article>
      </div>
    </section>

    <section class="family-page__process family-page__section" aria-labelledby="family-process-title">
      <div class="how-it-works-section__intro-grid">
        <div class="how-it-works-section__copy">
          <h2 id="family-process-title">How It Works</h2>
          <p class="how-it-works-section__intro"><strong>Three phases. One resolution.</strong> A structured process designed for couples who can't agree on everything.</p>
          <SiteButton class="how-it-works-section__cta" to="/quiz" size="sm">Is Solagree Right for You?</SiteButton>
        </div>
        <ol class="how-it-works-section__phases">
          <li class="how-it-works-section__phase">
            <h3 class="how-it-works-section__phase-title"><span>Phase 1:</span> Assessment</h3>
            <p v-for="paragraph in page.assessment" :key="paragraph" class="how-it-works-section__phase-description">{{ paragraph }}</p>
          </li>
          <li v-for="phase in howItWorksPhases.slice(1)" :key="phase.title" class="how-it-works-section__phase">
            <h3 class="how-it-works-section__phase-title"><span>{{ phase.eyebrow }}</span> {{ phase.title }}</h3>
            <p class="how-it-works-section__phase-description">{{ phase.description }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="family-page__why" aria-labelledby="family-why-title">
      <div class="family-page__why-inner">
        <img :src="page.why.src" :alt="page.why.alt" width="1400" height="1000" loading="lazy" decoding="async">
        <div>
          <h2 id="family-why-title">Why It Matters</h2>
          <p>{{ page.why.text }}</p>
          <SiteButton to="/quiz" size="sm">Take the Quiz</SiteButton>
        </div>
      </div>
    </section>

    <section class="family-page__video family-page__section" aria-label="Solagree explained by Amanda">
      <WebinarVideoFrame />
      <div class="family-page__get-started">
        <h2>Ready to get started?</h2>
        <p>Find out if Solagree fits your situation in under 2 minutes.<br>Get your personalized recommendation today.</p>
        <SiteButton to="/quiz" size="sm">Take the Quiz</SiteButton>
      </div>
    </section>

    <section id="pricing" class="pricing-section family-page__pricing" aria-labelledby="family-pricing-title">
      <div class="pricing-section__inner">
        <header class="pricing-section__header">
          <h2 id="family-pricing-title">Transparent flat-fee pricing.</h2>
          <p v-for="paragraph in page.pricingIntro" :key="paragraph" class="pricing-section__intro">{{ paragraph }}</p>
        </header>
        <div class="pricing-section__grid"><FamilyPricingCard v-for="plan in pricingPlans" :key="plan.name" :plan="plan" /></div>
      </div>
    </section>

    <section class="family-page__faq family-page__section" aria-labelledby="family-faq-title">
      <div><h2 id="family-faq-title">{{ page.faqTitle }}</h2><p>{{ page.faqIntro }}</p></div>
      <BaseAccordion :items="page.faqs" default-value="0" numbered />
    </section>

    <section class="family-page__closing" aria-labelledby="family-closing-title">
      <h2 id="family-closing-title">{{ page.closing.title }}</h2>
      <div class="family-page__closing-grid">
        <div class="family-page__closing-copy">
          <p class="family-page__closing-intro">Take the quiz — takes less than two minutes, and we'll tell you exactly where you stand.</p>
          <SiteButton to="/quiz" size="sm">Take the Quiz</SiteButton>
          <p>Already know this is right for you?<br><NuxtLink to="/book-a-solagree-consult">Book your Initial Consult ($60)</NuxtLink></p>
        </div>
        <img :src="page.closing.src" :alt="page.closing.alt" width="1400" height="930" loading="lazy" decoding="async">
      </div>
    </section>
    <SiteFooter />
  </main>
</template>

<style scoped lang="scss">
@use '~/assets/styles/components/family-landing';
</style>

<style lang="scss">
@use '~/assets/styles/components/family-pricing';
</style>
