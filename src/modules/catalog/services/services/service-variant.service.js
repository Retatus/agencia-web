import api from '@/services/api'

const ServiceVariantService = {
  /*
  |--------------------------------------------------------------------------
  | LISTAR VARIANTES DE UN SERVICIO
  |--------------------------------------------------------------------------
  */

  getByService(serviceUuid, params = {}) {
    return api.get(`/catalog/services/${serviceUuid}/variants`, {
      params,
    })
  },

  /*
  |--------------------------------------------------------------------------
  | OBTENER UNA VARIANTE
  |--------------------------------------------------------------------------
  */

  get(serviceUuid, variantId) {
    return api.get(`/catalog/services/${serviceUuid}/variants/${variantId}`)
  },

  /*
  |--------------------------------------------------------------------------
  | CREAR
  |--------------------------------------------------------------------------
  */

  create(serviceUuid, data) {
    return api.post(`/catalog/services/${serviceUuid}/variants`, data)
  },

  /*
  |--------------------------------------------------------------------------
  | ACTUALIZAR
  |--------------------------------------------------------------------------
  */

  update(serviceUuid, variantId, data) {
    return api.put(`/catalog/services/${serviceUuid}/variants/${variantId}`, data)
  },

  /*
  |--------------------------------------------------------------------------
  | ELIMINAR
  |--------------------------------------------------------------------------
  */

  delete(serviceUuid, variantId) {
    return api.delete(`/catalog/services/${serviceUuid}/variants/${variantId}`)
  },
}

export default ServiceVariantService
