<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  id: string
  menu: { label: string, links: readonly { label: string, to: string }[] }
  currentPath: string
  currentFullPath: string
  active: boolean
}>()
const emit = defineEmits<{ open: [] }>()
const isResourcesMenuOpen = ref(false)
const isResourcesMenuPinned = ref(false)
const resourcesMenuContainer = ref<HTMLElement | null>(null)
const resourcesMenuButton = ref<HTMLButtonElement | null>(null)
const resourcesMenu = ref<HTMLElement | null>(null)
const closeResourcesMenu = (returnFocus = false): void => {
  isResourcesMenuOpen.value = false
  isResourcesMenuPinned.value = false

  if (returnFocus) {
    nextTick(() => resourcesMenuButton.value?.focus())
  }
}

const openResourcesMenu = async (focusPosition?: 'first' | 'last'): Promise<void> => {
  isResourcesMenuOpen.value = true
  emit('open')

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
    emit('open')
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
    emit('open')
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

const isResourceRoute = computed(() => props.menu.links.some(({ to }) => (
  props.currentPath === to || props.currentPath.startsWith(`${to}/`)
)))

onMounted(() => document.addEventListener('pointerdown', closeResourcesMenuOnOutsidePointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', closeResourcesMenuOnOutsidePointerDown))
watch(() => props.currentFullPath, () => closeResourcesMenu())
watch(() => props.active, active => { if (!active) closeResourcesMenu() })
</script>

<template>
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
            :aria-controls="id"
            aria-haspopup="menu"
            :aria-expanded="isResourcesMenuOpen"
            :class="{ 'site-header__nav-link--active': isResourceRoute }"
            @click="toggleResourcesMenu"
            @keydown.down.prevent="openResourcesMenu('first')"
            @keydown.up.prevent="openResourcesMenu('last')"
            @keydown.esc.stop="closeResourcesMenu(true)"
          >
            {{ menu.label }}
            <span
              class="site-header__resources-chevron"
              aria-hidden="true"
            />
          </button>

          <ul
            v-if="isResourcesMenuOpen"
            :id="id"
            ref="resourcesMenu"
            class="site-header__resources-menu"
            role="menu"
            :aria-label="menu.label"
            @keydown="handleResourcesMenuKeydown"
          >
            <li
              v-for="link in menu.links"
              :key="link.label"
              role="none"
            >
              <NuxtLink
                class="site-header__resources-link"
                :to="link.to"
                role="menuitem"
                :aria-current="currentPath === link.to ? 'page' : undefined"
                @click="() => closeResourcesMenu()"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
</template>
