import api from '@/services/api'

const BASE_URL = '/pricing/price-types'

const PriceTypeService = {
  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },
}

export default PriceTypeService
