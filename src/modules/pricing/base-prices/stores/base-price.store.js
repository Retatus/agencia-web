import { defineStore } from 'pinia'

import BasePriceService from '../services/base-price.service'

export const useBasePriceStore = defineStore('basePrice', {
  /*
      |--------------------------------------------------------------------------
      | STATE
      |--------------------------------------------------------------------------
      */

  state: () => ({
    items: [],

    selected: null,

    loading: false,

    saving: false,

    deleting: false,

    error: null,

    /*
        |--------------------------------------------------------------------------
        | PAGINATION
        |--------------------------------------------------------------------------
        */

    pagination: {
      current_page: 1,

      last_page: 1,

      per_page: 20,

      total: 0,
    },

    /*
        |--------------------------------------------------------------------------
        | FILTERS
        |--------------------------------------------------------------------------
        */

    filters: {
      search: '',

      service_id: null,

      service_variant_id: null,

      passenger_type_id: null,

      active: 1,

      valid_from: null,

      valid_to: null,
    },
  }),

  /*
      |--------------------------------------------------------------------------
      | GETTERS
      |--------------------------------------------------------------------------
      */

  getters: {
    totalItems(state) {
      return state.pagination.total || state.items.length
    },

    activeItems(state) {
      return state.items.filter((item) => Boolean(item.active))
    },

    itemById: (state) => (id) => {
      return state.items.find((item) => Number(item.id) === Number(id)) ?? null
    },
  },

  /*
      |--------------------------------------------------------------------------
      | ACTIONS
      |--------------------------------------------------------------------------
      */

  actions: {
    /*
        |--------------------------------------------------------------------------
        | FETCH
        |--------------------------------------------------------------------------
        */

    async fetchBasePrices(params = {}) {
      this.loading = true

      this.error = null

      try {
        const query = {
          ...this.filters,

          page: this.pagination.current_page,

          per_page: this.pagination.per_page,

          ...params,
        }

        /*
            |--------------------------------------------------------------------------
            | Eliminar parámetros vacíos
            |--------------------------------------------------------------------------
            */

        Object.keys(query).forEach((key) => {
          if (query[key] === '' || query[key] === null || query[key] === undefined) {
            delete query[key]
          }
        })

        const response = await BasePriceService.getAll(query)

        /*
            |--------------------------------------------------------------------------
            | Laravel Resource Collection
            |--------------------------------------------------------------------------
            */

        this.items = response.data.data ?? []

        /*
            |--------------------------------------------------------------------------
            | Pagination
            |--------------------------------------------------------------------------
            */

        const meta = response.data.meta

        if (meta) {
          this.pagination = {
            current_page: meta.current_page ?? 1,

            last_page: meta.last_page ?? 1,

            per_page: meta.per_page ?? 20,

            total: meta.total ?? 0,
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
        | FETCH ONE
        |--------------------------------------------------------------------------
        */

    async fetchBasePrice(id) {
      this.loading = true

      this.error = null

      try {
        const response = await BasePriceService.get(id)

        const item = response.data.data ?? response.data

        this.selected = item

        return item
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

    async createBasePrice(data) {
      this.saving = true

      this.error = null

      try {
        const response = await BasePriceService.create(data)

        const item = response.data.data ?? response.data

        /*
            |--------------------------------------------------------------------------
            | Actualizar colección local
            |--------------------------------------------------------------------------
            */

        this.items.unshift(item)

        this.pagination.total++

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

    async updateBasePrice(id, data) {
      this.saving = true

      this.error = null

      try {
        const response = await BasePriceService.update(id, data)

        const updated = response.data.data ?? response.data

        const index = this.items.findIndex((item) => Number(item.id) === Number(id))

        if (index >= 0) {
          this.items[index] = updated
        }

        if (Number(this.selected?.id) === Number(id)) {
          this.selected = updated
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

    async deleteBasePrice(id) {
      this.deleting = true

      this.error = null

      try {
        await BasePriceService.delete(id)

        this.items = this.items.filter((item) => Number(item.id) !== Number(id))

        if (this.pagination.total > 0) {
          this.pagination.total--
        }

        if (Number(this.selected?.id) === Number(id)) {
          this.selected = null
        }

        return true
      } catch (error) {
        this.error = extractErrorMessage(error)

        throw error
      } finally {
        this.deleting = false
      }
    },

    /*
        |--------------------------------------------------------------------------
        | FILTERS
        |--------------------------------------------------------------------------
        */

    setFilters(filters = {}) {
      this.filters = {
        ...this.filters,
        ...filters,
      }

      /*
          |--------------------------------------------------------------------------
          | Al modificar filtros regresamos a página 1
          |--------------------------------------------------------------------------
          */

      this.pagination.current_page = 1
    },

    resetFilters() {
      this.filters = {
        search: '',

        service_id: null,

        service_variant_id: null,

        passenger_type_id: null,

        active: 1,

        valid_from: null,

        valid_to: null,
      }

      this.pagination.current_page = 1
    },

    /*
        |--------------------------------------------------------------------------
        | PAGINATION
        |--------------------------------------------------------------------------
        */

    async setPage(page) {
      this.pagination.current_page = Number(page)

      return this.fetchBasePrices()
    },

    async setPerPage(perPage) {
      this.pagination.per_page = Number(perPage)

      this.pagination.current_page = 1

      return this.fetchBasePrices()
    },

    /*
        |--------------------------------------------------------------------------
        | SELECT
        |--------------------------------------------------------------------------
        */

    select(item = null) {
      this.selected = item
    },

    clearSelected() {
      this.selected = null
    },

    /*
        |--------------------------------------------------------------------------
        | RESET
        |--------------------------------------------------------------------------
        */

    reset() {
      this.items = []

      this.selected = null

      this.loading = false

      this.saving = false

      this.deleting = false

      this.error = null

      this.pagination = {
        current_page: 1,

        last_page: 1,

        per_page: 20,

        total: 0,
      }

      this.resetFilters()
    },
  },
})

/*
|--------------------------------------------------------------------------
| ERROR HELPER
|--------------------------------------------------------------------------
*/

function extractErrorMessage(error) {
  /*
  |--------------------------------------------------------------------------
  | Laravel validation
  |--------------------------------------------------------------------------
  */

  const errors = error?.response?.data?.errors

  if (errors) {
    const firstField = Object.keys(errors)[0]

    if (firstField && errors[firstField]?.length) {
      return errors[firstField][0]
    }
  }

  return error?.response?.data?.message ?? error?.message ?? 'Ha ocurrido un error inesperado.'
}
