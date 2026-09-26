import api from '@/services/api'

const BASE_URL = '/pricing/price-list-items'

const PriceListItemService = {
  getAll(params = {}) {
    return api.get(BASE_URL, { params })
  },

  create(payload) {
    return api.post(BASE_URL, payload)
  },

  update(id, payload) {
    return api.patch(`${BASE_URL}/${id}`, payload)
  },

  destroy(id) {
    return api.delete(`${BASE_URL}/${id}`)
  },
}

export default PriceListItemService
