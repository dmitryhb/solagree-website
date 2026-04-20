<script setup lang="ts">
import { isExternalHref } from '~/utils/links'

const props = withDefaults(defineProps<{
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  block?: boolean
  disabled?: boolean
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  block: false,
  disabled: false
})

const isDisabledLink = computed(() => Boolean(props.disabled && (props.to || props.href)))

const tag = computed(() => {
  if (props.to && !props.disabled) {
    return resolveComponent('NuxtLink')
  }

  if (props.href && !props.disabled) {
    return 'a'
  }

  if (isDisabledLink.value) {
    return 'span'
  }

  return 'button'
})

const linkProps = computed(() => {
  if (props.to && !props.disabled) {
    return { to: props.to }
  }

  if (props.href && !props.disabled) {
    const isExternal = isExternalHref(props.href)

    return {
      href: props.href,
      target: isExternal ? '_blank' : undefined,
      rel: isExternal ? 'noreferrer' : undefined
    }
  }

  if (isDisabledLink.value) {
    return {
      'aria-disabled': 'true'
    }
  }

  return {
    type: props.type,
    disabled: props.disabled
  }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="linkProps"
    :class="[
      'sol-button',
      `sol-button--${variant}`,
      size === 'sm' && 'sol-button--sm',
      block && 'sol-button--block',
      disabled && 'sol-button--disabled'
    ]"
  >
    <slot />
  </component>
</template>
