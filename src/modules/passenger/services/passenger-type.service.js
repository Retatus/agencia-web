import api from '@/services/api'

const BASE_URL = '/passenger-types'

const PassengerTypeService = {
  /*
  |--------------------------------------------------------------------------
  | LIST
  |--------------------------------------------------------------------------
  */

  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },

  /*
  |--------------------------------------------------------------------------
  | SHOW
  |--------------------------------------------------------------------------
  */

  get(id) {
    return api.get(`${BASE_URL}/${id}`)
  },
}

export default PassengerTypeService
