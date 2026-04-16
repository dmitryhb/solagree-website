<script setup lang="ts">
useSeoMeta({
  title: 'Solagree',
  description: 'Solagree homepage rebuilt from the corrected Figma foundation.'
})

const navLinks = [
  { label: 'What you get', to: '#benefits' },
  { label: 'How it works', to: '#how-it-works' },
  { label: 'Pricing', to: '#pricing' },
  { label: 'FAQ', to: '#faq' }
] as const

const benefitCards = [
  {
    title: 'Faster Resolution',
    body: 'A structured process keeps couples moving toward a binding outcome without the drag of court.'
  },
  {
    title: 'Flat-Fee Pricing',
    body: 'The pricing model stays clear up front so the conversation can stay on the decision, not the meter.'
  },
  {
    title: 'Binding Commitment',
    body: 'Decisions are designed to be final, with mediation and arbitration as part of the same path.'
  }
] as const

const phaseCards = [
  {
    title: 'Phase 1: Assessment',
    body: 'Gather the facts, constraints, and the decisions that need structure before anything escalates.'
  },
  {
    title: 'Phase 2: Mediation',
    body: 'Work through the unresolved parts with a guided process built to reduce friction.'
  },
  {
    title: 'Phase 3: Arbitration',
    body: 'Close the loop with a binding decision so the path does not drift back into conflict.'
  }
] as const

const pathCards = [
  {
    title: 'Expedited',
    body: 'Best for couples who want a tighter process and fewer moving parts.',
    features: ['Structured mediation sessions', 'Binding arbitration award', 'Clear next steps']
  },
  {
    title: 'Traditional',
    body: 'Best for more complex cases that need broader support and extra review.',
    features: ['Extended mediation and support', 'CDFA® financial expertise', 'Optional attorney representation']
  }
] as const

const quizQuestions = [
  {
    question: 'Question 1 of 8: Do you have kids under 18?',
    choices: ['Yes', 'No', 'Shared custody already']
  },
  {
    question: 'Question 2 of 8: Do you own a home together?',
    choices: ['Yes', 'No', 'Not sure yet']
  }
] as const

const pricingCards = [
  {
    eyebrow: '15-Minute Expert Consult',
    price: '$50',
    cadence: '/ one time',
    body: 'A short consult to understand your situation before you commit to a path.',
    features: [
      '15-minute call with expert',
      'Initial situation assement',
      'Flat-Fee price quote'
    ],
    cta: 'Book a Consultation',
    footnote: 'Get clarity about your options',
    featured: false
  },
  {
    eyebrow: 'Solagree EXPEDITED',
    badge: 'Best value',
    price: '$5,400',
    cadence: '/ PER couple',
    body: 'For couples who want a tighter process and a faster path to resolution.',
    features: [
      'CDFA® financial analysis',
      'Structured mediation sessions',
      'Binding arbitration award'
    ],
    cta: 'Get started with Expedited',
    footnote: 'Best for couples that mostly agree',
    featured: true
  },
  {
    eyebrow: 'Solagree Traditional',
    badge: 'For Complex Cases',
    price: '$11,500',
    cadence: '/ PER Couple',
    body: 'For cases that need deeper support, more review, and broader professional involvement.',
    features: [
      'Extended mediation & support',
      'CDFA® financial expertise',
      'Optional attorney representation'
    ],
    cta: 'Get started with Traditional',
    footnote: 'Best for complex finances, custody or business owners',
    featured: false
  }
] as const

const faqItems = [
  {
    question: 'What does binding arbitration mean?',
    answer:
      'It means a neutral third party makes the final decision, and both sides agree to follow it.'
  },
  {
    question: 'Do we need attorneys?',
    answer:
      'Not always. The Traditional path supports attorney involvement, while the expedited path is designed to move with less overhead.'
  },
  {
    question: 'What if we disagree on the kids?',
    answer:
      'The process is designed to surface custody and support decisions early so they can be handled inside the same structure.'
  },
  {
    question: 'How fast does it move?',
    answer:
      'The expedited path is built for speed, while the traditional path allows more room for complex cases and review.'
  },
  {
    question: 'Is the pricing fixed?',
    answer:
      'Yes. The pricing model is shown as flat-fee rather than open-ended hourly billing.'
  }
] as const

const professionalBullets = [
  'Attorneys & Legal Professionals',
  'CDFAs & Financial Advisors',
  'Counselors & Certified Coaches'
] as const

const footerGroups = [
  {
    title: 'FOR COUPLES',
    links: [
      { label: 'How It Works', to: '#how-it-works' },
      { label: 'Quiz: Will it Work for us?', to: '#quiz' },
      { label: 'Solagree vs Traditional', to: '#paths' },
      { label: 'Pricing', to: '#pricing' },
      { label: 'FAQs', to: '#faq' }
    ]
  },
  {
    title: 'FOR PROFESSIONALS',
    links: [
      { label: 'Attorneys', to: '#professionals' },
      { label: 'Financial Advisors', to: '#professionals' },
      { label: 'Counselors', to: '#professionals' },
      { label: 'Employers/EAP', to: '#professionals' },
      { label: 'Join the Network', to: '#professionals' }
    ]
  },
  {
    title: 'COMPANY',
    links: [
      { label: 'About Us', to: '#top' },
      { label: 'FAQ', to: '#faq' },
      { label: 'Contact Us', to: 'mailto:hello@solagree.test' },
      { label: 'Learn', to: '#how-it-works' },
      { label: 'Account Login', to: '#top' }
    ]
  }
] as const
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
            <div class="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(62,64,89,0.15)] bg-[rgba(255,255,255,0.25)] font-[var(--font-nav)] text-sm font-semibold tracking-[0.18em] text-[var(--color-ink)]">
              S
            </div>
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
                v-for="link in navLinks"
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

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center">
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

          <SurfaceCard
            tone="muted"
            class="overflow-hidden"
          >
            <div class="relative min-h-[25rem] overflow-hidden rounded-[24px] border border-[rgba(62,64,89,0.08)] bg-[linear-gradient(180deg,rgba(245,238,225,0.92)_0%,rgba(249,246,239,0.86)_42%,rgba(209,201,191,0.55)_100%)] p-6">
              <div class="absolute inset-x-6 top-6 flex items-center justify-between">
                <p class="rounded-full bg-[var(--color-accent)] px-3 py-1 font-[var(--font-nav)] text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-text)]">
                  Calm process
                </p>
                <p class="font-[var(--font-nav)] text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(62,64,89,0.62)]">
                  Binding outcome
                </p>
              </div>

              <div class="absolute inset-x-0 bottom-0 top-0 flex items-end justify-center">
                <div class="relative h-[18rem] w-[12rem]">
                  <div class="absolute bottom-0 left-1/2 h-[14rem] w-[1.25rem] -translate-x-1/2 rounded-t-full bg-[rgba(62,64,89,0.72)]" />
                  <div class="absolute bottom-[1.9rem] left-1/2 h-[11rem] w-[5rem] -translate-x-1/2 rounded-[999px_999px_22px_22px] bg-[rgba(255,255,255,0.52)] shadow-[0_18px_40px_rgba(62,64,89,0.12)]" />
                  <div class="absolute bottom-[6.6rem] left-1/2 h-[4rem] w-[4rem] -translate-x-1/2 rounded-full bg-[rgba(62,64,89,0.46)] blur-[1px]" />
                </div>
              </div>

              <div class="absolute bottom-6 left-6 right-6 grid gap-3">
                <div class="flex items-center justify-between rounded-[22px] border border-[rgba(62,64,89,0.08)] bg-[rgba(255,255,255,0.74)] px-4 py-3">
                  <div>
                    <p class="font-[var(--font-nav)] text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(62,64,89,0.5)]">
                      Guided path
                    </p>
                    <p class="mt-1 font-[var(--font-display)] text-[1.35rem] leading-none text-[var(--color-heading)]">
                      Three phases
                    </p>
                  </div>
                  <div class="h-12 w-12 rounded-full border border-[rgba(62,64,89,0.08)] bg-[var(--color-accent)]" />
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
            v-for="card in benefitCards"
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
              v-for="card in phaseCards"
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
          <div class="relative min-h-[22rem] overflow-hidden rounded-[22px] border border-[rgba(62,64,89,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(245,238,225,0.92)_45%,rgba(209,201,191,0.78)_100%)]">
            <div class="absolute inset-x-6 top-6 flex justify-between">
              <p class="rounded-full bg-[var(--color-accent)] px-3 py-1 font-[var(--font-nav)] text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-text)]">
                What about the kids?
              </p>
              <p class="font-[var(--font-nav)] text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(62,64,89,0.6)]">
                Trust and custody
              </p>
            </div>

            <div class="absolute inset-0 flex items-end justify-center p-6">
              <div class="h-[16rem] w-[12rem] rounded-[24px] border border-[rgba(62,64,89,0.08)] bg-[linear-gradient(180deg,rgba(62,64,89,0.18)_0%,rgba(255,255,255,0.8)_100%)] shadow-[0_22px_44px_rgba(62,64,89,0.12)]" />
            </div>
          </div>
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
            v-for="card in pathCards"
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

    <section
      id="quiz"
      class="app-section app-section--soft"
    >
      <div class="section-shell space-y-8">
        <header class="section-heading section-heading--center">
          <h2 class="section-title text-[2.35rem]">
            Find the right Solagree divorce plan in minutes.
          </h2>
          <p class="section-intro">
            Answer a few questions and we’ll suggest a plan to fit your unique needs.
          </p>
        </header>

        <SurfaceCard class="mx-auto max-w-4xl">
          <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <p class="eyebrow">
                Quiz preview
              </p>
              <p class="font-[var(--font-nav)] text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(63,49,84,0.55)]">
                Question 1 of 8
              </p>
            </div>

            <div class="space-y-4 rounded-[24px] border border-[rgba(62,64,89,0.08)] bg-[rgba(255,255,255,0.78)] p-5">
              <p class="font-[var(--font-display)] text-[1.8rem] leading-tight text-[var(--color-heading)]">
                Do you have kids under 18?
              </p>

              <div class="grid gap-3 sm:grid-cols-3">
                <button
                  v-for="choice in quizQuestions[0].choices"
                  :key="choice"
                  type="button"
                  class="rounded-full border border-[rgba(62,64,89,0.14)] bg-[var(--color-surface-light)] px-4 py-3 font-[var(--font-nav)] text-sm font-semibold text-[var(--color-ink)]"
                >
                  {{ choice }}
                </button>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <SurfaceCard
                v-for="question in quizQuestions.slice(1)"
                :key="question.question"
                padding="md"
              >
                <p class="font-[var(--font-display)] text-xl leading-tight text-[var(--color-heading)]">
                  {{ question.question }}
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="choice in question.choices"
                    :key="choice"
                    class="rounded-full border border-[rgba(62,64,89,0.14)] bg-[rgba(255,255,255,0.7)] px-3 py-2 font-[var(--font-nav)] text-xs font-semibold text-[var(--color-ink)]"
                  >
                    {{ choice }}
                  </span>
                </div>
              </SurfaceCard>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </section>

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
            v-for="card in pricingCards"
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
              v-for="(item, index) in faqItems"
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
              v-for="bullet in professionalBullets"
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
          <div class="relative min-h-[24rem] overflow-hidden rounded-[24px] border border-[rgba(62,64,89,0.08)] bg-[linear-gradient(180deg,rgba(245,238,225,0.8)_0%,rgba(255,255,255,0.8)_38%,rgba(62,64,89,0.18)_100%)]">
            <div class="absolute inset-x-6 top-6 flex items-center justify-between">
              <p class="rounded-full bg-[var(--color-accent)] px-3 py-1 font-[var(--font-nav)] text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-text)]">
                Network
              </p>
              <p class="font-[var(--font-nav)] text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(62,64,89,0.58)]">
                Professionals
              </p>
            </div>

            <div class="absolute inset-0 flex items-center justify-center">
              <div class="h-[18rem] w-[12rem] rounded-[28px] border border-[rgba(62,64,89,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(245,238,225,0.7)_100%)] shadow-[0_22px_44px_rgba(62,64,89,0.14)]" />
            </div>
          </div>
        </SurfaceCard>
      </div>
    </section>

    <SiteFooter
      brand="Solagree"
      title="Reduce conflict and cost through binding mediation and arbitration."
      description="The footer keeps the shared structure visible at the end of the page so the live foundation remains consistent all the way through."
      cta-label="Is Solagree right for you?"
      cta-to="#quiz"
      :groups="footerGroups"
    />
  </main>
</template>
