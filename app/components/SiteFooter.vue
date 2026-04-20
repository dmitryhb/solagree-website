<script setup lang="ts">
interface FooterGroup {
  title: string
  links: readonly {
    label: string
    to: string
  }[]
}

withDefaults(defineProps<{
  brand?: string
  title?: string
  description?: string
  ctaLabel?: string
  ctaTo?: string
  groups: readonly FooterGroup[]
}>(), {
  brand: 'Solagree',
  title: 'Foundation-ready for the next page builds.',
  description:
    'The footer is established as a reusable structure so future static pages inherit the same brand rhythm, hierarchy, and action area.',
  ctaLabel: 'Start your plan',
  ctaTo: '/'
})

const linkTag = (to: string) => {
  if (to.startsWith('mailto:') || to.startsWith('tel:')) {
    return 'a'
  }

  return resolveComponent('NuxtLink')
}
</script>

<template>
  <footer class="site-footer">
    <div class="section-shell">
      <SurfaceCard
        class="site-footer__panel"
        padding="lg"
      >
        <div class="site-footer__grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
          <div class="space-y-5">
            <p class="eyebrow">
              {{ brand }}
            </p>
            <h2 class="section-title !text-[2.25rem]">
              {{ title }}
            </h2>
            <p class="prose-copy">
              {{ description }}
            </p>
            <SiteButton
              v-if="ctaLabel"
              :to="ctaTo"
              variant="primary"
              size="sm"
            >
              {{ ctaLabel }}
            </SiteButton>
          </div>

          <div class="grid gap-8 md:grid-cols-3">
            <div
              v-for="group in groups"
              :key="group.title"
            >
              <p class="site-footer__column-title">
                {{ group.title }}
              </p>
              <ul class="site-footer__links">
                <li
                  v-for="link in group.links"
                  :key="link.label"
                >
                  <component
                    :is="linkTag(link.to)"
                    v-bind="link.to.startsWith('mailto:') || link.to.startsWith('tel:')
                      ? { href: link.to }
                      : { to: link.to }"
                  >
                    {{ link.label }}
                  </component>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="site-footer__bottom">
          <p class="site-footer__legal">
            Terms of Service | Privacy Policy | Accessibility
          </p>
          <p class="site-footer__copyright">
            © 2026 Solagree, LLC. All Rights Reserved.
          </p>
        </div>
      </SurfaceCard>
    </div>
  </footer>
</template>
