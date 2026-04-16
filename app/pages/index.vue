<script setup lang="ts">
import {
  faqItems,
  footerCallout,
  footerGroups,
  navigationLinks,
  pricingCards,
  testimonialRows,
  valueBlocks,
  workflowSteps
} from '~/data/foundation-content'
</script>

<template>
  <main class="page-shell">
    <div class="section-shell py-6 sm:py-8">
      <SurfaceCard
        as="header"
        class="surface-card--hero flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
        padding="md"
      >
        <div>
          <p class="eyebrow">
            Solagree
          </p>
          <p class="mt-2 text-sm text-[rgba(63,49,84,0.68)]">
            Global foundation preview
          </p>
        </div>

        <nav class="flex flex-wrap items-center gap-4">
          <NuxtLink
            v-for="link in navigationLinks"
            :key="link.label"
            :to="link.to"
            class="site-nav-link"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </SurfaceCard>
    </div>

    <section
      id="foundation"
      class="app-section pt-2 sm:pt-4"
    >
      <div class="section-shell">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-end">
          <div class="space-y-6">
            <p class="eyebrow">
              HIR-29 foundation pass
            </p>
            <div class="space-y-4">
              <h1 class="editorial-display max-w-4xl">
                Divorce without court. Decisions without drama.
              </h1>
              <p class="prose-copy">
                This route is intentionally lightweight: it exercises the foundation layer with a
                few representative sections, while the dedicated review surface stays scoped to
                HIR-30.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <SiteButton to="#how-it-works">
                Explore the primitives
              </SiteButton>
              <SiteButton
                to="#pricing"
                variant="secondary"
              >
                See plan cards
              </SiteButton>
            </div>
          </div>

          <SurfaceCard tone="muted">
            <div class="space-y-5">
              <div class="space-y-3">
                <p class="eyebrow">
                  What this step delivers
                </p>
                <p class="text-[1.35rem] font-extrabold leading-tight text-[var(--color-ink)]">
                  Tokens, reusable sections, buttons, cards, rows, and footer structure.
                </p>
              </div>
              <div class="grid gap-3">
                <SurfaceCard padding="md">
                  <p class="text-sm font-bold uppercase tracking-[0.18em] text-[rgba(63,49,84,0.5)]">
                    Palette
                  </p>
                  <p class="mt-2 text-sm leading-7 text-[rgba(63,49,84,0.76)]">
                    `#FFFDF9`, `#F5EEE1`, `#FEF9EF`, `#F7F3EC`, `#D1C9BF`, `#3F3154`, `#3E4059`, and
                    the approved CTA yellow `#FAFF81`.
                  </p>
                </SurfaceCard>
                <SurfaceCard
                  tone="dark"
                  padding="md"
                >
                  <p class="text-sm font-bold uppercase tracking-[0.18em] text-white/55">
                    Typography
                  </p>
                  <p class="mt-2 text-sm leading-7 text-white/74">
                    Lora, Poppins, Open Sans, and DM Sans work together across display, labels,
                    body copy, and CTA text.
                  </p>
                </SurfaceCard>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </section>

    <AppSection
      eyebrow="Foundation signals"
      title="What you get with the system"
      intro="The first reusable layer is focused on high-frequency patterns that recur across the Figma direction and upcoming static routes."
      align="center"
    >
      <div class="grid gap-5 md:grid-cols-3">
        <SurfaceCard
          v-for="block in valueBlocks"
          :key="block.title"
        >
          <ValueBlock v-bind="block" />
        </SurfaceCard>
      </div>
    </AppSection>

    <AppSection
      id="how-it-works"
      eyebrow="How it works"
      title="A reusable layout rhythm is in place"
      intro="The homepage shell now consumes the foundation directly, which keeps later routes aligned and prevents style drift."
      tone="soft"
    >
      <div class="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SurfaceCard tone="dark">
          <div class="space-y-5">
            <p class="eyebrow">
              Section shell
            </p>
            <h3 class="section-title !text-[2.1rem] !text-white">
              Light and dark surfaces can alternate without changing the page scaffolding.
            </h3>
            <p class="prose-copy !text-white/74">
              Containers, spacing, and typography are driven by shared classes instead of being
              rebuilt on each route.
            </p>
            <SiteButton
              to="#faq"
              variant="ghost"
            >
              Review assumptions
            </SiteButton>
          </div>
        </SurfaceCard>

        <SurfaceCard as="div">
          <ReviewRow
            v-for="step in workflowSteps"
            :key="step.title"
            v-bind="step"
          />
        </SurfaceCard>
      </div>
    </AppSection>

    <AppSection
      eyebrow="Testimonials"
      title="Review rows are ready for human-facing proof"
      intro="A single row primitive covers the testimonial and review-list style seen in the Solagree direction, while staying generic enough for other content feeds."
      width="narrow"
    >
      <SurfaceCard as="div">
        <ReviewRow
          v-for="row in testimonialRows"
          :key="row.title"
          v-bind="row"
        />
      </SurfaceCard>
    </AppSection>

    <AppSection
      id="pricing"
      eyebrow="Pricing"
      title="Plan cards share one source of structure"
      intro="Three card variations demonstrate the shared treatment for pricing and comparison layouts without locking the system to one page."
      tone="dark"
    >
      <div class="grid gap-5 lg:grid-cols-3">
        <PricingCard
          v-for="card in pricingCards"
          :key="card.plan"
          v-bind="card"
        />
      </div>
    </AppSection>

    <AppSection
      id="faq"
      eyebrow="Common questions"
      title="FAQ rows are defined once"
      intro="The accordion treatment is lightweight, semantic, and ready to be reused on the review page or any future informational route."
      width="narrow"
    >
      <SurfaceCard
        as="div"
        class="px-1 sm:px-3"
      >
        <FaqRow
          v-for="item in faqItems"
          :key="item.question"
          v-bind="item"
        />
      </SurfaceCard>
    </AppSection>

    <SiteFooter
      v-bind="footerCallout"
      :groups="footerGroups"
    />
  </main>
</template>
