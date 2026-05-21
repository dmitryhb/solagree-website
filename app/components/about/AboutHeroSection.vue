<template>
  <section
    class="about-hero-section"
    aria-labelledby="about-hero-title"
  >
    <div class="about-hero-section__inner">
      <div
        v-appear
        class="about-hero-section__content"
      >
        <p class="about-hero-section__eyebrow">
          A Better Way to Separate
        </p>

        <h1
          id="about-hero-title"
          class="about-hero-section__title"
        >
          We're Changing the Way America Divorces
        </h1>

        <p class="about-hero-section__intro">
          Divorce doesn't have to mean years in court, depleted savings, and emotional devastation. Solagree is a structured, entirely virtual process where financial and parenting experts guide you to a binding resolution.
        </p>
      </div>

      <figure
        v-appear="{ delay: 100, variant: 'scale' }"
        class="about-hero-section__media"
      >
        <img
          src="/images/about-hero.png"
          alt="Parent greeting their child at the door."
          width="968"
          height="930"
          loading="eager"
          decoding="async"
        >
      </figure>
    </div>
  </section>
</template>
