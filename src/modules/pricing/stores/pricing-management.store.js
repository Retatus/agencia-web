import { defineStore } from 'pinia'

import PriceListService from '../services/price-list.service'
import PriceService from '../services/price.service'
import ServiceVariantService from '../services/service-variant.service'

import ServiceService from '../../catalog/services/services/service.service'

function collectionFrom(response) {
  return response?.data?.data ?? []
}

function metaFrom(response) {
  return response?.data?.meta ?? null
}

export const usePricingManagementStore = defineStore('pricing-management', {
  state: () => ({
    priceLists: [],

    services: [],

    variants: [],

    prices: [],

    selectedPriceList: null,

    selectedService: null,

    selectedVariant: null,

    priceListMeta: null,

    serviceMeta: null,

    priceMeta: null,

    priceListFilters: {
      search: '',

      currency_id: null,

      active: null,

      page: 1,

      per_page: 20,
    },

    serviceFilters: {
      search: '',

      category_id: null,

      provider_id: null,

      active: 1,

      page: 1,

      per_page: 50,
    },

    priceFilters: {
      active: null,

      page: 1,

      per_page: 100,
    },

    loadingPriceLists: false,

    loadingServices: false,

    loadingVariants: false,

    loadingPrices: false,

    savingPriceList: false,

    savingService: false,

    savingVariant: false,

    savingPrice: false,

    deleting: false,

    error: null,
  }),

  getters: {
    selectedPriceListId: (state) => state.selectedPriceList?.id ?? null,

    selectedPriceListUuid: (state) => state.selectedPriceList?.uuid ?? null,

    selectedServiceId: (state) => state.selectedService?.id ?? null,

    selectedServiceUuid: (state) => state.selectedService?.uuid ?? null,

    selectedVariantId: (state) => state.selectedVariant?.id ?? null,

    hasPriceListSelection: (state) => Boolean(state.selectedPriceList),

    hasServiceSelection: (state) => Boolean(state.selectedService),

    hasVariantSelection: (state) => Boolean(state.selectedVariant),

    isLoading(state) {
      return (
        state.loadingPriceLists ||
        state.loadingServices ||
        state.loadingVariants ||
        state.loadingPrices
      )
    },

    isSaving(state) {
      return (
        state.savingPriceList || state.savingService || state.savingVariant || state.savingPrice
      )
    },
  },

  actions: {
    clearError() {
      this.error = null
    },

    setError(error, fallbackMessage) {
      this.error = error?.response?.data?.message ?? error?.message ?? fallbackMessage
    },

    resetSelections() {
      this.selectedPriceList = null

      this.selectedService = null

      this.selectedVariant = null

      this.variants = []

      this.prices = []

      this.priceMeta = null
    },

    resetServiceSelection() {
      this.selectedService = null

      this.selectedVariant = null

      this.variants = []

      this.prices = []

      this.priceMeta = null
    },

    resetVariantSelection() {
      this.selectedVariant = null

      this.prices = []

      this.priceMeta = null
    },

    async initialize() {
      this.clearError()

      await this.fetchServices()
    },

    /*
        |--------------------------------------------------------------------------
        | PRICE LISTS
        |--------------------------------------------------------------------------
        */

    async fetchPriceLists(params = {}) {
      this.loadingPriceLists = true

      this.clearError()

      try {
        const requestParams = {
          ...this.priceListFilters,

          ...params,
        }

        const response = await PriceListService.getAll(requestParams)

        this.priceLists = collectionFrom(response)

        this.priceListMeta = metaFrom(response)

        if (this.selectedPriceList) {
          const selected = this.priceLists.find(
            (priceList) => Number(priceList.id) === Number(this.selectedPriceList.id),
          )

          this.selectedPriceList = selected ?? this.selectedPriceList
        }

        return response
      } catch (error) {
        this.setError(error, 'No fue posible cargar las listas de precios.')

        throw error
      } finally {
        this.loadingPriceLists = false
      }
    },

    async selectPriceList(priceList) {
      this.selectedPriceList = priceList

      this.resetServiceSelection()
    },

    async createPriceList(payload) {
      this.savingPriceList = true

      this.clearError()

      try {
        const response = await PriceListService.create(payload)

        const created = response.data.data

        await this.fetchPriceLists()

        this.selectedPriceList = created

        this.resetServiceSelection()

        return created
      } catch (error) {
        this.setError(error, 'No fue posible crear la lista de precios.')

        throw error
      } finally {
        this.savingPriceList = false
      }
    },

    async updatePriceList(priceList, payload) {
      this.savingPriceList = true

      this.clearError()

      try {
        const response = await PriceListService.update(priceList.uuid, payload)

        const updated = response.data.data

        await this.fetchPriceLists()

        if (Number(this.selectedPriceList?.id) === Number(updated.id)) {
          this.selectedPriceList = updated
        }

        return updated
      } catch (error) {
        this.setError(error, 'No fue posible actualizar la lista de precios.')

        throw error
      } finally {
        this.savingPriceList = false
      }
    },

    async deletePriceList(priceList) {
      this.deleting = true

      this.clearError()

      try {
        await PriceListService.destroy(priceList.uuid)

        if (Number(this.selectedPriceList?.id) === Number(priceList.id)) {
          this.resetSelections()
        }

        await this.fetchPriceLists()
      } catch (error) {
        this.setError(error, 'No fue posible eliminar la lista de precios.')

        throw error
      } finally {
        this.deleting = false
      }
    },

    /*
        |--------------------------------------------------------------------------
        | SERVICES
        |--------------------------------------------------------------------------
        */

    async fetchServices(params = {}) {
      this.loadingServices = true

      this.clearError()

      try {
        const requestParams = {
          ...this.serviceFilters,

          ...params,
        }

        const response = await ServiceService.getAll(requestParams)

        this.services = collectionFrom(response)

        this.serviceMeta = metaFrom(response)

        return response
      } catch (error) {
        this.setError(error, 'No fue posible cargar los servicios.')

        throw error
      } finally {
        this.loadingServices = false
      }
    },

    async selectService(service) {
      this.selectedService = service

      this.resetVariantSelection()

      await this.fetchVariants()
    },

    async createService(payload) {
      this.savingService = true

      this.clearError()

      try {
        const response = await ServiceService.create(payload)

        const created = response.data.data

        await this.fetchServices()

        await this.selectService(created)

        return created
      } catch (error) {
        this.setError(error, 'No fue posible crear el servicio.')

        throw error
      } finally {
        this.savingService = false
      }
    },

    async updateService(service, payload) {
      this.savingService = true

      this.clearError()

      try {
        const response = await ServiceService.update(service.uuid, payload)

        const updated = response.data.data

        await this.fetchServices()

        if (Number(this.selectedService?.id) === Number(updated.id)) {
          this.selectedService = updated
        }

        return updated
      } catch (error) {
        this.setError(error, 'No fue posible actualizar el servicio.')

        throw error
      } finally {
        this.savingService = false
      }
    },

    async deleteService(service) {
      this.deleting = true

      this.clearError()

      try {
        await ServiceService.destroy(service.uuid)

        if (Number(this.selectedService?.id) === Number(service.id)) {
          this.resetServiceSelection()
        }

        await this.fetchServices()
      } catch (error) {
        this.setError(error, 'No fue posible eliminar el servicio.')

        throw error
      } finally {
        this.deleting = false
      }
    },

    /*
        |--------------------------------------------------------------------------
        | VARIANTS
        |--------------------------------------------------------------------------
        */

    async fetchVariants() {
      if (!this.selectedService?.uuid) {
        this.variants = []

        return
      }

      this.loadingVariants = true

      this.clearError()

      try {
        const response = await ServiceVariantService.getByService(this.selectedService.uuid, {
          active: null,

          per_page: 100,
        })

        this.variants = collectionFrom(response)

        return response
      } catch (error) {
        this.setError(error, 'No fue posible cargar las variantes.')

        throw error
      } finally {
        this.loadingVariants = false
      }
    },

    async selectVariant(variant) {
      this.selectedVariant = variant

      await this.fetchPrices()
    },

    async createVariant(payload) {
      this.savingVariant = true

      this.clearError()

      try {
        const response = await ServiceVariantService.create({
          ...payload,

          service_id: this.selectedService.id,
        })

        const created = response.data.data

        await this.fetchVariants()

        await this.selectVariant(created)

        return created
      } catch (error) {
        this.setError(error, 'No fue posible crear la variante.')

        throw error
      } finally {
        this.savingVariant = false
      }
    },

    async updateVariant(variant, payload) {
      this.savingVariant = true

      this.clearError()

      try {
        const response = await ServiceVariantService.update(variant.id, {
          ...payload,

          service_id: this.selectedService.id,
        })

        const updated = response.data.data

        await this.fetchVariants()

        if (Number(this.selectedVariant?.id) === Number(updated.id)) {
          this.selectedVariant = updated

          await this.fetchPrices()
        }

        return updated
      } catch (error) {
        this.setError(error, 'No fue posible actualizar la variante.')

        throw error
      } finally {
        this.savingVariant = false
      }
    },

    async deleteVariant(variant) {
      this.deleting = true

      this.clearError()

      try {
        await ServiceVariantService.destroy(variant.id)

        if (Number(this.selectedVariant?.id) === Number(variant.id)) {
          this.resetVariantSelection()
        }

        await this.fetchVariants()
      } catch (error) {
        this.setError(error, 'No fue posible eliminar la variante.')

        throw error
      } finally {
        this.deleting = false
      }
    },

    /*
        |--------------------------------------------------------------------------
        | PRICES
        |--------------------------------------------------------------------------
        */

    async fetchPrices(params = {}) {
      if (!this.selectedService?.uuid || !this.selectedVariant?.id) {
        this.prices = []

        return
      }

      this.loadingPrices = true

      this.clearError()

      try {
        const response = await PriceService.getAll({
          ...this.priceFilters,

          ...params,

          service_variant_id: this.selectedVariant.id,
        })

        this.prices = collectionFrom(response)

        this.priceMeta = metaFrom(response)

        return response
      } catch (error) {
        this.setError(error, 'No fue posible cargar las tarifas.')

        throw error
      } finally {
        this.loadingPrices = false
      }
    },

    async createPrice(payload) {
      this.savingPrice = true

      this.clearError()

      try {
        const response = await PriceService.create({
          ...payload,

          service_variant_id: this.selectedVariant.id,
        })

        const created = response.data.data

        await this.fetchPrices()

        return created
      } catch (error) {
        this.setError(error, 'No fue posible crear la tarifa.')

        throw error
      } finally {
        this.savingPrice = false
      }
    },

    async updatePrice(price, payload) {
      this.savingPrice = true

      this.clearError()

      try {
        const response = await PriceService.update(price.id, {
          ...payload,

          service_variant_id: this.selectedVariant.id,
        })

        const updated = response.data.data

        await this.fetchPrices()

        return updated
      } catch (error) {
        this.setError(error, 'No fue posible actualizar la tarifa.')

        throw error
      } finally {
        this.savingPrice = false
      }
    },

    async deletePrice(price) {
      this.deleting = true

      this.clearError()

      try {
        await PriceService.destroy(price.id)

        await this.fetchPrices()
      } catch (error) {
        this.setError(error, 'No fue posible eliminar la tarifa.')

        throw error
      } finally {
        this.deleting = false
      }
    },
  },
})
