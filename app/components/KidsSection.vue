<template>
  <section
    id="kids"
    class="kids-section"
    aria-labelledby="kids-title"
  >
    <div class="kids-section__inner">
      <figure
        v-appear="{ variant: 'scale' }"
        class="kids-section__media"
      >
        <img
          src="/images/kids.webp"
          alt="Parent crouching beside a child in a family home."
          width="1050"
          height="1288"
          loading="eager"
          decoding="async"
        >
      </figure>

      <div
        v-appear="{ delay: 100 }"
        class="kids-section__content"
      >
        <div class="kids-section__copy">
          <h2
            id="kids-title"
            class="kids-section__title"
          >
            What about the kids?
          </h2>

          <div class="kids-section__body">
            <p>
              Solagree handles all child-related matters - custody arrangements, parenting time schedules,
              decision-making authority, and child support. Whether you're in agreement or facing high-conflict
              custody issues, our process can include Guardian ad Litem or Parenting Coordinator support when needed.
            </p>
            <p>
              A structured approach means faster decisions and less disruption for your family. All child-related
              decisions are reviewed to ensure they meet legal standards and serve your children's best interests.
            </p>
          </div>
        </div>

        <SiteButton
          class="kids-section__cta"
          to="#quiz"
          size="sm"
        >
          Is this right for you?
        </SiteButton>
      </div>
    </div>
  </section>
</template>
