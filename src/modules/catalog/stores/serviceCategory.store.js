import { defineStore } from 'pinia'
import ServiceCategoryService from '../service/serviceCategory.service'

export const useServiceCategoryStore = defineStore('serviceCategory', {
  state: () => ({
    items: [],

    loading: false,
  }),

  actions: {
    async getServiceCategories() {
      this.loading = true

      try {
        const response = await ServiceCategoryService.index()

        this.items = response.data.data
      } finally {
        this.loading = false
      }
    },
  },
})
