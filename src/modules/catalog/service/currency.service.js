import api from '@/services/api'

const BASE_URL = '/currencies'

const CurrencyService = {
  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },
}

export default CurrencyService
