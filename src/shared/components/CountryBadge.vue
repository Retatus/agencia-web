<script setup>
import { computed } from 'vue'
import 'flag-icons/css/flag-icons.min.css'

const props = defineProps({
  iso: {
    type: [String, null],
    default: null,
  },

  name: {
    type: [String, null],
    default: null,
  },
})

const normalizedIso = computed(() => {
  const value = props.iso?.trim().toLowerCase()

  return /^[a-z]{2}$/.test(value ?? '') ? value : ''
})
</script>

<template>
  <div class="flex items-center gap-2">
    <span
      v-if="normalizedIso"
      :class="['fi', `fi-${normalizedIso}`]"
      class="shrink-0"
      aria-hidden="true"
    />

    <span>
      {{ name || '-' }}
    </span>
  </div>
</template>
