import api from '@/services/api'
const RESOURCE = '/quotations'

export default {
  calculate(payload) {
    return api.post(`${RESOURCE}/calculate`, payload)
  },
}
