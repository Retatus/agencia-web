import api from '@/services/api'

const PriceListItemService = {
  getAll(priceListUuid, params = {}) {
    return api.get(`/pricing/price-lists/${priceListUuid}/items`, {
      params,
    })
  },

  create(priceListUuid, data) {
    return api.post(`/pricing/price-lists/${priceListUuid}/items`, data)
  },

  update(priceListUuid, itemId, data) {
    return api.put(`/pricing/price-lists/${priceListUuid}/items/${itemId}`, data)
  },

  delete(priceListUuid, itemId) {
    return api.delete(`/pricing/price-lists/${priceListUuid}/items/${itemId}`)
  },
}

export default PriceListItemService
