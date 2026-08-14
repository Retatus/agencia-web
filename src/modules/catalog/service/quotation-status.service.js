import api from '@/services/api'

const BASE_URL = '/quotations/statuses'

const QuotationStatusService = {
  getAll(params = {}) {
    return api.get(BASE_URL, {
      params,
    })
  },
}

export default QuotationStatusService
