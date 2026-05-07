<script setup lang="ts">
import { attorneyOnePlaceBenefits } from '~/data/attorney-benefits'
</script>

<template>
  <section
    class="attorney-one-place-section"
    aria-labelledby="attorney-one-place-title"
  >
    <div class="attorney-one-place-section__inner">
      <figure
        v-appear="{ variant: 'scale' }"
        class="attorney-one-place-section__media"
      >
        <img
          src="/images/attorney-everything-one-place.webp"
          alt="Attorney reviewing Solagree case materials."
          width="1050"
          height="1286"
          loading="lazy"
          decoding="async"
        >
      </figure>

      <div
        v-appear="{ delay: 100 }"
        class="attorney-one-place-section__content"
      >
        <div class="attorney-one-place-section__copy">
          <h2
            id="attorney-one-place-title"
            class="attorney-one-place-section__title"
          >
            Everything You Need in One Place
          </h2>

          <p class="attorney-one-place-section__intro">
            Track cases, access marketing materials, and manage your partnership in one place.
          </p>
        </div>

        <div class="attorney-one-place-section__benefits">
          <p class="attorney-one-place-section__benefits-title">
            What you get:
          </p>

          <ul class="attorney-one-place-section__list">
            <li
              v-for="benefit in attorneyOnePlaceBenefits"
              :key="benefit.title"
            >
              <strong>{{ benefit.title }}</strong> - {{ benefit.description }}
            </li>
          </ul>
        </div>

        <SiteButton
          class="attorney-one-place-section__cta"
          to="/webinar/"
          size="sm"
        >
          Watch the Partner Briefing
          <img
            class="button-arrow-icon"
            src="/icons/arrow.svg"
            alt=""
            width="16"
            height="17"
            aria-hidden="true"
          >
        </SiteButton>
      </div>
    </div>
  </section>
</template>
