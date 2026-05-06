<template>
  <section
    class="attorney-hero-section"
    aria-labelledby="attorney-hero-title"
  >
    <div class="attorney-hero-section__inner">
      <div
        v-appear
        class="attorney-hero-section__content"
      >
        <p class="attorney-hero-section__eyebrow">
          A Better Way to Practice Family Law
        </p>

        <h1
          id="attorney-hero-title"
          class="attorney-hero-section__title"
        >
          <span>Expand Your Practice.</span>
          <span>Reclaim Your Time.</span>
        </h1>

        <p class="attorney-hero-section__intro">
          Receive qualified referrals in your state, explore neutral opportunities, and bring your own divorce cases -
          all while earning predictable revenue without adding overhead.
        </p>

        <div class="attorney-hero-section__actions">
          <SiteButton
            class="attorney-hero-section__primary"
            to="/webinar/"
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

          <NuxtLink
            class="attorney-hero-section__secondary"
            to="/attorney-application"
          >
            Join the free Network
          </NuxtLink>
        </div>
      </div>

      <figure
        v-appear="{ delay: 100, variant: 'scale' }"
        class="attorney-hero-section__media"
      >
        <img
          src="/images/attorney-hero.webp"
          alt="Attorney reviewing case materials at a desk."
          width="968"
          height="772"
          loading="eager"
          decoding="async"
        >
      </figure>
    </div>
  </section>
</template>
