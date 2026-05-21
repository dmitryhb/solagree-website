<script setup lang="ts">
interface WebinarJoinPromptProps {
  joinTo?: string
}

withDefaults(defineProps<WebinarJoinPromptProps>(), {
  joinTo: '/attorney-application'
})
</script>

<template>
  <section
    class="webinar-join-prompt"
    aria-labelledby="webinar-join-title"
  >
    <h1
      id="webinar-join-title"
      class="webinar-join-prompt__title"
    >
      It only takes a few minutes to get started!
    </h1>

    <NuxtLink
      class="webinar-join-prompt__cta"
      :to="joinTo"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>Join Now</span>
      <span
        class="webinar-join-prompt__cta-icon"
        aria-hidden="true"
      >
        &rarr;
      </span>
    </NuxtLink>

    <p class="webinar-join-prompt__contact">
      Have additional questions?
      <NuxtLink to="/">
        Get in touch.
      </NuxtLink>
    </p>
  </section>
</template>
