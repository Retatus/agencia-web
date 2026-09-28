<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>
<template>
  <header class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div class="min-w-0">
      <p v-if="eyebrow" class="text-sm font-semibold text-teal-600 dark:text-teal-400">
        {{ eyebrow }}
      </p>
      <h2 class="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {{ title }}
      </h2>
      <p v-if="description" class="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
