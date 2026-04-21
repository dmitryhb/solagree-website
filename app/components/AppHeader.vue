<script setup lang="ts">
import { headerLoginLink, headerPrimaryLinks, headerQuizLink } from '~/data/header-navigation'

const route = useRoute()
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const isHomeRoute = computed(() => route.path === '/')
const isSolidHeader = computed(() => !isHomeRoute.value)
const menuToggleLabel = computed(() => (isMobileMenuOpen.value ? 'Close navigation menu' : 'Open navigation menu'))

function updateScrolledState() {
  isScrolled.value = window.scrollY > 8
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  updateScrolledState()
  window.addEventListener('scroll', updateScrolledState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrolledState)
})

watch(
  () => route.fullPath,
  () => {
    closeMobileMenu()

    if (import.meta.client) {
      nextTick(updateScrolledState)
    }
  }
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
          :aria-current="route.fullPath === link.to ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="site-header__actions">
        <NuxtLink
          class="site-header__login"
          :to="headerLoginLink.to"
          :aria-current="route.path === headerLoginLink.to ? 'page' : undefined"
        >
          {{ headerLoginLink.label }}
        </NuxtLink>

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
            :aria-current="route.fullPath === link.to ? 'page' : undefined"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="site-header__mobile-actions">
          <NuxtLink
            class="site-header__mobile-login"
            :to="headerLoginLink.to"
            :aria-current="route.path === headerLoginLink.to ? 'page' : undefined"
            @click="closeMobileMenu"
          >
            {{ headerLoginLink.label }}
          </NuxtLink>

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
