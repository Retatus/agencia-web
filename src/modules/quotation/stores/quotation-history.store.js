import { defineStore } from 'pinia'
import { ref } from 'vue'

import QuotationHistoryService from '../services/quotation-history.service'

export const useQuotationHistoryStore = defineStore('quotation-history', () => {
  /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

  const items = ref([])

  const meta = ref(null)

  const links = ref(null)

  const loading = ref(false)

  const error = ref(null)

  const selectedQuotationUuid = ref(null)

  /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

  async function fetchHistory(quotationUuid, params = {}) {
    loading.value = true

    error.value = null

    selectedQuotationUuid.value = quotationUuid

    try {
      const response = await QuotationHistoryService.getByQuotation(quotationUuid, params)

      items.value = response.data ?? []

      meta.value = response.data.meta ?? null

      links.value = response.data.links ?? null

      return items.value
    } catch (err) {
      console.error(err)

      error.value = err.response?.data?.message ?? 'No se pudo cargar el historial.'

      items.value = []

      meta.value = null

      links.value = null

      throw err
    } finally {
      loading.value = false
    }
  }

  /*
    |--------------------------------------------------------------------------
    | Clear
    |--------------------------------------------------------------------------
    */

  function clearHistory() {
    items.value = []

    meta.value = null

    links.value = null

    error.value = null

    selectedQuotationUuid.value = null
  }

  return {
    items,

    meta,

    links,

    loading,

    error,

    selectedQuotationUuid,

    fetchHistory,

    clearHistory,
  }
})
