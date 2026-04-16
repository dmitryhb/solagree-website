<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  intro?: string
  tone?: 'default' | 'soft' | 'dark'
  width?: 'default' | 'narrow'
  align?: 'left' | 'center'
}>(), {
  tone: 'default',
  width: 'default',
  align: 'left'
})
</script>

<template>
  <section :class="['app-section', tone !== 'default' && `app-section--${tone}`]">
    <div :class="['section-shell', width === 'narrow' && 'section-shell--narrow']">
      <header
        v-if="eyebrow || title || intro"
        :class="['section-heading', align === 'center' && 'section-heading--center']"
      >
        <p
          v-if="eyebrow"
          class="eyebrow"
        >
          {{ eyebrow }}
        </p>
        <h2
          v-if="title"
          class="section-title"
        >
          {{ title }}
        </h2>
        <p
          v-if="intro"
          class="section-intro"
        >
          {{ intro }}
        </p>
      </header>

      <slot />
    </div>
  </section>
</template>
