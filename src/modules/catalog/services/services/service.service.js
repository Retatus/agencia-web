import api from '@/services/api'
const BASE_URL = '/services'

class ServiceService {
  /**
   * Obtener listado de servicios.
   */
  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  }

  /**
   * Obtener un servicio por UUID.
   */
  get(uuid) {
    return api.get(`${BASE_URL}/${uuid}`)
  }

  /**
   * Crear servicio.
   */
  create(data) {
    return api.post(BASE_URL, data)
  }

  /**
   * Actualizar servicio.
   */
  update(uuid, data) {
    return api.put(`${BASE_URL}/${uuid}`, data)
  }

  /**
   * Eliminar servicio.
   */
  delete(uuid) {
    return api.delete(`${BASE_URL}/${uuid}`)
  }

  // Futuras funcionalidades

  getVariants(uuid) {}

  getDestinations(uuid) {}

  getPrices(uuid) {}

  duplicate(uuid) {}

  activate(uuid) {}

  deactivate(uuid) {}
}

export default new ServiceService()
