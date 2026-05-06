<template>
  <section
    class="attorney-fits-practice-section"
    aria-labelledby="attorney-fits-practice-title"
  >
    <div class="attorney-fits-practice-section__inner">
      <h2
        id="attorney-fits-practice-title"
        v-appear
        class="attorney-fits-practice-section__title"
      >
        See If Solagree Fits Your Practice
      </h2>

      <div class="attorney-fits-practice-section__grid">
        <div
          v-appear="{ variant: 'scale' }"
          class="attorney-fits-practice-section__panel"
        >
          <p class="attorney-fits-practice-section__copy">
            Watch the briefing to understand the revenue model and decide if this partnership makes sense for you.
          </p>

          <SiteButton
            class="attorney-fits-practice-section__cta"
            to="/webinar/"
          >
            Watch Now
          </SiteButton>
        </div>

        <figure
          v-appear="{ delay: 100, variant: 'scale' }"
          class="attorney-fits-practice-section__media"
        >
          <img
            src="/images/attorney-see-if-fits.webp"
            alt="Attorney partner consultation workspace."
            width="1218"
            height="545"
            loading="lazy"
            decoding="async"
          >
        </figure>
      </div>
    </div>
  </section>
</template>
