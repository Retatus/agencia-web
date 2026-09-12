import api from '@/services/api'

const BASE_URL = '/countries'

export default {
  async getAll(params = {}) {
    const { data } = await api.get(BASE_URL, {
      params,
    })

    return data
  },

  async getActive() {
    const { data } = await api.get(BASE_URL, {
      params: {
        active: true,
        per_page: 999,
      },
    })

    return data
  },

  async getById(id) {
    const { data } = await api.get(`${BASE_URL}/${id}`)

    return data
  },
}
