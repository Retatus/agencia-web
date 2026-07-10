import { defineStore } from 'pinia'
import ServiceService from '../services/service.service'

export const useServiceStore = defineStore('service', {
  state: () => ({
    services: [],

    service: null,

    loading: false,

    meta: {},

    links: {},
  }),

  getters: {
    hasServices: (state) => state.services.length > 0,
  },

  actions: {
    /**
     * Obtener listado de servicios.
     */
    async fetchServices(params = {}) {
      this.loading = true

      try {
        const response = await ServiceService.getAll(params)
        console.log('servicios obtenidos ', response)
        this.services = response.data.data
        this.meta = response.data.meta
        this.links = response.data.links
      } finally {
        this.loading = false
      }
    },

    /**
     * Obtener un servicio por UUID.
     */
    async fetchService(uuid) {
      this.loading = true

      try {
        const response = await ServiceService.get(uuid)
        this.service = response.data.data
        return this.service
      } finally {
        this.loading = false
      }
    },

    /**
     * Crear un servicio.
     */
    async createService(data) {
      const response = await ServiceService.create(data)

      return response.data
    },

    /**
     * Actualizar un servicio.
     */
    async updateService(uuid, data) {
      const response = await ServiceService.update(uuid, data)

      return response.data
    },

    /**
     * Eliminar un servicio.
     */
    async deleteService(uuid) {
      const response = await ServiceService.delete(uuid)

      return response.data
    },

    /**
     * Limpiar el servicio seleccionado.
     */
    clearService() {
      this.service = null
    },
  },
})
