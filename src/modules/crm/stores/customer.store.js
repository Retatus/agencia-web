import { defineStore } from 'pinia'
import CustomerService from '../services/customer.service'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    items: [],
    item: null,
    meta: {},
    links: {},
    loading: false,
  }),

  actions: {
    async getCustomers(filters = {}) {
      this.loading = true
      try {
        const res = await CustomerService.getAll(filters)
        this.items = res.data.data
        this.links = res.data.links
        this.meta = res.data.meta
      } finally {
        this.loading = false
      }
    },

    async getCustomer(uuid) {
      const res = await CustomerService.get(uuid)
      this.item = res.data.data
    },

    async createCustomer(data) {
      return await CustomerService.create(data)
    },

    async updateCustomer(uuid, data) {
      return await CustomerService.update(uuid, data)
    },

    async deleteCustomer(uuid) {
      return await CustomerService.delete(uuid)
    },
  },
})
