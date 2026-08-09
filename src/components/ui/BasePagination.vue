<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  currentPage: { type: Number, default: 1 },
  lastPage: { type: Number, default: 1 },
  total: { type: Number, default: 0 },
  perPage: { type: Number, default: 10 },
})

const emit = defineEmits(['change'])

const pages = computed(() => {
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.lastPage, start + 4)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

const from = computed(() => props.total ? (props.currentPage - 1) * props.perPage + 1 : 0)
const to = computed(() => Math.min(props.currentPage * props.perPage, props.total))

function change(page) {
  if (page >= 1 && page <= props.lastPage && page !== props.currentPage) emit('change', page)
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <p class="text-sm text-slate-500 dark:text-slate-400">
      Mostrando <span class="font-medium text-slate-700 dark:text-slate-200">{{ from }}–{{ to }}</span> de <span class="font-medium text-slate-700 dark:text-slate-200">{{ total }}</span>
    </p>
    <nav class="flex items-center gap-1" aria-label="Paginación">
      <button type="button" aria-label="Página anterior" class="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="currentPage === 1" @click="change(currentPage - 1)"><ChevronLeft class="h-4 w-4" /></button>
      <button v-for="page in pages" :key="page" type="button" class="min-w-9 rounded-lg border px-3 py-2 text-sm font-medium" :class="page === currentPage ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'" @click="change(page)">{{ page }}</button>
      <button type="button" aria-label="Página siguiente" class="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="currentPage === lastPage" @click="change(currentPage + 1)"><ChevronRight class="h-4 w-4" /></button>
    </nav>
  </div>
</template>

