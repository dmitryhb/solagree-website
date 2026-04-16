<script setup lang="ts">
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

const tag = computed(() => {
  if (props.to) {
    return resolveComponent('NuxtLink')
  }

  if (props.href) {
    return 'a'
  }

  return 'button'
})

const linkProps = computed(() => {
  if (props.to) {
    return { to: props.to }
  }

  if (props.href) {
    const isExternal = /^https?:\/\//.test(props.href)

    return {
      href: props.href,
      target: isExternal ? '_blank' : undefined,
      rel: isExternal ? 'noreferrer' : undefined
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
      block && 'sol-button--block'
    ]"
  >
    <slot />
  </component>
</template>
