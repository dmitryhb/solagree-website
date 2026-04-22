<template>
  <section
    id="get-started"
    class="get-started-section"
    aria-labelledby="get-started-title"
  >
    <div
      v-appear
      class="get-started-section__inner"
    >
      <h2
        id="get-started-title"
        class="get-started-section__title"
      >
        Ready to get started?
      </h2>

      <p class="get-started-section__intro">
        Find out if Solagree fits your situation in under 2 minutes.
        <span>Get your personalized recommendation today.</span>
      </p>

      <SiteButton
        class="get-started-section__cta"
        to="#quiz"
        size="sm"
      >
        Take the Quiz
      </SiteButton>
    </div>
  </section>
</template>
