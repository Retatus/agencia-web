import { defineStore } from 'pinia'
import ProviderService from '../services/provider.service'

export const useProviderStore = defineStore('provider', {
  state: () => ({
    providers: [],
    provider: null,

    meta: {},
    links: {},

    loading: false,
  }),

  getters: {
    items: (state) => state.providers,

    pagination: (state) => state.meta,
  },

  actions: {
    /**
     * Obtener listado de proveedores.
     */
    async fetchProviders(params = {}) {
      this.loading = true

      try {
        const { data } = await ProviderService.getAll(params)
        this.providers = data.data
        this.meta = data.meta
        this.links = data.links
      } finally {
        this.loading = false
      }
    },

    /**
     * Obtener proveedor.
     */
    async fetchProvider(uuid) {
      this.loading = true

      try {
        const { data } = await ProviderService.get(uuid)

        this.provider = data.data

        return this.provider
      } finally {
        this.loading = false
      }
    },

    /**
     * Crear proveedor.
     */
    async createProvider(provider) {
      const { data } = await ProviderService.store(provider)
      return data
    },

    /**
     * Actualizar proveedor.
     */
    async updateProvider(uuid, provider) {
      const { data } = await ProviderService.update(uuid, provider)
      return data
    },

    /**
     * Eliminar proveedor.
     */
    async deleteProvider(uuid) {
      await ProviderService.destroy(uuid)

      this.providers = this.providers.filter((provider) => provider.uuid !== uuid)
    },

    /**
     * Limpiar proveedor seleccionado.
     */
    clearProvider() {
      this.provider = null
    },
  },
})
