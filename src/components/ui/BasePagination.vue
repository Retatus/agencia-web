<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  currentPage: { type: [Number, String], default: 1 },
  lastPage: { type: [Number, String], default: 1 },
  total: { type: [Number, String], default: 0 },
  perPage: { type: [Number, String], default: 10 },
})

const emit = defineEmits(['change'])

const current = computed(() => Math.max(1, Number(props.currentPage) || 1))
const last = computed(() => Math.max(1, Number(props.lastPage) || 1))
const pageSize = computed(() => Math.max(1, Number(props.perPage) || 10))
const recordCount = computed(() => Math.max(0, Number(props.total) || 0))

const pages = computed(() => {
  const start = Math.max(1, Math.min(current.value - 2, last.value - 4))
  const end = Math.min(last.value, start + 4)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

const from = computed(() => recordCount.value ? (current.value - 1) * pageSize.value + 1 : 0)
const to = computed(() => Math.min(current.value * pageSize.value, recordCount.value))

function change(page) {
  if (page >= 1 && page <= last.value && page !== current.value) emit('change', page)
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <p class="text-sm text-slate-500 dark:text-slate-400">
      Mostrando <span class="font-medium text-slate-700 dark:text-slate-200">{{ from }}–{{ to }}</span> de <span class="font-medium text-slate-700 dark:text-slate-200">{{ recordCount }}</span>
    </p>
    <nav class="flex items-center gap-1" aria-label="Paginación">
      <button type="button" aria-label="Página anterior" class="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="current <= 1" @click="change(current - 1)"><ChevronLeft class="h-4 w-4" /></button>
      <button v-for="page in pages" :key="page" type="button" class="min-w-9 rounded-lg border px-3 py-2 text-sm font-medium" :class="page === current ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'" @click="change(page)">{{ page }}</button>
      <button type="button" aria-label="Página siguiente" class="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="current >= last" @click="change(current + 1)"><ChevronRight class="h-4 w-4" /></button>
    </nav>
  </div>
</template>

