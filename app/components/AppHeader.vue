<script setup lang="ts">
import {
  headerLoginLink,
  headerPrimaryLinks,
  headerQuizLink,
  headerResourcesMenu
} from '~/data/header-navigation'

const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value)
const isMobileMenuOpen = ref(false)
const isResourcesMenuOpen = ref(false)
const isResourcesMenuPinned = ref(false)
const isScrolled = ref(false)
const isResettingHomeScroll = ref(false)
const resourcesMenuContainer = ref<HTMLElement | null>(null)
const resourcesMenuButton = ref<HTMLButtonElement | null>(null)
const resourcesMenu = ref<HTMLElement | null>(null)
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

const closeResourcesMenu = (returnFocus = false): void => {
  isResourcesMenuOpen.value = false
  isResourcesMenuPinned.value = false

  if (returnFocus) {
    nextTick(() => resourcesMenuButton.value?.focus())
  }
}

const openResourcesMenu = async (focusPosition?: 'first' | 'last'): Promise<void> => {
  isResourcesMenuOpen.value = true

  if (focusPosition) {
    isResourcesMenuPinned.value = true
  }

  if (!focusPosition) {
    return
  }

  await nextTick()
  const menuItems = resourcesMenu.value?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]')
  const target = focusPosition === 'first' ? menuItems?.[0] : menuItems?.[menuItems.length - 1]

  target?.focus()
}

/** Opens the menu while a desktop pointer is over it without changing click-toggle state. */
const openResourcesMenuOnHover = (): void => {
  if (!isResourcesMenuPinned.value) {
    isResourcesMenuOpen.value = true
  }
}

/** Closes a hover-only menu while preserving a menu explicitly opened by click or keyboard. */
const closeResourcesMenuOnHoverLeave = (): void => {
  if (!isResourcesMenuPinned.value) {
    closeResourcesMenu()
  }
}

/**
 * Makes the first pointer click after hover keep the menu open, then toggles it
 * on subsequent clicks. This prevents hover-open from immediately cancelling a click.
 */
const toggleResourcesMenu = (): void => {
  if (!isResourcesMenuOpen.value) {
    isResourcesMenuOpen.value = true
    isResourcesMenuPinned.value = true
    return
  }

  if (!isResourcesMenuPinned.value) {
    isResourcesMenuPinned.value = true
    return
  }

  closeResourcesMenu()
}

/** Moves focus between Resources menuitems without trapping Tab navigation. */
const handleResourcesMenuKeydown = (event: KeyboardEvent): void => {
  const menuItems = Array.from(resourcesMenu.value?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? [])

  if (menuItems.length === 0) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closeResourcesMenu(true)
    return
  }

  const currentIndex = menuItems.indexOf(event.target as HTMLAnchorElement)
  const direction = event.key === 'ArrowDown'
    ? 1
    : event.key === 'ArrowUp'
      ? -1
      : 0
  const target = event.key === 'Home'
    ? menuItems[0]
    : event.key === 'End'
      ? menuItems.at(-1)
      : direction !== 0 && currentIndex >= 0
        ? menuItems[(currentIndex + direction + menuItems.length) % menuItems.length]
        : undefined

  if (target) {
    event.preventDefault()
    target.focus()
  }
}

const closeResourcesMenuWhenFocusLeaves = (event: FocusEvent): void => {
  const container = event.currentTarget
  const nextFocusedElement = event.relatedTarget

  if (container instanceof HTMLElement && !container.contains(nextFocusedElement as Node | null)) {
    closeResourcesMenu()
  }
}

/** Dismisses a click-pinned Resources menu when a pointer starts outside its controls. */
const closeResourcesMenuOnOutsidePointerDown = (event: PointerEvent): void => {
  const target = event.target

  if (resourcesMenuContainer.value && target instanceof Node && !resourcesMenuContainer.value.contains(target)) {
    closeResourcesMenu()
  }
}

const isResourceRoute = computed(() => headerResourcesMenu.links.some(({ to }) => (
  currentRoute.value.path === to || currentRoute.value.path.startsWith(`${to}/`)
)))

onMounted(() => {
  scheduleScrolledStateUpdate()
  window.addEventListener('scroll', updateScrolledState, { passive: true })
  document.addEventListener('pointerdown', closeResourcesMenuOnOutsidePointerDown)
})

onBeforeUnmount(() => {
  clearScrollUpdateTimers()
  window.removeEventListener('scroll', updateScrolledState)
  document.removeEventListener('pointerdown', closeResourcesMenuOnOutsidePointerDown)
})

watch(
  () => currentRoute.value.fullPath,
  () => {
    closeMobileMenu()
    closeResourcesMenu()

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
    @keydown.esc="() => { closeMobileMenu(); closeResourcesMenu() }"
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

        <div
          ref="resourcesMenuContainer"
          class="site-header__resources"
          :class="{ 'site-header__resources--open': isResourcesMenuOpen }"
          @focusout="closeResourcesMenuWhenFocusLeaves"
          @mouseenter="openResourcesMenuOnHover"
          @mouseleave="closeResourcesMenuOnHoverLeave"
        >
          <button
            ref="resourcesMenuButton"
            class="site-header__nav-link site-header__resources-toggle"
            type="button"
            aria-controls="site-header-resources-menu"
            aria-haspopup="menu"
            :aria-expanded="isResourcesMenuOpen"
            :class="{ 'site-header__nav-link--active': isResourceRoute }"
            @click="toggleResourcesMenu"
            @keydown.down.prevent="openResourcesMenu('first')"
            @keydown.up.prevent="openResourcesMenu('last')"
            @keydown.esc.stop="closeResourcesMenu(true)"
          >
            {{ headerResourcesMenu.label }}
            <span
              class="site-header__resources-chevron"
              aria-hidden="true"
            />
          </button>

          <ul
            v-if="isResourcesMenuOpen"
            id="site-header-resources-menu"
            ref="resourcesMenu"
            class="site-header__resources-menu"
            role="menu"
            aria-label="Resources"
            @keydown="handleResourcesMenuKeydown"
          >
            <li
              v-for="link in headerResourcesMenu.links"
              :key="link.label"
              role="none"
            >
              <NuxtLink
                class="site-header__resources-link"
                :to="link.to"
                role="menuitem"
                :aria-current="currentRoute.path === link.to ? 'page' : undefined"
                @click="() => closeResourcesMenu()"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
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

          <div class="site-header__mobile-resource-group">
            <p class="site-header__mobile-resource-label">
              {{ headerResourcesMenu.label }}
            </p>
            <NuxtLink
              v-for="link in headerResourcesMenu.links"
              :key="link.label"
              class="site-header__mobile-link site-header__mobile-resource-link"
              :to="link.to"
              :aria-current="currentRoute.path === link.to ? 'page' : undefined"
              @click="closeMobileMenu"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
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
