<template>
  <section
    class="attorney-more-cases-section"
    aria-labelledby="attorney-more-cases-title"
  >
    <div class="attorney-more-cases-section__inner">
      <div
        v-appear
        class="attorney-more-cases-section__copy"
      >
        <h2
          id="attorney-more-cases-title"
          class="attorney-more-cases-section__title"
        >
          Handle More Cases - Without More Staff
        </h2>

        <p class="attorney-more-cases-section__body">
          Use our trained case coordinators and paralegals to handle document collection and logistics while you focus
          on strategic legal work. No hiring. No training.
        </p>

        <p class="attorney-more-cases-section__link-copy">
          Learn more in&nbsp;<NuxtLink
            class="attorney-more-cases-section__link"
            to="/webinar/"
          >the briefing</NuxtLink>.
        </p>
      </div>

      <figure
        v-appear="{ delay: 100, variant: 'scale' }"
        class="attorney-more-cases-section__media"
      >
        <img
          src="/images/kids.webp"
          alt="Parent crouching beside a child in a family home."
          width="1050"
          height="1288"
          loading="lazy"
          decoding="async"
        >
      </figure>
    </div>
  </section>
</template>
