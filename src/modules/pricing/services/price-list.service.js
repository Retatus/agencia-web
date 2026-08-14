import api from '@/services/api'

const BASE_URL = '/pricing/price-lists'

const PriceListService = {
  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },

  get(id) {
    return api.get(`${BASE_URL}/${id}`)
  },
}

export default PriceListService
