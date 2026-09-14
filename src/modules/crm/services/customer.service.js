// modules/cm/services/customer.service.js
import api from '@/services/api'

export default {
  getAll(params = {}) {
    return api.get('/crm/customers', { params })
  },

  get(uuid) {
    return api.get(`/crm/customers/${uuid}`)
  },

  create(data) {
    return api.post('/crm/customers', data)
  },

  update(uuid, data) {
    return api.put(`/crm/customers/${uuid}`, data)
  },

  delete(uuid) {
    return api.delete(`/crm/customers/${uuid}`)
  },
}
