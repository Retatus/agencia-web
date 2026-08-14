import { defineStore } from 'pinia'

import CustomerService from '../services/customer.service'

export const useCustomerStore = defineStore('customers', {
  state: () => ({
    customers: [],
    item: null,
    meta: {},
    links: {},
    loading: false,

    saving: false,
  }),

  actions: {
    async fetchCustomers(params = {}) {
      this.loading = true
      try {
        const response = await CustomerService.getAll(params)
        this.customers = response.data.data ?? []
        this.links = response.data.links
        this.meta = response.data.meta
        return this.customers
      } finally {
        this.loading = false
      }
    },

    async fetchCustomer(uuid) {
      const response = await CustomerService.get(uuid)
      this.item = response.data.data
    },

    async createCustomer(data) {
      this.saving = true

      try {
        const response = await CustomerService.create(data)

        const customer = response.data.customer

        /*
        |--------------------------------------------------------------------------
        | Mantener listado local actualizado
        |--------------------------------------------------------------------------
        */

        this.customers.push(customer)

        return customer
      } finally {
        this.saving = false
      }
    },

    async updateCustomer(uuid, data) {
      return await CustomerService.update(uuid, data)
    },

    async deleteCustomer(uuid) {
      return await CustomerService.delete(uuid)
    },
  },
})
