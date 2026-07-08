import { defineStore } from 'pinia'
import DocumentTypeService from '../services/documentType.service'

export const useDocumentTypeStore = defineStore('documentType', {
  state: () => ({
    items: [],

    loading: false,
  }),

  actions: {
    async getDocumentTypes() {
      this.loading = true

      try {
        const response = await DocumentTypeService.index()

        this.items = response.data.data
      } finally {
        this.loading = false
      }
    },
  },
})
