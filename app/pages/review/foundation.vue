<script setup lang="ts">
useSeoMeta({
  title: 'Foundation Review | Solagree',
  description: 'Internal signoff surface for the live Solagree foundation layer.',
  robots: 'noindex, nofollow'
})

const resolvedColors = ref<Record<string, string>>({})

const reviewColorTokens = [
  {
    name: 'Page',
    variable: '--color-page',
    usage: 'Main page background.'
  },
  {
    name: 'Hero base',
    variable: '--color-surface-hero',
    usage: 'Header surface on the homepage.'
  },
  {
    name: 'Warm surface',
    variable: '--color-surface-warm',
    usage: 'Secondary warm section background.'
  },
  {
    name: 'Footer warm',
    variable: '--color-surface-footer',
    usage: 'Outer footer band.'
  },
  {
    name: 'Footer inner',
    variable: '--color-surface-light',
    usage: 'Inner footer card and light panels.'
  },
  {
    name: 'Dark surface',
    variable: '--color-surface-dark',
    usage: 'Dark comparison cards and footer fill.'
  },
  {
    name: 'Accent',
    variable: '--color-accent',
    usage: 'CTA fill.'
  },
  {
    name: 'Accent text',
    variable: '--color-accent-text',
    usage: 'CTA foreground.'
  }
] as const

const reviewTypography = [
  {
    label: 'Lora',
    token: 'Display',
    preview: 'Shared foundation, exact editorial voice.'
  },
  {
    label: 'Poppins',
    token: 'Navigation / labels',
    preview: 'Foundation checkpoint'
  },
  {
    label: 'Open Sans',
    token: 'Body copy',
    preview:
      'The review surface uses the same live tokens as the homepage so the real output can be inspected without a design tool.'
  },
  {
    label: 'DM Sans',
    token: 'Utility copy',
    preview: 'Supporting text and small interface notes.'
  }
] as const

const reviewButtons = [
  { label: 'Primary CTA', text: 'Take the quiz', variant: 'primary' as const },
  { label: 'Secondary CTA', text: 'See how it works', variant: 'secondary' as const },
  { label: 'Ghost CTA', text: 'Open notes', variant: 'ghost' as const }
] as const

const reviewFooterGroups = [
  {
    title: 'Review areas',
    links: [
      { label: 'Typography', to: '#typography' },
      { label: 'Colors', to: '#colors' },
      { label: 'Buttons', to: '#buttons' }
    ]
  },
  {
    title: 'Foundation',
    links: [
      { label: 'Homepage pass', to: '/' },
      { label: 'Shared foundation', to: '#top' },
      { label: 'Project notes', to: '#summary' }
    ]
  },
  {
    title: 'Project',
    links: [
      { label: 'HIR-34', to: '#top' },
      { label: 'Develop', to: '/' },
      { label: 'Solagree', to: '/' }
    ]
  }
] as const

onMounted(() => {
  const styles = getComputedStyle(document.documentElement)

  resolvedColors.value = Object.fromEntries(
    reviewColorTokens.map(({ variable }) => [variable, styles.getPropertyValue(variable).trim()])
  )
})

const resolveColorValue = (variable: string) => {
  return resolvedColors.value[variable] || `var(${variable})`
}
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
          class="surface-card--hero flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          padding="md"
        >
          <div class="space-y-4">
            <p class="eyebrow">
              Internal signoff surface
            </p>
            <div class="space-y-3">
              <h1 class="editorial-display max-w-3xl">
                Review the live Solagree foundation before the next route expands it.
              </h1>
              <p class="prose-copy max-w-2xl">
                This page stays intentionally close to the shared foundation layer so stakeholders can
                check the actual output, not a parallel presentation model.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <SiteButton to="/">
              Back to homepage
            </SiteButton>
            <SiteButton
              to="#buttons"
              variant="secondary"
            >
              Review CTA treatments
            </SiteButton>
          </div>
        </SurfaceCard>
      </div>
    </section>

    <section
      id="summary"
      class="app-section"
    >
      <div class="section-shell grid gap-5 lg:grid-cols-3">
        <SurfaceCard>
          <p class="eyebrow">
            Live tokens
          </p>
          <p class="mt-2 text-sm leading-7 text-[rgba(63,49,84,0.76)]">
            Color, font, and surface values resolve from the same CSS variables used by the homepage.
          </p>
        </SurfaceCard>
        <SurfaceCard tone="dark">
          <p class="eyebrow !text-white/58">
            Shared buttons
          </p>
          <p class="mt-2 text-sm leading-7 text-white/78">
            CTA treatments are shown here with the same primitive that the homepage consumes.
          </p>
        </SurfaceCard>
        <SurfaceCard>
          <p class="eyebrow">
            Truthful surface
          </p>
          <p class="mt-2 text-sm leading-7 text-[rgba(63,49,84,0.76)]">
            The review route is kept lightweight so it remains a check on the live foundation rather
            than a second marketing page.
          </p>
        </SurfaceCard>
      </div>
    </section>

    <section
      id="typography"
      class="app-section app-section--soft"
    >
      <div class="section-shell space-y-8">
        <header class="section-heading section-heading--center">
          <p class="eyebrow">
            Typography
          </p>
        </header>

        <div class="grid gap-5 lg:grid-cols-2">
          <SurfaceCard
            v-for="sample in reviewTypography"
            :key="sample.label"
          >
            <div class="space-y-3">
              <p class="eyebrow">
                {{ sample.token }}
              </p>
              <p class="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(63,49,84,0.54)]">
                {{ sample.label }}
              </p>
              <p
                :class="sample.label === 'Lora'
                  ? 'font-[var(--font-display)] text-[2rem] leading-tight text-[var(--color-heading)]'
                  : sample.label === 'Poppins'
                    ? 'font-[var(--font-nav)] text-[1rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]'
                    : 'font-[var(--font-body)] text-[1rem] leading-7 text-[rgba(63,49,84,0.76)]'"
              >
                {{ sample.preview }}
              </p>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </section>

    <section
      id="colors"
      class="app-section"
    >
      <div class="section-shell space-y-8">
        <header class="section-heading section-heading--center">
          <p class="eyebrow">
            Color tokens
          </p>
        </header>

        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <SurfaceCard
            v-for="swatch in reviewColorTokens"
            :key="swatch.variable"
            padding="md"
          >
            <div
              class="h-28 rounded-[22px] border border-[rgba(62,64,89,0.08)]"
              :style="{ backgroundColor: `var(${swatch.variable})` }"
            />
            <div class="mt-4 space-y-2">
              <p class="font-[var(--font-display)] text-[1.2rem] text-[var(--color-heading)]">
                {{ swatch.name }}
              </p>
              <p class="font-[var(--font-nav)] text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(63,49,84,0.54)]">
                {{ swatch.variable }}
              </p>
              <p class="font-[var(--font-body)] text-sm text-[rgba(63,49,84,0.74)]">
                {{ resolveColorValue(swatch.variable) }}
              </p>
              <p class="font-[var(--font-body)] text-sm leading-7 text-[rgba(63,49,84,0.76)]">
                {{ swatch.usage }}
              </p>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </section>

    <section
      id="buttons"
      class="app-section app-section--soft"
    >
      <div class="section-shell space-y-8">
        <header class="section-heading section-heading--center">
          <p class="eyebrow">
            Buttons
          </p>
        </header>

        <div class="grid gap-5 lg:grid-cols-3">
          <SurfaceCard
            v-for="sample in reviewButtons"
            :key="sample.label"
          >
            <div class="space-y-4">
              <p class="eyebrow">
                {{ sample.label }}
              </p>
              <SiteButton
                to="#top"
                :variant="sample.variant"
                block
              >
                {{ sample.text }}
              </SiteButton>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </section>

    <section class="app-section">
      <div class="section-shell">
        <SurfaceCard>
          <div class="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div class="space-y-4">
              <p class="eyebrow">
                Live foundation note
              </p>
              <h2 class="section-title text-[2.3rem]">
                The review route should keep reflecting the shared source of truth.
              </h2>
              <p class="prose-copy !max-w-none">
                If the homepage foundation changes, this route should stay aligned and expose the same
                tokens, fonts, buttons, and surface decisions.
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <SurfaceCard tone="dark" padding="md">
                <p class="eyebrow !text-white/58">
                  Current check
                </p>
                <p class="mt-2 font-[var(--font-display)] text-[1.35rem] text-white">
                  HIR-34 fidelity pass
                </p>
              </SurfaceCard>
              <SurfaceCard padding="md">
                <p class="eyebrow">
                  Status
                </p>
                <p class="mt-2 font-[var(--font-display)] text-[1.35rem] text-[var(--color-heading)]">
                  Shared foundation only
                </p>
              </SurfaceCard>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </section>

    <SiteFooter
      brand="Solagree review"
      title="Foundation approved, next route can inherit it."
      description="This footer mirrors the live site structure so the review page remains a genuine check on the foundation."
      cta-label="Back to top"
      cta-to="#top"
      :groups="reviewFooterGroups"
    />
  </main>
</template>
