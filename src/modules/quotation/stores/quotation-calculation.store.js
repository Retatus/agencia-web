import { defineStore } from 'pinia'
import { ref } from 'vue'

import QuotationCalculationService from '../services/quotation-calculation.service'

export const useQuotationCalculationStore = defineStore('quotation-calculation', () => {
  const loading = ref(false)

  const error = ref(null)

  const items = ref([])

  const summary = ref({
    total_cost: 0,
    total_sale: 0,
    profit: 0,
  })

  async function calculate(payload) {
    loading.value = true

    error.value = null

    try {
      const response = await QuotationCalculationService.calculate(payload)

      const result = response?.data?.data ?? {}

      items.value = result.items ?? []

      summary.value = result.summary ?? {
        total_cost: 0,
        total_sale: 0,
        profit: 0,
      }

      return result
    } catch (err) {
      console.error('Error calculating quotation:', err)

      error.value = err?.response?.data?.message ?? 'No se pudo calcular la cotización.'

      throw err
    } finally {
      loading.value = false
    }
  }

  function clear() {
    items.value = []

    summary.value = {
      total_cost: 0,
      total_sale: 0,
      profit: 0,
    }

    error.value = null
  }

  return {
    loading,
    error,
    items,
    summary,

    calculate,
    clear,
  }
})
