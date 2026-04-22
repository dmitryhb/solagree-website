<script setup lang="ts">
import { choosePathOptions } from '~/data/choose-path-options'
</script>

<template>
  <section
    id="choose-path"
    class="choose-path-section"
    aria-labelledby="choose-path-title"
  >
    <div class="choose-path-section__inner">
      <header
        v-appear
        class="choose-path-section__header"
      >
        <h2
          id="choose-path-title"
          class="choose-path-section__title"
        >
          Choose the path that fits your situation.
        </h2>
        <p class="choose-path-section__intro">
          Both follow the same proven 3-phase process. The difference is the level of support and whether
          attorneys are involved.
        </p>
      </header>

      <div class="choose-path-section__grid">
        <ChoosePathCard
          v-for="(option, index) in choosePathOptions"
          :key="option.title"
          :option="option"
          v-appear="{ delay: index * 90, variant: 'scale' }"
        />
      </div>
    </div>
  </section>
</template>
