<script setup>
defineProps({
  iso: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="flex items-center gap-2">
    <span :class="`fi fi-${iso?.toLowerCase()}`" class="shrink-0" />

    <span>
      {{ name }}
    </span>
  </div>
</template>
