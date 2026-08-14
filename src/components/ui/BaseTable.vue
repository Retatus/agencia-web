<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  columns: { type: Number, default: 1 },
  emptyText: { type: String, default: 'No existen registros.' },
})
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[750px] text-left text-sm [&_th]:whitespace-nowrap [&_th]:px-5 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-slate-500 dark:[&_th]:text-slate-400 [&_td]:px-5 [&_td]:py-4">
        <thead class="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50"><slot name="header" /></thead>

        <tbody v-if="loading">
          <tr><td :colspan="columns" class="!py-14 text-center"><span class="mx-auto mb-3 block h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600 dark:border-slate-700 dark:border-t-teal-400" /><p class="text-slate-500 dark:text-slate-400">Cargando información...</p></td></tr>
        </tbody>

        <tbody v-else-if="items.length" class="divide-y divide-slate-100 dark:divide-slate-800 [&>tr]:transition-colors [&>tr:hover]:bg-slate-50/70 dark:[&>tr:hover]:bg-slate-800/50 [&_td]:text-slate-600 dark:[&_td]:text-slate-300">
          <slot name="body" :items="items" />
        </tbody>

        <tbody v-else>
          <tr><td :colspan="columns" class="!py-14 text-center"><p class="font-medium text-slate-700 dark:text-slate-300">{{ emptyText }}</p></td></tr>
        </tbody>
      </table>
    </div>
    <div v-if="$slots.footer" class="border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-950/50"><slot name="footer" /></div>
  </div>
</template>

