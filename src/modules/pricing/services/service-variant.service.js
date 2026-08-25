import api from '@/services/api'

const BASE_URL = '/service-variants'

const SERVICES_URL = '/services'

function rejectMissing(value, message) {
  if (value === null || value === undefined || value === '') {
    return Promise.reject(new Error(message))
  }

  return null
}

const ServiceVariantService = {
  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },

  get(id) {
    const validation = rejectMissing(id, 'El ID de la variante es obligatorio.')

    if (validation) {
      return validation
    }

    return api.get(`${BASE_URL}/${id}`)
  },

  getByService(serviceUuid, params = {}) {
    const validation = rejectMissing(serviceUuid, 'El UUID del servicio es obligatorio.')

    if (validation) {
      return validation
    }

    return api.get(`${SERVICES_URL}/${serviceUuid}/variants`, {
      params,
    })
  },

  create(payload) {
    return api.post(BASE_URL, payload)
  },

  update(id, payload) {
    const validation = rejectMissing(id, 'El ID de la variante es obligatorio.')

    if (validation) {
      return validation
    }

    return api.patch(`${BASE_URL}/${id}`, payload)
  },

  destroy(id) {
    const validation = rejectMissing(id, 'El ID de la variante es obligatorio.')

    if (validation) {
      return validation
    }

    return api.delete(`${BASE_URL}/${id}`)
  },
}

export default ServiceVariantService
