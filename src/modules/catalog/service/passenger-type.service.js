import api from '@/services/api'

const BASE_URL = '/passenger-types'

const PassengerTypeService = {
  /**
   * Obtener tipos de pasajeros.
   */
  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },

  /**
   * Obtener un tipo de pasajero.
   */
  get(id) {
    return api.get(`${BASE_URL}/${id}`)
  },
}

export default PassengerTypeService
