import api from '@/services/api'

const BASE_URL = '/pricing/price-lists'

const PriceListService = {
  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },

  get(uuid) {
    return api.get(`${BASE_URL}/${uuid}`)
  },
}

export default PriceListService
