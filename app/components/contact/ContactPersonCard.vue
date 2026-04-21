<script setup lang="ts">
import type { ContactPerson } from '~/types/contact'

defineProps<{
  person: ContactPerson
}>()
</script>

<template>
  <article class="contact-person-card">
    <img
      class="contact-person-card__image"
      :src="person.imageSrc"
      :alt="person.name"
      width="118"
      height="118"
      loading="lazy"
      decoding="async"
    >

    <div class="contact-person-card__body">
      <p class="contact-person-card__role">
        {{ person.role }}
      </p>
      <h2 class="contact-person-card__name">
        {{ person.name }}
      </h2>
      <div class="contact-person-card__links">
        <a :href="`mailto:${person.email}`">
          {{ person.email }}
        </a>
        <a :href="`tel:${person.phone.replace(/[^+\d]/g, '')}`">
          {{ person.phone }}
        </a>
      </div>
    </div>
  </article>
</template>
