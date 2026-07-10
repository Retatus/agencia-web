import api from '@/services/api'

const BASE_URL = '/providers'

export default {
  /**
   * Obtener listado de proveedores.
   */
  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },

  /**
   * Obtener un proveedor.
   */
  get(uuid) {
    return api.get(`${BASE_URL}/${uuid}`)
  },

  /**
   * Crear proveedor.
   */
  store(data) {
    return api.post(BASE_URL, data)
  },

  /**
   * Actualizar proveedor.
   */
  update(uuid, data) {
    return api.put(`${BASE_URL}/${uuid}`, data)
  },

  /**
   * Eliminar proveedor.
   */
  destroy(uuid) {
    return api.delete(`${BASE_URL}/${uuid}`)
  },

  select() {
    return api.get(`${BASE_URL}/select`)
  },
}
