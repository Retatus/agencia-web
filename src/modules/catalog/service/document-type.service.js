import api from '@/services/api'

const BASE_URL = '/document-types'

const DocumentTypeService = {
  /**
   * Listado de tipos de documento
   */
  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },

  /**
   * Obtener un tipo de documento
   */
  get(id) {
    return api.get(`${BASE_URL}/${id}`)
  },
}

export default DocumentTypeService
