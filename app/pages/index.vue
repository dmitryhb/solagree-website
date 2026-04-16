<script setup lang="ts">
const stack = [
  'Nuxt 4',
  'Vue 3',
  'Nuxt UI 4',
  'Tailwind CSS 4',
  'SSR enabled',
  'Port 3003'
]

const checks = [
  'Nuxt UI module registered in nuxt.config.ts',
  'Tailwind and Nuxt UI CSS imported from app/assets/css/main.css',
  'Root route rendered from app/pages/index.vue',
  'npm run dev and npm run preview both pinned to port 3003'
]
</script>

<template>
  <main class="min-h-screen">
    <div class="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <section class="space-y-8">
          <UBadge color="primary" variant="soft" class="rounded-full px-4 py-1 text-sm font-medium">
            Solagree setup ready
          </UBadge>

          <div class="space-y-5">
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Nuxt starter
            </p>
            <h1 class="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Nuxt, Nuxt UI, Tailwind and SSR are wired for local development.
            </h1>
            <p class="max-w-2xl text-lg leading-8 text-slate-600">
              This project is running as a server-rendered Nuxt application with Vue 3, a custom
              root page, and a fixed local development port of <strong>3003</strong>.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton
              to="https://nuxt.com/docs/getting-started/introduction"
              target="_blank"
            >
              Nuxt docs
            </UButton>
            <UButton
              to="https://ui.nuxt.com/docs/getting-started/installation/nuxt"
              target="_blank"
              color="neutral"
              variant="subtle"
            >
              Nuxt UI docs
            </UButton>
          </div>

          <div class="flex flex-wrap gap-3">
            <span
              v-for="item in stack"
              :key="item"
              class="rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
            >
              {{ item }}
            </span>
          </div>
        </section>

        <UCard class="border-white/80 bg-white/80 shadow-2xl shadow-teal-950/5 backdrop-blur">
          <template #header>
            <div class="space-y-2">
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Validation targets
              </p>
              <h2 class="text-2xl font-semibold text-slate-950">
                Local setup checklist
              </h2>
            </div>
          </template>

          <ul class="space-y-3">
            <li
              v-for="item in checks"
              :key="item"
              class="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm leading-6 text-slate-700"
            >
              <span class="mt-1 h-2.5 w-2.5 rounded-full bg-teal-600" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </UCard>
      </div>
    </div>
  </main>
</template>
