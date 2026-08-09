<template>
  <div
    class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
  >
    <!-- Header -->
    <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
      <h3 class="text-sm font-semibold text-slate-900 dark:text-white">
        Resumen de la Cotización
      </h3>
    </div>

    <!-- Body -->
    <div class="p-4">
      <div class="space-y-3">
        <!-- Subtotal -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300"> Subtotal </span>
          <span class="text-sm font-semibold text-slate-900 dark:text-white">
            {{ money(quotation.subtotal) }}
          </span>
        </div>

        <!-- Descuento -->
        <div class="flex items-center justify-between gap-4">
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300"> Descuento </span>
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500 dark:text-slate-400">
              {{ currency }}
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              class="w-28 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-right text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              v-model.number="quotation.discount"
              @input="calculate"
            />
          </div>
        </div>

        <!-- Impuesto -->
        <div class="flex items-center justify-between gap-4">
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300"> Impuesto </span>
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500 dark:text-slate-400">
              {{ currency }}
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              class="w-28 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-right text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              v-model.number="quotation.tax"
              @input="calculate"
            />
          </div>
        </div>

        <!-- Separador -->
        <div class="border-t border-slate-200 dark:border-slate-700"></div>

        <!-- Total -->
        <div class="flex items-center justify-between">
          <span class="text-base font-bold text-slate-900 dark:text-white"> TOTAL </span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-600 dark:text-slate-400">
              {{ currency }}
            </span>
            <span class="text-xl font-bold text-teal-600 dark:text-teal-400">
              {{ money(quotation.total) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  quotation: {
    type: Object,

    required: true,
  },

  currencies: {
    type: Array,

    default: () => [],
  },
})

const emit = defineEmits(['recalculate'])

const currency = computed(() => {
  const item = props.currencies.find((c) => c.id === props.quotation.currency_id)

  return item?.code ?? ''
})

function calculate() {
  props.quotation.total =
    Number(props.quotation.subtotal || 0) -
    Number(props.quotation.discount || 0) +
    Number(props.quotation.tax || 0)

  emit('recalculate')
}

function money(value) {
  return Number(value || 0).toLocaleString(
    undefined,

    {
      minimumFractionDigits: 2,

      maximumFractionDigits: 2,
    },
  )
}
</script>
