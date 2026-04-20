<script setup lang="ts">
import { solagreeSocialLinks } from '~/data/social-links'
import type { SocialLinkIcon } from '~/data/social-links'

interface FooterLink {
  label: string
  to?: string
  href?: string
  ariaLabel?: string
}

interface FooterGroup {
  title: string
  links: readonly FooterLink[]
}

interface FooterSocialLink extends FooterLink {
  icon: SocialLinkIcon
}

const defaultFooterGroups = [
  {
    title: 'For couples',
    links: [
      { label: 'How It Works', to: '/' },
      { label: 'Quiz: Will it Work for us?', to: '/quiz' },
      { label: 'Solagree vs Traditional', to: '/' },
      { label: 'Pricing', to: '/' },
      { label: 'FAQs', to: '/' }
    ]
  },
  {
    title: 'For professionals',
    links: [
      { label: 'Attorneys', to: '/' },
      { label: 'Financial Advisors', to: '/' },
      { label: 'Counselors', to: '/' },
      { label: 'Employers/EAP', to: '/' },
      { label: 'Join the Network', to: '/' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/' },
      { label: 'FAQ', to: '/' },
      { label: 'Contact Us', to: '/' },
      { label: 'Learn', to: '/' },
      { label: 'Account Login', to: '/' }
    ]
  }
] as const satisfies readonly FooterGroup[]

const defaultLegalLinks = [
  { label: 'Terms of Service', to: '/' },
  { label: 'Privacy Policy', to: '/' },
  { label: 'Accessibility', to: '/' }
] as const satisfies readonly FooterLink[]

const props = withDefaults(defineProps<{
  brand?: string
  logoTo?: string
  tagline?: string
  title?: string
  description?: string
  ctaLabel?: string
  ctaTo?: string
  ctaHref?: string
  groups?: readonly FooterGroup[]
  socialLinks?: readonly FooterSocialLink[]
  legalLinks?: readonly FooterLink[]
  copyright?: string
  disclaimer?: string
}>(), {
  brand: 'Solagree',
  logoTo: '/',
  tagline:
    'A next-generation divorce platform designed to reduce conflict and cost through binding mediation and arbitration.',
  ctaLabel: 'Is Solagree right for you?',
  ctaTo: '/quiz',
  copyright: '© 2026 Solagree, LLC. All Rights Reserved.',
  disclaimer:
    'Solagree® is not a law firm and does not provide legal advice. We connect clients with independent professionals.'
})

const resolvedTagline = computed(() => {
  return props.description ?? props.title ?? props.tagline
})

const resolvedGroups = computed(() => {
  return props.groups ?? defaultFooterGroups
})

const resolvedSocialLinks = computed(() => {
  return props.socialLinks ?? solagreeSocialLinks
})

const resolvedLegalLinks = computed(() => {
  return props.legalLinks ?? defaultLegalLinks
})

const socialIconPaths = {
  facebook: [
    'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.24 0-1.63.77-1.63 1.56v1.91h2.77l-.44 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z'
  ],
  instagram: [
    'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Z',
    'M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-2.38a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26Z'
  ],
  linkedin: [
    'M6.94 8.98H3.75V20h3.19V8.98ZM5.35 4A1.85 1.85 0 1 0 5.3 7.7h.03A1.85 1.85 0 1 0 5.35 4Zm14.9 9.68c0-3.38-1.8-4.95-4.2-4.95a3.62 3.62 0 0 0-3.28 1.8V8.98H9.58c.04 1.03 0 11.02 0 11.02h3.19v-6.16c0-.33.02-.66.12-.9.26-.66.86-1.34 1.86-1.34 1.31 0 1.84 1 1.84 2.47V20h3.19l.47-6.32Z'
  ]
} as const

function getLinkTarget(link: FooterLink) {
  return link.href ?? link.to ?? '/'
}

function isExternalHref(target: string) {
  return /^https?:\/\//.test(target)
}

function linkTag(link: FooterLink) {
  const target = getLinkTarget(link)

  if (link.href || target.startsWith('mailto:') || target.startsWith('tel:') || isExternalHref(target)) {
    return 'a'
  }

  return resolveComponent('NuxtLink')
}

function linkProps(link: FooterLink) {
  const target = getLinkTarget(link)

  if (link.href || target.startsWith('mailto:') || target.startsWith('tel:') || isExternalHref(target)) {
    return {
      href: target,
      target: isExternalHref(target) ? '_blank' : undefined,
      rel: isExternalHref(target) ? 'noreferrer' : undefined,
      'aria-label': link.ariaLabel
    }
  }

  return {
    to: target,
    'aria-label': link.ariaLabel
  }
}
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__top">
        <div class="site-footer__brand">
          <NuxtLink
            :to="logoTo"
            class="site-footer__logo-link"
            :aria-label="`${brand} home`"
          >
            <span
              class="site-footer__logo"
              aria-hidden="true"
            />
          </NuxtLink>

          <p class="site-footer__tagline">
            {{ resolvedTagline }}
          </p>

          <SiteButton
            v-if="ctaLabel"
            class="site-footer__cta"
            :to="ctaHref ? undefined : ctaTo"
            :href="ctaHref"
            variant="primary"
            size="sm"
          >
            {{ ctaLabel }}
          </SiteButton>
        </div>

        <nav
          class="site-footer__nav"
          aria-label="Footer navigation"
        >
          <div
            v-for="group in resolvedGroups"
            :key="group.title"
            class="site-footer__column"
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
                  :is="linkTag(link)"
                  v-bind="linkProps(link)"
                >
                  {{ link.label }}
                </component>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="site-footer__bottom">
        <div class="site-footer__legal-group">
          <ul
            v-if="resolvedSocialLinks.length"
            class="site-footer__social-links"
            aria-label="Social links"
          >
            <li
              v-for="link in resolvedSocialLinks"
              :key="link.label"
            >
              <component
                :is="linkTag(link)"
                class="site-footer__social-link"
                v-bind="linkProps(link)"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    v-for="path in socialIconPaths[link.icon]"
                    :key="path"
                    :d="path"
                    fill="currentColor"
                  />
                </svg>
              </component>
            </li>
          </ul>

          <ul class="site-footer__legal-links">
            <li
              v-for="link in resolvedLegalLinks"
              :key="link.label"
            >
              <component
                :is="linkTag(link)"
                v-bind="linkProps(link)"
              >
                {{ link.label }}
              </component>
            </li>
          </ul>

          <p class="site-footer__copyright">
            {{ copyright }}
          </p>
        </div>

        <p class="site-footer__disclaimer">
          {{ disclaimer }}
        </p>
      </div>
    </div>
  </footer>
</template>
