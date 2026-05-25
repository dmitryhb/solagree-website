<template>
  <section
    class="about-attorney-guidance-section"
    aria-labelledby="about-attorney-guidance-title"
  >
    <div class="about-attorney-guidance-section__inner">
      <div
        v-appear
        class="about-attorney-guidance-section__content"
      >
        <h2
          id="about-attorney-guidance-title"
          class="about-attorney-guidance-section__title"
        >
          Attorney Guidance Available
        </h2>

        <div class="about-attorney-guidance-section__copy">
          <p>
            Our network attorneys understand the Solagree process. They guide you through each phase, help you prepare for mediation, and protect your interests - while keeping the process efficient.
          </p>
          <p>
            Already have an attorney? They can work with you through Solagree too.
          </p>
        </div>
      </div>

      <figure
        v-appear="{ delay: 100, variant: 'scale' }"
        class="about-attorney-guidance-section__media"
      >
        <img
          src="/images/about-attorney-guidance.png"
          alt="A professional middle-aged man with a graying beard, glasses, and a gray tweed blazer sitting at a wooden desk, speaking directly forward while gesturing with his hands open."
          width="1012"
          height="848"
          loading="lazy"
          decoding="async"
        >
      </figure>
    </div>
  </section>
</template>
