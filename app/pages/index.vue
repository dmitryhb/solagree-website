<script setup lang="ts">
import {
  homepageAssets,
  homepageBenefitCards,
  homepageFaqItems,
  homepageFooterGroups,
  homepageNavLinks,
  homepagePathCards,
  homepagePhaseCards,
  homepagePricingCards,
  homepageProfessionalBullets
} from '~/data/homepage'

useSeoMeta({
  title: 'Solagree',
  description: 'Solagree homepage rebuilt from the corrected Figma foundation.'
})
</script>

<template>
  <main
    id="top"
    class="page-shell"
  >
    <section class="app-section pt-6 sm:pt-8">
      <div class="section-shell space-y-6">
        <SurfaceCard
          as="header"
          class="surface-card--hero flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
          padding="md"
        >
          <div class="flex items-center gap-4">
            <div>
              <p class="eyebrow">
                Solagree
              </p>
              <p class="mt-1 text-sm text-[rgba(63,49,84,0.68)]">
                Divorce without court. Decisions without drama.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-4">
            <nav class="flex flex-wrap items-center gap-4">
              <NuxtLink
                v-for="link in homepageNavLinks"
                :key="link.label"
                :to="link.to"
                class="site-nav-link"
              >
                {{ link.label }}
              </NuxtLink>
            </nav>

            <SiteButton to="#quiz">
              Take the quiz
            </SiteButton>
          </div>
        </SurfaceCard>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
          <div class="space-y-6">
            <p class="eyebrow">
              Solagree
            </p>
            <div class="space-y-4">
              <h1 class="editorial-display max-w-3xl">
                Divorce without court. Decisions without drama.
              </h1>
              <p class="prose-copy max-w-2xl">
                A structured path for couples who want a binding resolution with less conflict, less
                delay, and a clearer set of next steps.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <SiteButton to="#quiz">
                Take the quiz
              </SiteButton>
              <SiteButton
                to="#how-it-works"
                variant="secondary"
              >
                See how it works
              </SiteButton>
            </div>
          </div>

          <SurfaceCard tone="muted">
            <div class="space-y-4">
              <img
                :src="homepageAssets.hero"
                alt=""
                class="block w-full rounded-[22px] object-cover"
                fetchpriority="high"
                decoding="async"
              />
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-[22px] border border-[rgba(62,64,89,0.08)] bg-[rgba(255,255,255,0.76)] px-4 py-3">
                  <p class="font-[var(--font-nav)] text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(62,64,89,0.52)]">
                    Guided path
                  </p>
                  <p class="mt-1 font-[var(--font-display)] text-[1.35rem] leading-none text-[var(--color-heading)]">
                    Three phases
                  </p>
                </div>
                <div class="rounded-[22px] border border-[rgba(62,64,89,0.08)] bg-[rgba(62,64,89,0.92)] px-4 py-3 text-white">
                  <p class="font-[var(--font-nav)] text-xs font-semibold uppercase tracking-[0.14em] text-white/62">
                    Designed for clarity
                  </p>
                  <p class="mt-1 font-[var(--font-body)] text-sm leading-6 text-white/82">
                    The path stays measured, quiet, and final.
                  </p>
                </div>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </section>

    <section
      id="benefits"
      class="app-section"
    >
      <div class="section-shell space-y-10">
        <header class="section-heading section-heading--center">
          <p class="eyebrow">
            What you get with Solagree
          </p>
        </header>

        <div class="grid gap-5 md:grid-cols-3">
          <SurfaceCard
            v-for="card in homepageBenefitCards"
            :key="card.title"
          >
            <div class="space-y-3">
              <h2 class="section-title text-[2rem]">
                {{ card.title }}
              </h2>
              <p class="prose-copy !max-w-none">
                {{ card.body }}
              </p>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </section>

    <section
      id="how-it-works"
      class="app-section"
    >
      <div class="section-shell grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div class="space-y-6">
          <p class="eyebrow">
            How it works
          </p>
          <div class="space-y-4">
            <h2 class="editorial-display max-w-xl">
              Three phases. One resolution. A structured process designed for couples who can't agree on everything.
            </h2>
            <p class="prose-copy max-w-xl">
              The route stays calm and deliberate from assessment through arbitration, with clear steps
              instead of open-ended back-and-forth.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <SiteButton to="#quiz">
              Is Solagree Right for You?
            </SiteButton>
            <SiteButton
              to="#pricing"
              variant="secondary"
            >
              Take the Quiz
            </SiteButton>
          </div>
        </div>

        <div class="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div class="space-y-4">
            <SurfaceCard tone="dark">
              <div class="space-y-4">
                <p class="eyebrow !text-white/58">
                  Phase overview
                </p>
                <h3 class="section-title !text-[2rem] !text-white">
                  A calmer path through the decisions that matter.
                </h3>
                <p class="prose-copy !max-w-none !text-white/78">
                  Each phase narrows the conversation until the remaining work is ready for a binding
                  outcome.
                </p>
              </div>
            </SurfaceCard>

            <SurfaceCard>
              <div class="space-y-4">
                <p class="eyebrow">
                  Watch the process
                </p>
                <div class="relative aspect-[16/10] overflow-hidden rounded-[22px] border border-[rgba(62,64,89,0.08)] bg-[linear-gradient(180deg,rgba(245,238,225,0.92)_0%,rgba(209,201,191,0.62)_100%)]">
                  <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_42%),linear-gradient(180deg,rgba(245,238,225,0.18)_0%,rgba(62,64,89,0.08)_100%)]" />
                  <div class="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      class="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(62,64,89,0.12)] bg-[rgba(255,255,255,0.82)] text-[var(--color-ink)] shadow-[0_18px_44px_rgba(62,64,89,0.16)]"
                      aria-label="Play video preview"
                    >
                      <span class="ml-1 text-xl leading-none">▶</span>
                    </button>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          </div>

          <div class="grid gap-4">
            <SurfaceCard
              v-for="card in homepagePhaseCards"
              :key="card.title"
            >
              <div class="space-y-3">
                <p class="eyebrow">
                  {{ card.title }}
                </p>
                <p class="prose-copy !max-w-none">
                  {{ card.body }}
                </p>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </section>

    <section
      id="kids"
      class="app-section"
    >
      <div class="section-shell grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <SurfaceCard tone="muted">
          <img
            :src="homepageAssets.kids"
            alt=""
            class="block w-full rounded-[22px] object-cover"
            loading="lazy"
            decoding="async"
          />
        </SurfaceCard>

        <div class="space-y-6">
          <p class="eyebrow">
            Trust / kids band
          </p>
          <div class="space-y-4">
            <h2 class="editorial-display max-w-xl">
              What about the kids?
            </h2>
            <p class="prose-copy max-w-xl">
              The structure keeps the discussion around custody, schedules, and support inside the same
              calm process instead of forcing families into a separate fight.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <SurfaceCard>
              <p class="eyebrow">
                Custody
              </p>
              <p class="mt-2 prose-copy !max-w-none">
                Decisions stay visible and organized while the process keeps moving.
              </p>
            </SurfaceCard>
            <SurfaceCard>
              <p class="eyebrow">
                Parenting plan
              </p>
              <p class="mt-2 prose-copy !max-w-none">
                The path keeps the schedule and support questions in context.
              </p>
            </SurfaceCard>
          </div>

          <SiteButton to="#paths">
            Explore the path
          </SiteButton>
        </div>
      </div>
    </section>

    <section
      id="paths"
      class="app-section app-section--dark"
    >
      <div class="section-shell space-y-10">
        <header class="section-heading section-heading--center">
          <p class="eyebrow !text-white/72">
            Choose the path that fits your situation
          </p>
          <h2 class="section-title text-[2.6rem] !text-white">
            Both follow the same proven 3-phase process. The difference is the level of support and whether attorneys are involved.
          </h2>
        </header>

        <div class="grid gap-5 lg:grid-cols-2">
          <SurfaceCard
            v-for="card in homepagePathCards"
            :key="card.title"
            tone="muted"
          >
            <div class="space-y-5">
              <div class="space-y-3">
                <p class="eyebrow">
                  {{ card.title }}
                </p>
                <p class="prose-copy !max-w-none">
                  {{ card.body }}
                </p>
              </div>

              <div class="grid gap-3">
                <div
                  v-for="feature in card.features"
                  :key="feature"
                  class="flex items-start gap-3 rounded-[18px] border border-[rgba(62,64,89,0.08)] bg-[rgba(255,255,255,0.66)] px-4 py-3"
                >
                  <span class="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
                  <p class="font-[var(--font-body)] text-sm leading-6 text-[var(--color-ink)]">
                    {{ feature }}
                  </p>
                </div>
              </div>

              <SiteButton
                to="#pricing"
                block
              >
                Get Started
              </SiteButton>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </section>

    <QuizSection
      id="quiz"
    />

    <section
      id="pricing"
      class="app-section"
    >
      <div class="section-shell space-y-10">
        <header class="section-heading section-heading--center">
          <p class="eyebrow">
            Transparent flat-fee pricing
          </p>
          <p class="section-intro">
            Pick the level of support that fits your situation.
          </p>
        </header>

        <div class="grid gap-5 lg:grid-cols-3">
          <SurfaceCard
            v-for="card in homepagePricingCards"
            :key="card.eyebrow"
            :tone="card.featured ? 'dark' : 'light'"
            class="h-full"
          >
            <div class="flex h-full flex-col gap-5">
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-3">
                  <p class="eyebrow">
                    {{ card.eyebrow }}
                  </p>
                  <span
                    v-if="card.badge"
                    class="rounded-full border border-[rgba(62,64,89,0.12)] bg-[var(--color-accent)] px-3 py-1 font-[var(--font-nav)] text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent-text)]"
                  >
                    {{ card.badge }}
                  </span>
                </div>

                <div class="flex items-baseline gap-2">
                  <p class="font-[var(--font-display)] text-[2.9rem] leading-none">
                    {{ card.price }}
                  </p>
                  <p class="font-[var(--font-body)] text-sm text-[rgba(63,49,84,0.62)]">
                    {{ card.cadence }}
                  </p>
                </div>

                <p class="prose-copy !max-w-none">
                  {{ card.body }}
                </p>
              </div>

              <div class="grid gap-3">
                <div
                  v-for="feature in card.features"
                  :key="feature"
                  class="flex items-start gap-3 rounded-[18px] border border-[rgba(62,64,89,0.08)] bg-[rgba(255,255,255,0.72)] px-4 py-3"
                >
                  <span class="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
                  <p class="font-[var(--font-body)] text-sm leading-6 text-[var(--color-ink)]">
                    {{ feature }}
                  </p>
                </div>
              </div>

              <div class="mt-auto space-y-3">
                <SiteButton
                  to="#faq"
                  block
                >
                  {{ card.cta }}
                </SiteButton>
                <p class="font-[var(--font-body)] text-sm leading-6 text-[rgba(63,49,84,0.66)]">
                  {{ card.footnote }}
                </p>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </section>

    <section
      id="faq"
      class="app-section app-section--soft"
    >
      <div class="section-shell space-y-10">
        <header class="section-heading section-heading--center">
          <p class="eyebrow">
            Common Questions
          </p>
        </header>

        <SurfaceCard class="mx-auto max-w-4xl">
          <div class="divide-y divide-[rgba(62,64,89,0.12)]">
            <details
              v-for="(item, index) in homepageFaqItems"
              :key="item.question"
              :open="index === 0"
              class="group py-5"
            >
              <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-[var(--font-nav)] text-[1rem] font-semibold text-[var(--color-ink)]">
                <span>{{ item.question }}</span>
                <span class="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(62,64,89,0.12)] bg-[rgba(255,255,255,0.84)] text-lg leading-none">
                  +
                </span>
              </summary>
              <p class="mt-4 max-w-3xl font-[var(--font-body)] text-sm leading-7 text-[rgba(63,49,84,0.76)]">
                {{ item.answer }}
              </p>
            </details>
          </div>
        </SurfaceCard>
      </div>
    </section>

    <section
      id="professionals"
      class="app-section"
    >
      <div class="section-shell grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <div class="space-y-6">
          <p class="eyebrow">
            Solagree for Professionals
          </p>
          <div class="space-y-4">
            <h2 class="editorial-display max-w-xl">
              Help couples reach resolution faster while expanding your practice. Join our network of attorneys, CDFAs, and counselors nationwide.
            </h2>
            <p class="prose-copy max-w-xl">
              Scalable solutions for forward-thinking advisors
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <SurfaceCard
              v-for="bullet in homepageProfessionalBullets"
              :key="bullet"
              padding="md"
            >
              <p class="font-[var(--font-display)] text-[1.25rem] leading-tight text-[var(--color-heading)]">
                {{ bullet }}
              </p>
            </SurfaceCard>
          </div>

          <SiteButton to="#top">
            Learn More
          </SiteButton>
        </div>

        <SurfaceCard>
          <img
            :src="homepageAssets.professionals"
            alt=""
            class="block w-full rounded-[24px] object-cover"
            loading="lazy"
            decoding="async"
          />
        </SurfaceCard>
      </div>
    </section>

    <SiteFooter
      brand="Solagree"
      title="Reduce conflict and cost through binding mediation and arbitration."
      description="The footer keeps the shared structure visible at the end of the page so the live foundation remains consistent all the way through."
      cta-label="Is Solagree right for you?"
      cta-to="#quiz"
      :groups="homepageFooterGroups"
    />
  </main>
</template>
