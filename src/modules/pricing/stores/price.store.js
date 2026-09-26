import { defineStore } from 'pinia'

import PriceService from '../services/price.service'

/*
|--------------------------------------------------------------------------
| DEFAULT FILTERS
|--------------------------------------------------------------------------
*/

function createFilters() {
  return {
    search: '',

    price_list_id: null,

    provider_id: null,

    service_category_id: null,

    service_id: null,

    service_variant_id: null,

    price_type_id: null,

    passenger_type_id: null,

    active: 1,

    page: 1,

    per_page: 25,
  }
}

/*
|--------------------------------------------------------------------------
| STORE
|--------------------------------------------------------------------------
*/

export const usePriceStore = defineStore('pricing-prices', {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  state: () => ({
    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    items: [],

    currentPrice: null,

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    loading: false,

    saving: false,

    deleting: false,

    error: null,

    /*
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    */

    filters: createFilters(),

    /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    pagination: {
      current_page: 1,

      last_page: 1,

      per_page: 25,

      total: 0,

      from: null,

      to: null,
    },

    /*
    |--------------------------------------------------------------------------
    | BULK CHANGES
    |--------------------------------------------------------------------------
    |
    | Map:
    |
    | priceId => {
    |   id,
    |   cost,
    |   sale_price,
    |   active
    | }
    |
    */

    changedPrices: new Map(),
  }),

  /*
  |--------------------------------------------------------------------------
  | GETTERS
  |--------------------------------------------------------------------------
  */

  getters: {
    /*
    |--------------------------------------------------------------------------
    | HAS CHANGES
    |--------------------------------------------------------------------------
    */

    hasChanges(state) {
      return state.changedPrices.size > 0
    },

    /*
    |--------------------------------------------------------------------------
    | CHANGED COUNT
    |--------------------------------------------------------------------------
    */

    changedCount(state) {
      return state.changedPrices.size
    },

    /*
    |--------------------------------------------------------------------------
    | CHANGED VALUES
    |--------------------------------------------------------------------------
    */

    changedValues(state) {
      return Array.from(state.changedPrices.values())
    },

    /*
    |--------------------------------------------------------------------------
    | IS EMPTY
    |--------------------------------------------------------------------------
    */

    isEmpty(state) {
      return !state.loading && state.items.length === 0
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

    async fetchPrices() {
      this.loading = true

      this.error = null

      try {
        const response = await PriceService.getAll(this.buildParams())

        /*
        |--------------------------------------------------------------------------
        | Ajusta esto si tu backend usa otra estructura.
        |--------------------------------------------------------------------------
        */

        this.items = response.data.data ?? []

        const meta = response.data.meta ?? {}

        this.pagination = {
          current_page: meta.current_page ?? 1,

          last_page: meta.last_page ?? 1,

          per_page: meta.per_page ?? this.filters.per_page,

          total: meta.total ?? 0,

          from: meta.from ?? null,

          to: meta.to ?? null,
        }

        /*
        |--------------------------------------------------------------------------
        | Al recargar descartamos cambios locales.
        |--------------------------------------------------------------------------
        */

        this.clearChanges()

        return this.items
      } catch (error) {
        this.error = this.resolveError(error)

        throw error
      } finally {
        this.loading = false
      }
    },

    /*
    |--------------------------------------------------------------------------
    | GET ONE
    |--------------------------------------------------------------------------
    */

    async fetchPrice(id) {
      this.loading = true

      this.error = null

      try {
        const response = await PriceService.get(id)

        this.currentPrice = response.data.data

        return this.currentPrice
      } catch (error) {
        this.error = this.resolveError(error)

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

    async createPrice(data) {
      this.saving = true

      this.error = null

      try {
        const response = await PriceService.create(data)

        const created = response.data.data

        /*
        |--------------------------------------------------------------------------
        | No hacemos push manual necesariamente porque
        | los filtros actuales podrían excluir el nuevo precio.
        |
        | Volvemos a consultar.
        |--------------------------------------------------------------------------
        */

        await this.fetchPrices()

        return created
      } catch (error) {
        this.error = this.resolveError(error)

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

    async updatePrice(id, data) {
      this.saving = true

      this.error = null

      try {
        const response = await PriceService.update(id, data)

        const updated = response.data.data

        /*
        |--------------------------------------------------------------------------
        | Actualizar localmente
        |--------------------------------------------------------------------------
        */

        const index = this.items.findIndex((price) => Number(price.id) === Number(id))

        if (index >= 0) {
          this.items[index] = updated
        }

        /*
        |--------------------------------------------------------------------------
        | Si estaba marcado como modificado,
        | deja de estar pendiente.
        |--------------------------------------------------------------------------
        */

        this.changedPrices.delete(Number(id))

        return updated
      } catch (error) {
        this.error = this.resolveError(error)

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

    async deletePrice(id) {
      this.deleting = true

      this.error = null

      try {
        await PriceService.destroy(id)

        /*
        |--------------------------------------------------------------------------
        | Eliminar local
        |--------------------------------------------------------------------------
        */

        this.items = this.items.filter((price) => Number(price.id) !== Number(id))

        this.changedPrices.delete(Number(id))
      } catch (error) {
        this.error = this.resolveError(error)

        throw error
      } finally {
        this.deleting = false
      }
    },

    /*
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    | BULK EDITING
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | MARK PRICE CHANGED
    |--------------------------------------------------------------------------
    |
    | La tabla llamará esto cada vez que cambie:
    |
    | cost
    | sale_price
    | active
    |
    */

    markChanged(price, field, value) {
      if (!price?.id) {
        return
      }

      const id = Number(price.id)

      /*
      |--------------------------------------------------------------------------
      | Actualizar inmediatamente la fila visual
      |--------------------------------------------------------------------------
      */

      price[field] = value

      /*
      |--------------------------------------------------------------------------
      | Obtener cambios anteriores
      |--------------------------------------------------------------------------
      */

      const current = this.changedPrices.get(id) ?? {
        id,
      }

      /*
      |--------------------------------------------------------------------------
      | Guardar solo el campo cambiado
      |--------------------------------------------------------------------------
      */

      current[field] = value

      this.changedPrices.set(id, current)
    },

    /*
    |--------------------------------------------------------------------------
    | MARK COST
    |--------------------------------------------------------------------------
    */

    updateLocalCost(price, value) {
      this.markChanged(price, 'cost', Number(value ?? 0))
    },

    /*
    |--------------------------------------------------------------------------
    | MARK SALE PRICE
    |--------------------------------------------------------------------------
    */

    updateLocalSalePrice(price, value) {
      this.markChanged(price, 'sale_price', Number(value ?? 0))
    },

    /*
    |--------------------------------------------------------------------------
    | MARK ACTIVE
    |--------------------------------------------------------------------------
    */

    updateLocalActive(price, value) {
      this.markChanged(price, 'active', Boolean(value))
    },

    /*
    |--------------------------------------------------------------------------
    | BULK UPDATE
    |--------------------------------------------------------------------------
    */

    async bulkUpdatePrices() {
      if (!this.hasChanges) {
        return []
      }

      this.saving = true

      this.error = null

      try {
        const payload = Array.from(this.changedPrices.values())

        const response = await PriceService.bulkUpdate(payload)

        /*
        |--------------------------------------------------------------------------
        | Backend devuelve los precios actualizados
        |--------------------------------------------------------------------------
        */

        const updatedPrices = response.data.data ?? []

        /*
        |--------------------------------------------------------------------------
        | Sincronizar resultados
        |--------------------------------------------------------------------------
        */

        updatedPrices.forEach((updated) => {
          const index = this.items.findIndex((price) => Number(price.id) === Number(updated.id))

          if (index >= 0) {
            this.items[index] = updated
          }
        })

        this.clearChanges()

        return updatedPrices
      } catch (error) {
        this.error = this.resolveError(error)

        throw error
      } finally {
        this.saving = false
      }
    },

    /*
    |--------------------------------------------------------------------------
    | CLEAR CHANGES
    |--------------------------------------------------------------------------
    */

    clearChanges() {
      this.changedPrices = new Map()
    },

    /*
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    */

    setFilter(field, value) {
      if (!(field in this.filters)) {
        return
      }

      this.filters[field] = value

      /*
      |--------------------------------------------------------------------------
      | Al cambiar filtros regresar a página 1.
      |--------------------------------------------------------------------------
      */

      if (field !== 'page') {
        this.filters.page = 1
      }
    },

    /*
    |--------------------------------------------------------------------------
    | SET FILTERS
    |--------------------------------------------------------------------------
    */

    setFilters(values = {}) {
      Object.keys(values).forEach((key) => {
        if (key in this.filters) {
          this.filters[key] = values[key]
        }
      })

      this.filters.page = 1
    },

    /*
    |--------------------------------------------------------------------------
    | CLEAR FILTERS
    |--------------------------------------------------------------------------
    */

    resetFilters() {
      this.filters = createFilters()
    },

    /*
    |--------------------------------------------------------------------------
    | PAGE
    |--------------------------------------------------------------------------
    */

    async setPage(page) {
      const target = Number(page)

      if (target < 1 || target > this.pagination.last_page) {
        return
      }

      this.filters.page = target

      await this.fetchPrices()
    },

    /*
    |--------------------------------------------------------------------------
    | PER PAGE
    |--------------------------------------------------------------------------
    */

    async setPerPage(perPage) {
      this.filters.per_page = Number(perPage)

      this.filters.page = 1

      await this.fetchPrices()
    },

    /*
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | BUILD PARAMS
    |--------------------------------------------------------------------------
    |
    | No enviamos:
    |
    | null
    | undefined
    | ''
    |
    */

    buildParams() {
      const params = {}

      Object.entries(this.filters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          return
        }

        params[key] = value
      })

      return params
    },

    /*
    |--------------------------------------------------------------------------
    | FIND PRICE
    |--------------------------------------------------------------------------
    */

    findPrice(id) {
      return this.items.find((price) => Number(price.id) === Number(id)) ?? null
    },

    /*
    |--------------------------------------------------------------------------
    | RESET CURRENT
    |--------------------------------------------------------------------------
    */

    resetCurrentPrice() {
      this.currentPrice = null
    },

    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    clearError() {
      this.error = null
    },

    resolveError(error) {
      /*
      |--------------------------------------------------------------------------
      | FormRequest 422
      |--------------------------------------------------------------------------
      */

      if (error.response?.data?.message) {
        return error.response.data.message
      }

      return error.message ?? 'Se produjo un error inesperado.'
    },
  },
})
