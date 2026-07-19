import api from '@/services/api'

const RESOURCE = '/quotations'

export default {
  /**
   * Obtener listado de cotizaciones
   */
  getAll(params = {}) {
    return api.get(RESOURCE, { params })
  },

  /**
   * Obtener una cotización
   */
  show(uuid) {
    return api.get(`${RESOURCE}/${uuid}`)
  },

  /**
   * Crear cotización
   */
  store(data) {
    return api.post(RESOURCE, data)
  },

  /**
   * Actualizar cotización
   */
  update(uuid, data) {
    return api.put(`${RESOURCE}/${uuid}`, data)
  },

  /**
   * Eliminar cotización
   */
  destroy(uuid) {
    return api.delete(`${RESOURCE}/${uuid}`)
  },

  /**
   * Duplicar cotización (para futuras versiones)
   */
  duplicate(uuid) {
    return api.post(`${RESOURCE}/${uuid}/duplicate`)
  },

  /**
   * Cambiar estado (Borrador, Enviada, Aprobada, etc.)
   */
  changeStatus(uuid, quotation_status_id) {
    return api.patch(`${RESOURCE}/${uuid}/status`, {
      quotation_status_id,
    })
  },
}
