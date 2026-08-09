<script setup>
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  padding: { type: Boolean, default: true },
})
</script>

<template>
  <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header v-if="title || description || $slots.header" class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
      <slot name="header">
        <div>
          <h3 class="font-semibold text-slate-900 dark:text-white">{{ title }}</h3>
          <p v-if="description" class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ description }}</p>
        </div>
      </slot>
      <slot name="actions" />
    </header>

    <div :class="padding ? 'p-5 sm:p-6' : ''">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50 sm:px-6">
      <slot name="footer" />
    </footer>
  </section>
</template>

