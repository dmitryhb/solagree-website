<template>
  <section
    id="for-professionals"
    class="for-professionals-section"
    aria-labelledby="for-professionals-title"
  >
    <div class="for-professionals-section__inner">
      <header
        v-appear
        class="for-professionals-section__header"
      >
        <h2
          id="for-professionals-title"
          class="for-professionals-section__title"
        >
          Solagree for Professionals
        </h2>
        <p class="for-professionals-section__intro">
          Help couples reach resolution faster while expanding your practice. Join our network of attorneys,
          CDFAs, and counselors nationwide.
        </p>
      </header>

      <div class="for-professionals-section__content">
        <div
          v-appear="{ variant: 'scale' }"
          class="for-professionals-section__panel"
        >
          <div class="for-professionals-section__copy">
            <h3 class="for-professionals-section__panel-title">
              Scalable solutions for forward-thinking advisors
            </h3>
            <p class="for-professionals-section__description">
              Provide structured, expert-guided support while earning competitive fees on your terms.
            </p>

            <ul class="for-professionals-section__list">
              <li>Attorneys &amp; Legal Professionals</li>
              <li>CDFAs &amp; Financial Advisors</li>
              <li>Counselors &amp; Certified Coaches</li>
            </ul>
          </div>

          <SiteButton
            class="for-professionals-section__cta"
            to="/attorneys"
            size="sm"
          >
            Learn More
          </SiteButton>
        </div>

        <figure
          v-appear="{ delay: 100, variant: 'scale' }"
          class="for-professionals-section__media"
        >
          <img
            src="/images/for-professionals.webp"
            alt="Professional advisor seated at a desk."
            width="1056"
            height="1086"
            loading="eager"
            decoding="async"
          >
        </figure>
      </div>
    </div>
  </section>
</template>
