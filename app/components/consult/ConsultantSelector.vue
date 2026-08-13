<script setup lang="ts">
import type { InitialConsultBookingEvent, InitialConsultSelectionId } from '#shared/initial-consult-booking'

const props = defineProps<{
  events: readonly InitialConsultBookingEvent[]
  selectedId: InitialConsultSelectionId
}>()

const emit = defineEmits<{
  select: [selectionId: InitialConsultSelectionId]
}>()

const selectorButtons = ref<HTMLButtonElement[]>([])

/** Selects a booking option and moves focus during arrow-key navigation. */
const selectOption = async (selectionId: InitialConsultSelectionId, focusIndex?: number): Promise<void> => {
  emit('select', selectionId)

  if (focusIndex === undefined) {
    return
  }

  await nextTick()
  selectorButtons.value[focusIndex]?.focus()
}

/** Implements expected radiogroup arrow-key navigation without trapping Tab navigation. */
const handleOptionKeydown = (event: KeyboardEvent, index: number): void => {
  const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    ? 1
    : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
      ? -1
      : 0

  if (direction === 0) {
    return
  }

  event.preventDefault()
  const nextIndex = (index + direction + props.events.length) % props.events.length
  const nextEvent = props.events[nextIndex]

  if (nextEvent) {
    void selectOption(nextEvent.id, nextIndex)
  }
}
</script>

<template>
  <section
    class="consultant-selector"
    aria-labelledby="consultant-selector-title"
  >
    <div class="consultant-selector__header">
      <h2 id="consultant-selector-title">
        Choose your consultation
      </h2>
      <p>Choose First Available or a specific consultant.</p>
    </div>

    <div
      class="consultant-selector__options"
      role="radiogroup"
      aria-label="Consultation booking option"
    >
      <button
        v-for="(event, index) in events"
        :key="event.id"
        ref="selectorButtons"
        class="consultant-selector__option"
        :class="{ 'consultant-selector__option--selected': event.id === selectedId }"
        type="button"
        role="radio"
        :aria-checked="event.id === selectedId"
        :data-consultant-id="event.id"
        @click="selectOption(event.id)"
        @keydown="handleOptionKeydown($event, index)"
      >
        <img
          v-if="event.profile?.headshotUrl"
          class="consultant-selector__headshot"
          :src="event.profile.headshotUrl"
          :alt="event.label"
        >
        <span class="consultant-selector__option-copy">
          <span class="consultant-selector__option-title">{{ event.label }}</span>
          <span
            v-if="event.profile?.role"
            class="consultant-selector__option-role"
          >{{ event.profile.role }}</span>
          <span
            v-if="event.profile?.bio"
            class="consultant-selector__option-bio"
          >{{ event.profile.bio }}</span>
        </span>
      </button>
    </div>
  </section>
</template>
