<script setup lang="ts">
useSeoMeta({
  title: 'Solagree',
  description: 'Minimal homepage shell for Solagree.'
})
</script>

<template>
  <main class="page-shell bg-white">
    <h1 class="sr-only">
      Solagree
    </h1>

    <div class="mx-auto flex min-h-screen w-full max-w-[1180px] items-start justify-between gap-6 px-6 py-6 sm:px-8 sm:py-8">
      <NuxtLink
        to="/"
        class="font-[var(--font-nav)] text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
      >
        Solagree
      </NuxtLink>

      <NuxtLink
        to="/quiz/"
        class="font-[var(--font-nav)] text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)]"
      >
        Quiz
      </NuxtLink>
    </div>
  </main>
</template>
