<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CoBrandedPagePublicConfig } from '#shared/types/co-branded-page'
import CoBrandedConsultLink from '~/components/co-branded/CoBrandedConsultLink.vue'
import CoBrandedConsultModal from '~/components/co-branded/CoBrandedConsultModal.vue'
import CoBrandedFaqAccordion from '~/components/co-branded/CoBrandedFaqAccordion.vue'
import { resolveCoBrandedPageContent } from '~/templates/co-branded-page'
import type { CoBrandedPageRenderMode } from '~/types/co-branded-page'

const props = defineProps<{
  config: CoBrandedPagePublicConfig
  mode: CoBrandedPageRenderMode
}>()

const isConsultModalOpen = ref(false)
const content = computed(() => resolveCoBrandedPageContent(props.config.pageType))
const isEmbed = computed(() => props.mode === 'embed')
const currentYear = new Date().getFullYear()

const pageClasses = computed(() => ({
  'co-branded-page--cdfa': props.config.pageType === 'cdfa',
  'co-branded-page--embed': isEmbed.value,
  'co-branded-page--standard': !isEmbed.value
}))

const openConsultModal = (): void => {
  isConsultModalOpen.value = true
}

const closeConsultModal = (): void => {
  isConsultModalOpen.value = false
}
</script>

<template>
  <article
    class="co-branded-page"
    :class="pageClasses"
  >
    <header class="co-branded-page__brand-row">
      <img
        v-if="!isEmbed && config.logoUrl"
        class="co-branded-page__partner-logo"
        :src="config.logoUrl"
        :alt="config.companyName"
      >
      <img
        class="co-branded-page__solagree-logo"
        src="/solagree-logo.svg"
        alt="Solagree"
      >
    </header>

    <section
      class="co-branded-page__hero"
      aria-labelledby="co-branded-hero-title"
    >
      <div class="co-branded-page__hero-content">
        <p class="co-branded-page__hero-eyebrow">
          {{ content.hero.eyebrow }}
        </p>
        <h1 id="co-branded-hero-title">
          <span
            v-for="line in content.hero.titleLines"
            :key="line"
          >{{ line }}</span>
        </h1>
        <p class="co-branded-page__hero-copy">
          {{ content.hero.description }}
        </p>
        <CoBrandedConsultLink
          class="co-branded-page__hero-cta"
          :href="config.ctaUrl"
          :label="content.ctaLabel"
          arrow
          @activate="openConsultModal"
        />
      </div>

      <img
        class="co-branded-page__hero-image"
        src="/images/co-branded-hero.webp"
        alt="A professional woman with dark hair, a pink turtleneck, and a grey blazer sitting at a white desk with a keyboard, speaking and gesturing warmly during a video consultation."
      >
    </section>

    <FeatureStrip :items="content.benefits" />

    <section
      class="co-branded-page__what-is"
      aria-labelledby="co-branded-what-is-title"
    >
      <div class="co-branded-page__what-is-heading">
        <h2 id="co-branded-what-is-title">
          {{ content.whatIs.title }}
        </h2>
        <p>{{ content.whatIs.description }}</p>
      </div>

      <div class="co-branded-page__what-is-grid">
        <img
          class="co-branded-page__what-is-image"
          src="/images/co-branded-who-its-for.webp"
          alt="A smiling father with a graying beard sits on a white couch alongside his two sons, all laughing together while looking at a smartphone held by the younger boy."
        >

        <div class="co-branded-page__what-is-card">
          <h3>{{ content.whatIs.audienceTitle }}</h3>
          <ul>
            <li
              v-for="audience in content.whatIs.audience"
              :key="audience"
            >
              {{ audience }}
            </li>
          </ul>
          <CoBrandedConsultLink
            :href="config.ctaUrl"
            :label="content.ctaLabel"
            @activate="openConsultModal"
          />
        </div>
      </div>
    </section>

    <section
      class="co-branded-page__how-it-works"
      aria-labelledby="co-branded-how-it-works-title"
    >
      <h2 id="co-branded-how-it-works-title">
        {{ content.howItWorks.title }}
      </h2>

      <div class="co-branded-page__how-steps">
        <article
          v-for="step in content.howItWorks.steps"
          :key="step.key"
          class="co-branded-page__how-step"
          :class="`co-branded-page__how-step--${step.key}`"
        >
          <img
            class="co-branded-page__how-step-icon"
            :src="step.iconSrc"
            alt=""
            aria-hidden="true"
          >
          <span class="co-branded-page__how-step-number">{{ step.number }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </article>
      </div>
    </section>

    <section
      class="co-branded-page__attorney-guide"
      aria-labelledby="co-branded-attorney-guide-title"
    >
      <img
        class="co-branded-page__attorney-guide-image"
        src="/images/co-branded-attorney-guides.webp"
        alt="An East Asian professional woman wearing glasses and a grey blazer sits at a conference table, holding a white document in one hand while using a pen to navigate her open silver laptop."
      >

      <div class="co-branded-page__attorney-guide-content">
        <h2 id="co-branded-attorney-guide-title">
          {{ content.guide.title }}
        </h2>
        <p class="co-branded-page__attorney-guide-lede">
          {{ content.guide.lede }}
        </p>

        <ul class="co-branded-page__attorney-guide-list">
          <li
            v-for="item in content.guide.items"
            :key="item.title"
          >
            <strong>{{ item.title }}</strong> - {{ item.description }}
          </li>
        </ul>

        <CoBrandedConsultLink
          :href="config.ctaUrl"
          :label="content.ctaLabel"
          arrow
          @activate="openConsultModal"
        />
      </div>
    </section>

    <section
      class="co-branded-page__tracks"
      aria-labelledby="co-branded-tracks-title"
    >
      <h2 id="co-branded-tracks-title">
        {{ content.tracks.title }}
      </h2>
      <p class="co-branded-page__tracks-intro">
        <template
          v-for="(line, index) in content.tracks.intro"
          :key="line"
        >
          <br v-if="index">
          {{ line }}
        </template>
      </p>

      <div class="co-branded-page__tracks-grid">
        <article
          v-for="track in content.tracks.items"
          :key="track.title"
          class="co-branded-page__track-card"
        >
          <h3>{{ track.title }}</h3>
          <p class="co-branded-page__track-description">
            {{ track.description }}
          </p>

          <div class="co-branded-page__track-includes">
            <p class="co-branded-page__track-includes-title">
              For cases involving
            </p>
            <ul class="co-branded-page__track-features">
              <li
                v-for="feature in track.features"
                :key="feature"
              >
                {{ feature }}
              </li>
            </ul>
          </div>

          <p
            v-if="track.note"
            class="co-branded-page__track-note"
          >
            {{ track.note }}
          </p>
        </article>
      </div>

      <div class="co-branded-page__tracks-note">
        <p><strong>{{ content.tracks.closingLead }}</strong></p>
        <p>{{ content.tracks.closing }}</p>
      </div>
    </section>

    <section
      class="co-branded-page__questions"
      aria-labelledby="co-branded-questions-title"
    >
      <div class="co-branded-page__questions-copy">
        <h2 id="co-branded-questions-title">
          {{ content.questions.title }}
        </h2>
        <div class="co-branded-page__questions-intro">
          <p
            v-for="paragraph in content.questions.intro"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
        <CoBrandedConsultLink
          :href="config.ctaUrl"
          :label="content.ctaLabel"
          @activate="openConsultModal"
        />
      </div>

      <CoBrandedFaqAccordion :items="content.questions.items" />
    </section>

    <section
      class="co-branded-page__next-steps"
      aria-labelledby="co-branded-next-steps-title"
    >
      <div class="co-branded-page__section-heading">
        <h2 id="co-branded-next-steps-title">
          {{ content.nextSteps.title }}
        </h2>
        <p>{{ content.nextSteps.intro }}</p>
      </div>

      <div class="co-branded-page__next-steps-grid">
        <div class="co-branded-page__next-steps-card">
          <h3>{{ content.nextSteps.cardTitle }}</h3>
          <p>{{ content.nextSteps.cardDescription }}</p>
          <CoBrandedConsultLink
            :href="config.ctaUrl"
            :label="content.ctaLabel"
            @activate="openConsultModal"
          />
        </div>

        <img
          class="co-branded-page__next-steps-image"
          src="/images/co-branded-next-steps.webp"
          alt="A close-up view of a blonde woman wearing a crisp white button-down shirt, holding a black smartphone to her ear while listening intently during a call."
        >
      </div>
    </section>

    <footer
      v-if="!isEmbed"
      class="co-branded-page__footer"
    >
      <div class="co-branded-page__footer-inner">
        <div class="co-branded-page__footer-contact">
          <strong v-if="config.attorneyName">{{ config.attorneyName }}</strong>
          <span>{{ config.firmName || config.companyName }}</span>
          <div class="co-branded-page__footer-contact-lines">
            <span v-if="config.phoneNumber">Phone: {{ config.phoneNumber }}</span>
            <span v-if="config.emailAddress">Email: {{ config.emailAddress }}</span>
          </div>
        </div>

        <div class="co-branded-page__footer-solagree">
          <span
            class="co-branded-page__footer-logo"
            aria-label="Solagree"
          />
          <a
            href="https://solagree.com"
            target="_blank"
            rel="noopener noreferrer"
          >Learn more: solagree.com</a>
        </div>
      </div>

      <div class="co-branded-page__footer-bottom">
        <nav
          class="co-branded-page__footer-legal"
          aria-label="Legal links"
        >
          <a href="/legal/terms-of-service">Terms of Service</a>
          <a href="/legal/privacy-policy">Privacy Policy</a>
          <a href="/legal/accessibility">Accessibility</a>
        </nav>
        <p>© {{ currentYear }} Solagree, LLC. All Rights Reserved.</p>
        <p>Solagree® is not a law firm and does not provide legal advice. We connect clients with independent professionals.</p>
      </div>
    </footer>
  </article>

  <CoBrandedConsultModal
    :open="isConsultModalOpen"
    :company-name="config.companyName"
    :partner-slug="config.slug"
    :page-type="config.pageType"
    @close="closeConsultModal"
  />
</template>
