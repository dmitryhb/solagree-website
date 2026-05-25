<template>
  <section
    class="about-process-section"
    aria-labelledby="about-process-title"
  >
    <div class="about-process-section__inner">
      <figure
        v-appear="{ variant: 'scale' }"
        class="about-process-section__media"
      >
        <img
          src="/images/about-process-around-people.png"
          alt="A smiling blonde woman wearing a light green knit turtleneck sweater sits on a brown leather couch, holding a colorful ceramic mug while looking warmly at her brown and white boxer dog."
          width="1050"
          height="1288"
          loading="lazy"
          decoding="async"
        >
      </figure>

      <div
        v-appear="{ delay: 100 }"
        class="about-process-section__content"
      >
        <h2
          id="about-process-title"
          class="about-process-section__title"
        >
          A Process Built Around People
        </h2>

        <div class="about-process-section__copy">
          <p>
            Solagree is entirely online. Separating couples work with expert professionals&mdash;financial specialists and parenting specialists&mdash;through a three-phase process: intake, mediation, and binding arbitration.
          </p>
          <p>
            Both parties are committed from the start, so resolution is guaranteed. Costs are predictable. Timelines are clear. And families can move forward with their lives.
          </p>
        </div>

        <SiteButton
          class="about-process-section__button"
          to="/#how-it-works"
        >
          Learn How It Works
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
