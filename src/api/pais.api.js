import api from '../config/axios'

export default {
  getAll() {
    return api.get('/paises')
  },

  get(id) {
    return api.get(`/paises/${id}`)
  },

  create(data) {
    return api.post('/paises', data)
  },

  update(id, data) {
    return api.put(`/paises/${id}`, data)
  },

  delete(id) {
    return api.delete(`/paises/${id}`)
  },
}
