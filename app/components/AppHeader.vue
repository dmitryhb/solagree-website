<script setup lang="ts">
import { headerLoginLink, headerPrimaryLinks, headerQuizLink } from '~/data/header-navigation'

const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value)
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const isResettingHomeScroll = ref(false)
const isHomeRoute = computed(() => currentRoute.value.path === '/')
const isSolidHeader = computed(() => !isHomeRoute.value)
const menuToggleLabel = computed(() => (isMobileMenuOpen.value ? 'Close navigation menu' : 'Open navigation menu'))
const portalLoginHref = usePortalLoginHref()
const scrollUpdateTimers: number[] = []

const clearScrollUpdateTimers = () => {
  while (scrollUpdateTimers.length) {
    const timer = scrollUpdateTimers.pop()

    if (timer !== undefined) {
      window.clearTimeout(timer)
    }
  }
}

const updateScrolledState = () => {
  if (!isHomeRoute.value || (isResettingHomeScroll.value && !currentRoute.value.hash)) {
    isScrolled.value = false
    return
  }

  isScrolled.value = window.scrollY > 8
}

/**
 * Nuxt restores scroll after route state changes, so home navigation needs an
 * immediate top reset plus delayed reads to avoid carrying the internal header.
 */
const scheduleScrolledStateUpdate = async () => {
  if (!import.meta.client) {
    return
  }

  clearScrollUpdateTimers()

  if (isHomeRoute.value && !currentRoute.value.hash) {
    isResettingHomeScroll.value = true
    isScrolled.value = false
    window.scrollTo({ left: 0, top: 0, behavior: 'auto' })
  } else {
    isResettingHomeScroll.value = false
  }

  await nextTick()

  const refreshScrolledState = () => {
    if (isHomeRoute.value && !currentRoute.value.hash && window.scrollY > 0) {
      window.scrollTo({ left: 0, top: 0, behavior: 'auto' })
    }

    updateScrolledState()

    if (isHomeRoute.value && !currentRoute.value.hash && window.scrollY <= 8) {
      isResettingHomeScroll.value = false
      updateScrolledState()
    }
  }

  window.requestAnimationFrame(() => {
    refreshScrolledState()
    window.requestAnimationFrame(refreshScrolledState)
  })

  for (const delay of [80, 180, 360]) {
    scrollUpdateTimers.push(window.setTimeout(refreshScrolledState, delay))
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  scheduleScrolledStateUpdate()
  window.addEventListener('scroll', updateScrolledState, { passive: true })
})

onBeforeUnmount(() => {
  clearScrollUpdateTimers()
  window.removeEventListener('scroll', updateScrolledState)
})

watch(
  () => currentRoute.value.fullPath,
  () => {
    closeMobileMenu()

    scheduleScrolledStateUpdate()
  },
  { flush: 'post' }
)
</script>

<template>
  <header
    class="site-header"
    :class="{
      'site-header--solid': isSolidHeader,
      'site-header--scrolled': isHomeRoute && isScrolled,
      'site-header--menu-open': isMobileMenuOpen
    }"
    @keydown.esc="closeMobileMenu"
  >
    <div class="site-header__bar">
      <NuxtLink
        to="/"
        class="site-header__logo-link"
        aria-label="Solagree home"
        @click="closeMobileMenu"
      >
        <img
          class="site-header__logo"
          src="/solagree-logo.svg"
          alt="Solagree"
          width="664"
          height="86"
        >
      </NuxtLink>

      <nav
        class="site-header__nav"
        aria-label="Primary navigation"
      >
        <NuxtLink
          v-for="link in headerPrimaryLinks"
          :key="link.label"
          class="site-header__nav-link"
          :to="link.to"
          :aria-current="currentRoute.fullPath === link.to ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="site-header__actions">
        <a
          class="site-header__login"
          :href="portalLoginHref"
        >
          {{ headerLoginLink.label }}
        </a>

        <SiteButton
          class="site-header__cta"
          :to="headerQuizLink.to"
          variant="primary"
          size="sm"
        >
          {{ headerQuizLink.label }}
        </SiteButton>
      </div>

      <button
        class="site-header__menu-toggle"
        type="button"
        :aria-expanded="isMobileMenuOpen"
        aria-controls="site-header-mobile-menu"
        :aria-label="menuToggleLabel"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </div>

    <Transition name="site-header-menu">
      <div
        v-if="isMobileMenuOpen"
        id="site-header-mobile-menu"
        class="site-header__mobile-panel"
      >
        <nav
          class="site-header__mobile-nav"
          aria-label="Mobile navigation"
        >
          <NuxtLink
            v-for="link in headerPrimaryLinks"
            :key="link.label"
            class="site-header__mobile-link"
            :to="link.to"
            :aria-current="currentRoute.fullPath === link.to ? 'page' : undefined"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="site-header__mobile-actions">
          <a
            class="site-header__mobile-login"
            :href="portalLoginHref"
            @click="closeMobileMenu"
          >
            {{ headerLoginLink.label }}
          </a>

          <SiteButton
            class="site-header__mobile-cta"
            :to="headerQuizLink.to"
            variant="primary"
            block
            @click="closeMobileMenu"
          >
            {{ headerQuizLink.label }}
          </SiteButton>
        </div>
      </div>
    </Transition>
  </header>
</template>
