<script setup lang="ts">
interface FooterGroup {
  title: string
  links: Array<{
    label: string
    to: string
  }>
}

defineProps<{
  groups: FooterGroup[]
}>()

const linkTag = (to: string) => {
  if (to.startsWith('mailto:') || to.startsWith('tel:')) {
    return 'a'
  }

  return resolveComponent('NuxtLink')
}
</script>

<template>
  <footer class="site-footer">
    <div class="section-shell py-12 sm:py-16">
      <div class="site-footer__grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
        <div class="space-y-5">
          <p class="eyebrow !text-white/55">
            Solagree
          </p>
          <h2 class="section-title !text-[2.25rem] !text-white">
            Foundation-ready for the next page builds.
          </h2>
          <p class="prose-copy !text-white/72">
            The footer is established as a reusable structure so future static pages inherit the
            same brand rhythm, hierarchy, and action area.
          </p>
          <SiteButton
            to="/"
            variant="primary"
            size="sm"
          >
            Start your plan
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
    </div>
  </footer>
</template>
