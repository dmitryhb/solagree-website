<script setup lang="ts">
import {
  reviewButtonPanels,
  reviewChecklist,
  reviewColorTokens,
  reviewFaqPreview,
  reviewFooterCallout,
  reviewFooterGroups,
  reviewNavigation,
  reviewPricingPreview,
  reviewRowPreview,
  reviewTypeSamples,
  reviewValuePreview
} from '~/data/foundation-review'

useSeoMeta({
  title: 'Foundation Review | Solagree',
  description: 'Internal signoff surface for the Solagree foundation layer.',
  robots: 'noindex, nofollow'
})

const resolvedColors = ref<Record<string, string>>({})

const typeSampleTag = (kind: string) => {
  if (kind === 'display') {
    return 'h2'
  }

  if (kind === 'title') {
    return 'h3'
  }

  return 'p'
}

const typeSampleClass = (kind: string) => {
  if (kind === 'display') {
    return 'editorial-display !text-[2.8rem] sm:!text-[3.6rem]'
  }

  if (kind === 'title') {
    return 'section-title !text-[2rem]'
  }

  if (kind === 'copy') {
    return 'prose-copy !max-w-none'
  }

  return 'eyebrow !text-[rgba(63,49,84,0.72)]'
}

const resolveColorValue = (variable: string) => {
  return resolvedColors.value[variable] || `var(${variable})`
}

onMounted(() => {
  const styles = getComputedStyle(document.documentElement)

  resolvedColors.value = Object.fromEntries(
    reviewColorTokens.map(({ variable }) => [variable, styles.getPropertyValue(variable).trim()])
  )
})
</script>

<template>
  <main
    id="top"
    class="page-shell"
  >
    <div class="section-shell py-6 sm:py-8">
      <SurfaceCard
        as="header"
        class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"
      >
        <div class="space-y-5">
          <div class="space-y-4">
            <p class="eyebrow">
              Internal signoff surface
            </p>
            <div class="space-y-3">
              <h1 class="editorial-display max-w-4xl">
                Review the Solagree foundation before the quiz begins.
              </h1>
              <p class="prose-copy !max-w-3xl">
                This route exposes the merged typography, palette, CTA hierarchy, and shared
                primitives in one place. Every section is composed from the live foundation layer,
                so stakeholders can approve the actual system instead of reviewing screenshots or
                raw code.
              </p>
            </div>
          </div>

          <nav class="flex flex-wrap items-center gap-3">
            <NuxtLink
              v-for="link in reviewNavigation"
              :key="link.label"
              :to="link.to"
              class="site-nav-link"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <div class="flex flex-wrap gap-3">
            <SiteButton to="#buttons">
              Review CTA treatments
            </SiteButton>
            <SiteButton
              to="/"
              variant="secondary"
            >
              Back to homepage shell
            </SiteButton>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:w-[29rem]">
          <SurfaceCard
            tone="muted"
            padding="md"
          >
            <p class="eyebrow">
              Route
            </p>
            <p class="mt-2 text-lg font-extrabold leading-tight text-[var(--color-ink)]">
              /review/foundation
            </p>
            <p class="mt-2 text-sm leading-7 text-[rgba(63,49,84,0.76)]">
              Static checkpoint for internal review before feature-specific work starts.
            </p>
          </SurfaceCard>

          <SurfaceCard
            tone="dark"
            padding="md"
          >
            <p class="eyebrow !text-white/55">
              Source
            </p>
            <p class="mt-2 text-lg font-extrabold leading-tight text-white">
              HIR-29 foundation layer
            </p>
            <p class="mt-2 text-sm leading-7 text-white/74">
              Tokens and primitives shown here are the same shared layer already merged into
              <code class="font-semibold">develop</code>.
            </p>
          </SurfaceCard>
        </div>
      </SurfaceCard>
    </div>

    <AppSection
      id="signoff"
      eyebrow="Signoff gates"
      title="Approve the same foundation the product will inherit"
      intro="The checklist below uses the shared review row pattern to make approval criteria visible and concrete."
      width="narrow"
    >
      <SurfaceCard tone="dark">
        <ReviewRow
          v-for="item in reviewChecklist"
          :key="item.title"
          v-bind="item"
          dark
        />
      </SurfaceCard>
    </AppSection>

    <AppSection
      id="typography"
      eyebrow="Typography"
      title="Display, section, and interface hierarchy"
      intro="These samples use the live foundation classes and font tokens, so visual hierarchy can be reviewed without opening a design file."
      tone="soft"
    >
      <div class="grid gap-5 lg:grid-cols-2">
        <SurfaceCard
          v-for="sample in reviewTypeSamples"
          :key="sample.label"
        >
          <div class="space-y-4">
            <div class="space-y-2">
              <p class="eyebrow">
                {{ sample.token }}
              </p>
              <p class="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(63,49,84,0.54)]">
                {{ sample.label }}
              </p>
            </div>

            <component
              :is="typeSampleTag(sample.kind)"
              :class="typeSampleClass(sample.kind)"
            >
              {{ sample.preview }}
            </component>
          </div>
        </SurfaceCard>
      </div>
    </AppSection>

    <AppSection
      id="colors"
      eyebrow="Color tokens"
      title="Palette swatches are painted from the actual CSS variables"
      intro="The labels identify the variable names while the swatches themselves resolve against :root, keeping the review route tied to the real token layer."
    >
      <div class="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <SurfaceCard
            v-for="swatch in reviewColorTokens"
            :key="swatch.variable"
            padding="md"
          >
            <div
              class="h-28 rounded-[22px] border border-black/5"
              :style="{ backgroundColor: `var(${swatch.variable})` }"
            />
            <div class="mt-4 space-y-2">
              <p class="text-base font-extrabold text-[var(--color-ink)]">
                {{ swatch.name }}
              </p>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(63,49,84,0.52)]">
                {{ swatch.variable }}
              </p>
              <p class="text-sm font-semibold text-[rgba(63,49,84,0.68)]">
                {{ resolveColorValue(swatch.variable) }}
              </p>
              <p class="text-sm leading-7 text-[rgba(63,49,84,0.76)]">
                {{ swatch.usage }}
              </p>
            </div>
          </SurfaceCard>
        </div>

        <SurfaceCard tone="dark">
          <div class="space-y-5">
            <div class="space-y-3">
              <p class="eyebrow !text-white/55">
                Token notes
              </p>
              <h3 class="section-title !text-[2rem] !text-white">
                Accent stays centralized, everything else already supports structure.
              </h3>
            </div>

            <p class="prose-copy !max-w-none !text-white/74">
              The CTA accent now resolves to the exact Figma value, and there is still only one
              source of truth: <code class="font-semibold">--color-accent</code>,
              <code class="font-semibold">--color-accent-text</code>, and the related support
              tokens. Reviewers can approve the system knowing future adjustments won&apos;t require
              page-by-page edits.
            </p>

            <ValueBlock v-bind="reviewValuePreview" />
          </div>
        </SurfaceCard>
      </div>
    </AppSection>

    <AppSection
      id="buttons"
      eyebrow="CTA system"
      title="Variants and states are visible in one place"
      intro="Each sample is rendered by the shared SiteButton primitive so reviewers can validate actual CTA behavior and hierarchy."
      tone="soft"
    >
      <div class="grid gap-5 xl:grid-cols-3">
        <SurfaceCard
          v-for="panel in reviewButtonPanels"
          :key="panel.title"
          :tone="panel.tone"
        >
          <div class="space-y-5">
            <div class="space-y-3">
              <p
                class="eyebrow"
                :class="panel.tone === 'dark' && '!text-white/55'"
              >
                Button review
              </p>
              <h3
                class="section-title !text-[2rem]"
                :class="panel.tone === 'dark' && '!text-white'"
              >
                {{ panel.title }}
              </h3>
              <p
                class="prose-copy !max-w-none"
                :class="panel.tone === 'dark' && '!text-white/74'"
              >
                {{ panel.body }}
              </p>
            </div>

            <div class="grid gap-4">
              <div
                v-for="sample in panel.samples"
                :key="sample.label"
                class="space-y-3 rounded-[20px] border p-4"
                :class="panel.tone === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-[rgba(209,201,191,0.72)] bg-white/72'"
              >
                <div class="flex items-center justify-between gap-3">
                  <p
                    class="text-sm font-bold uppercase tracking-[0.16em]"
                    :class="panel.tone === 'dark' ? 'text-white/60' : 'text-[rgba(63,49,84,0.56)]'"
                  >
                    {{ sample.label }}
                  </p>
                  <span
                    v-if="sample.disabled"
                    class="rounded-full border px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em]"
                    :class="panel.tone === 'dark'
                      ? 'border-white/14 text-white/58'
                      : 'border-[rgba(62,64,89,0.12)] text-[rgba(63,49,84,0.58)]'"
                  >
                    disabled
                  </span>
                </div>

                <SiteButton
                  :variant="sample.variant"
                  :size="sample.size"
                  :block="sample.block"
                  :disabled="sample.disabled"
                >
                  {{ sample.text }}
                </SiteButton>
              </div>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </AppSection>

    <AppSection
      id="primitives"
      eyebrow="Shared primitives"
      title="Core surfaces and components are shown in context"
      intro="These previews make it easy to judge whether the shared pieces are ready to support upcoming page and quiz work."
    >
      <div class="grid gap-5 xl:grid-cols-2">
        <SurfaceCard>
          <ValueBlock v-bind="reviewValuePreview" />
        </SurfaceCard>

        <SurfaceCard tone="dark">
          <ReviewRow
            v-bind="reviewRowPreview"
            dark
          />
        </SurfaceCard>

        <PricingCard v-bind="reviewPricingPreview" />

        <SurfaceCard
          as="div"
          class="px-1 sm:px-3"
        >
          <FaqRow
            v-for="item in reviewFaqPreview"
            :key="item.question"
            v-bind="item"
          />
        </SurfaceCard>
      </div>
    </AppSection>

    <div id="footer-preview">
      <SiteFooter
        v-bind="reviewFooterCallout"
        :groups="reviewFooterGroups"
      />
    </div>
  </main>
</template>
