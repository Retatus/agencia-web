import { defineStore } from 'pinia'

import PriceListItemService from '../services/price-list-item.service'

export const usePriceListItemStore = defineStore('priceListItem', {
  state: () => ({
    items: [],

    selected: null,

    currentPriceListUuid: null,

    loading: false,

    saving: false,

    deleting: false,

    error: null,

    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0,
    },

    filters: {
      search: '',
      adjustment_type: '',
      active: 1,
    },
  }),

  actions: {
    /*
        |--------------------------------------------------------------------------
        | SET PRICE LIST
        |--------------------------------------------------------------------------
        */

    setPriceList(uuid) {
      this.currentPriceListUuid = uuid || null

      this.items = []

      this.selected = null

      this.pagination.current_page = 1
    },

    /*
        |--------------------------------------------------------------------------
        | FETCH
        |--------------------------------------------------------------------------
        */

    async fetchItems(params = {}) {
      if (!this.currentPriceListUuid) {
        this.items = []

        return []
      }

      this.loading = true

      this.error = null

      try {
        const query = {
          ...this.filters,

          page: this.pagination.current_page,

          per_page: this.pagination.per_page,

          ...params,
        }

        Object.keys(query).forEach((key) => {
          if (query[key] === '' || query[key] === null || query[key] === undefined) {
            delete query[key]
          }
        })

        const response = await PriceListItemService.getAll(this.currentPriceListUuid, query)

        this.items = response.data.data ?? []

        const meta = response.data.meta

        if (meta) {
          this.pagination = {
            current_page: meta.current_page,

            last_page: meta.last_page,

            per_page: meta.per_page,

            total: meta.total,
          }
        }

        return this.items
      } catch (error) {
        this.error = extractErrorMessage(error)

        throw error
      } finally {
        this.loading = false
      }
    },

    /*
        |--------------------------------------------------------------------------
        | CREATE
        |--------------------------------------------------------------------------
        */

    async createItem(payload) {
      if (!this.currentPriceListUuid) {
        throw new Error('Seleccione una lista de precios.')
      }

      this.saving = true

      this.error = null

      try {
        const response = await PriceListItemService.create(this.currentPriceListUuid, payload)

        const item = response.data.data ?? response.data

        this.items.unshift(item)

        return item
      } catch (error) {
        this.error = extractErrorMessage(error)

        throw error
      } finally {
        this.saving = false
      }
    },

    /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

    async updateItem(itemId, payload) {
      if (!this.currentPriceListUuid) {
        throw new Error('Seleccione una lista de precios.')
      }

      this.saving = true

      this.error = null

      try {
        const response = await PriceListItemService.update(
          this.currentPriceListUuid,
          itemId,
          payload,
        )

        const updated = response.data.data ?? response.data

        const index = this.items.findIndex((item) => Number(item.id) === Number(itemId))

        if (index >= 0) {
          this.items[index] = updated
        }

        return updated
      } catch (error) {
        this.error = extractErrorMessage(error)

        throw error
      } finally {
        this.saving = false
      }
    },

    /*
        |--------------------------------------------------------------------------
        | DELETE
        |--------------------------------------------------------------------------
        */

    async deleteItem(itemId) {
      if (!this.currentPriceListUuid) {
        throw new Error('Seleccione una lista de precios.')
      }

      this.deleting = true

      this.error = null

      try {
        await PriceListItemService.delete(this.currentPriceListUuid, itemId)

        this.items = this.items.filter((item) => Number(item.id) !== Number(itemId))
      } catch (error) {
        this.error = extractErrorMessage(error)

        throw error
      } finally {
        this.deleting = false
      }
    },

    /*
        |--------------------------------------------------------------------------
        | RESET
        |--------------------------------------------------------------------------
        */

    reset() {
      this.items = []

      this.selected = null

      this.currentPriceListUuid = null

      this.error = null
    },
  },
})

function extractErrorMessage(error) {
  const errors = error?.response?.data?.errors

  if (errors) {
    const key = Object.keys(errors)[0]

    if (key && errors[key]?.length) {
      return errors[key][0]
    }
  }

  return error?.response?.data?.message ?? error?.message ?? 'Ha ocurrido un error inesperado.'
}
