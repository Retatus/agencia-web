import api from '@/services/api'

const RESOURCE = '/tourist-destinations'

export default {
  getAll(params = {}) {
    return api.get(RESOURCE, { params })
  },

  show(uuid) {
    return api.get(`${RESOURCE}/${uuid}`)
  },

  create(payload) {
    return api.post(RESOURCE, payload)
  },

  update(uuid, payload) {
    return api.put(`${RESOURCE}/${uuid}`, payload)
  },

  remove(uuid) {
    return api.delete(`${RESOURCE}/${uuid}`)
  },
}
